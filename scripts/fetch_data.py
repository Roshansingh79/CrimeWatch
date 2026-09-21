import sys
import os
from pathlib import Path
from datetime import datetime
import requests
import sqlite3

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.database import get_db_connection, init_db

CHICAGO_API_URL = "https://data.cityofchicago.org/resource/ijzp-q8t2.json"

VIOLENT_CRIMES = {
    "HOMICIDE",
    "CRIMINAL SEXUAL ASSAULT",
    "ROBBERY",
    "BATTERY",
    "ASSAULT",
    "WEAPONS VIOLATION",
    "KIDNAPPING",
    "OFFENSE INVOLVING CHILDREN"
}

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def parse_incident(item):
    """Cleans and standardizes a single raw incident record."""
    raw_id = item.get("id")
    if not raw_id:
        return None

    # Parse date
    raw_date = item.get("date", "")
    parsed_date = None
    year, month, day, hour, dow, day_name = None, None, None, None, None, None

    if raw_date:
        try:
            # Handle ISO timestamp like 2026-09-04T14:30:00.000
            clean_date_str = raw_date.split(".")[0]
            dt = datetime.fromisoformat(clean_date_str)
            parsed_date = dt.strftime("%Y-%m-%d %H:%M:%S")
            year = dt.year
            month = dt.month
            day = dt.day
            hour = dt.hour
            dow = dt.weekday()
            day_name = DAYS_OF_WEEK[dow]
        except Exception:
            pass

    # Parse coordinates
    lat = item.get("latitude")
    lon = item.get("longitude")
    try:
        lat = float(lat) if lat is not None else None
        lon = float(lon) if lon is not None else None
        # Basic Chicago bounds check
        if lat and (lat < 41.5 or lat > 42.2):
            lat = None
        if lon and (lon < -88.1 or lon > -87.4):
            lon = None
    except (ValueError, TypeError):
        lat, lon = None, None

    # Categorization
    primary_type = (item.get("primary_type") or "OTHER").strip().upper()
    is_violent = 1 if primary_type in VIOLENT_CRIMES else 0

    # Booleans
    arrest_val = item.get("arrest")
    arrest = 1 if arrest_val is True or str(arrest_val).lower() == "true" else 0

    domestic_val = item.get("domestic")
    domestic = 1 if domestic_val is True or str(domestic_val).lower() == "true" else 0

    district = str(item.get("district", "")).strip().zfill(3) if item.get("district") else "Unknown"

    return (
        str(raw_id),
        item.get("case_number", ""),
        parsed_date or raw_date,
        year or int(item.get("year", 2026)),
        month,
        day,
        dow,
        day_name,
        hour,
        item.get("block", "UNKNOWN"),
        item.get("iucr", ""),
        primary_type,
        item.get("description", ""),
        item.get("location_description", "OTHER").strip().upper(),
        arrest,
        domestic,
        item.get("beat", ""),
        district,
        str(item.get("ward", "")),
        str(item.get("community_area", "")),
        item.get("fbi_code", ""),
        lat,
        lon,
        is_violent
    )

def fetch_and_ingest(target_records=15000, batch_size=5000):
    """Fetches real records from the City of Chicago API and saves them into SQLite."""
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    total_inserted = 0
    offset = 0

    print(f"[*] Starting ingestion from City of Chicago API (target: {target_records} incidents)...")

    while total_inserted < target_records:
        limit = min(batch_size, target_records - total_inserted)
        params = {
            "$limit": limit,
            "$offset": offset,
            "$order": "date DESC"
        }

        try:
            resp = requests.get(CHICAGO_API_URL, params=params, timeout=30)
            resp.raise_for_status()
            data = resp.json()

            if not data:
                print("[!] No more records returned from API.")
                break

            cleaned_records = []
            for item in data:
                cleaned = parse_incident(item)
                if cleaned:
                    cleaned_records.append(cleaned)

            if cleaned_records:
                cursor.executemany("""
                INSERT OR REPLACE INTO crimes (
                    id, case_number, date, year, month, day, day_of_week, day_name,
                    hour, block, iucr, primary_type, description, location_description,
                    arrest, domestic, beat, district, ward, community_area, fbi_code,
                    latitude, longitude, is_violent
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, cleaned_records)
                conn.commit()

                total_inserted += len(cleaned_records)
                offset += len(data)
                print(f"    -> Ingested {len(cleaned_records)} records (Progress: {total_inserted}/{target_records})")

            if len(data) < limit:
                break

        except Exception as e:
            print(f"[x] Error during fetch: {e}")
            break

    conn.close()
    print(f"[✓] Successfully ingested {total_inserted} real crime incidents into the database.")
    return total_inserted

if __name__ == "__main__":
    count = 15000
    if len(sys.argv) > 1:
        try:
            count = int(sys.argv[1])
        except ValueError:
            pass
    fetch_and_ingest(target_records=count)
