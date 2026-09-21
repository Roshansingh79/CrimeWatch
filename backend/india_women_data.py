import sys
import os
import io
import csv
from pathlib import Path
from typing import Dict, Any, List, Optional

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.database import get_db_connection

CSV_PATH = PROJECT_ROOT / "data" / "crimes_against_women_2001_2014.csv"

STATE_NORM_MAP = {
    "A & N ISLANDS": "Andaman & Nicobar",
    "A & N Islands": "Andaman & Nicobar",
    "A&N Islands": "Andaman & Nicobar",
    "ANDHRA PRADESH": "Andhra Pradesh",
    "Andhra Pradesh": "Andhra Pradesh",
    "ARUNACHAL PRADESH": "Arunachal Pradesh",
    "Arunachal Pradesh": "Arunachal Pradesh",
    "ASSAM": "Assam",
    "Assam": "Assam",
    "BIHAR": "Bihar",
    "Bihar": "Bihar",
    "CHANDIGARH": "Chandigarh",
    "Chandigarh": "Chandigarh",
    "CHHATTISGARH": "Chhattisgarh",
    "Chhattisgarh": "Chhattisgarh",
    "D & N HAVELI": "Dadra & Nagar Haveli and Daman & Diu",
    "D&N Haveli": "Dadra & Nagar Haveli and Daman & Diu",
    "DAMAN & DIU": "Dadra & Nagar Haveli and Daman & Diu",
    "Daman & Diu": "Dadra & Nagar Haveli and Daman & Diu",
    "DELHI": "Delhi (NCT)",
    "Delhi UT": "Delhi (NCT)",
    "GOA": "Goa",
    "Goa": "Goa",
    "GUJARAT": "Gujarat",
    "Gujarat": "Gujarat",
    "HARYANA": "Haryana",
    "Haryana": "Haryana",
    "HIMACHAL PRADESH": "Himachal Pradesh",
    "Himachal Pradesh": "Himachal Pradesh",
    "JAMMU & KASHMIR": "Jammu & Kashmir",
    "Jammu & Kashmir": "Jammu & Kashmir",
    "JHARKHAND": "Jharkhand",
    "Jharkhand": "Jharkhand",
    "KARNATAKA": "Karnataka",
    "Karnataka": "Karnataka",
    "KERALA": "Kerala",
    "Kerala": "Kerala",
    "LAKSHADWEEP": "Lakshadweep",
    "Lakshadweep": "Lakshadweep",
    "MADHYA PRADESH": "Madhya Pradesh",
    "Madhya Pradesh": "Madhya Pradesh",
    "MAHARASHTRA": "Maharashtra",
    "Maharashtra": "Maharashtra",
    "MANIPUR": "Manipur",
    "Manipur": "Manipur",
    "MEGHALAYA": "Meghalaya",
    "Meghalaya": "Meghalaya",
    "MIZORAM": "Mizoram",
    "Mizoram": "Mizoram",
    "NAGALAND": "Nagaland",
    "Nagaland": "Nagaland",
    "ODISHA": "Odisha",
    "Odisha": "Odisha",
    "PUDUCHERRY": "Puducherry",
    "Puducherry": "Puducherry",
    "PUNJAB": "Punjab",
    "Punjab": "Punjab",
    "RAJASTHAN": "Rajasthan",
    "Rajasthan": "Rajasthan",
    "SIKKIM": "Sikkim",
    "Sikkim": "Sikkim",
    "TAMIL NADU": "Tamil Nadu",
    "Tamil Nadu": "Tamil Nadu",
    "Telangana": "Telangana",
    "TRIPURA": "Tripura",
    "Tripura": "Tripura",
    "UTTAR PRADESH": "Uttar Pradesh",
    "Uttar Pradesh": "Uttar Pradesh",
    "UTTARAKHAND": "Uttarakhand",
    "Uttarakhand": "Uttarakhand",
    "WEST BENGAL": "West Bengal",
    "West Bengal": "West Bengal"
}

TOTAL_DISTRICT_MARKERS = {"TOTAL", "DELHI UT TOTAL", "TOTAL DISTRICT(S)", "ZZ TOTAL", "TOTAL DISTRICTS"}

def init_women_data_table(force_recreate: bool = False):
    """Initializes and seeds the Crimes Against Women table in SQLite."""
    conn = get_db_connection()
    c = conn.cursor()

    if force_recreate:
        c.execute("DROP TABLE IF EXISTS india_crimes_against_women")

    c.execute("""
    CREATE TABLE IF NOT EXISTS india_crimes_against_women (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        state_ut TEXT,
        district TEXT,
        year INTEGER,
        rape INTEGER DEFAULT 0,
        kidnapping_abduction INTEGER DEFAULT 0,
        dowry_deaths INTEGER DEFAULT 0,
        assault_on_women INTEGER DEFAULT 0,
        insult_to_modesty INTEGER DEFAULT 0,
        cruelty_by_husband INTEGER DEFAULT 0,
        importation_of_girls INTEGER DEFAULT 0,
        total_crimes INTEGER DEFAULT 0,
        is_state_total INTEGER DEFAULT 0
    );
    """)

    c.execute("CREATE INDEX IF NOT EXISTS idx_women_year ON india_crimes_against_women(year);")
    c.execute("CREATE INDEX IF NOT EXISTS idx_women_state_year ON india_crimes_against_women(state_ut, year);")
    c.execute("CREATE INDEX IF NOT EXISTS idx_women_district ON india_crimes_against_women(district);")
    c.execute("CREATE INDEX IF NOT EXISTS idx_women_total_flag ON india_crimes_against_women(is_state_total);")

    # Check if table already populated
    c.execute("SELECT COUNT(*) as count FROM india_crimes_against_women")
    row_count = c.fetchone()["count"]

    if row_count == 0 and CSV_PATH.exists():
        records = []
        with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                raw_state = row.get("STATE/UT", "").strip()
                state_ut = STATE_NORM_MAP.get(raw_state, raw_state.title())
                raw_district = row.get("DISTRICT", "").strip()

                is_total = 1 if raw_district.upper() in TOTAL_DISTRICT_MARKERS else 0
                district_name = "State Total" if is_total else raw_district.title()

                year = int(row.get("Year", 0) or 0)
                rape = int(row.get("Rape", 0) or 0)
                kidnap = int(row.get("Kidnapping and Abduction", 0) or 0)
                dowry = int(row.get("Dowry Deaths", 0) or 0)
                assault = int(row.get("Assault on women with intent to outrage her modesty", 0) or 0)
                insult = int(row.get("Insult to modesty of Women", 0) or 0)
                cruelty = int(row.get("Cruelty by Husband or his Relatives", 0) or 0)
                importation = int(row.get("Importation of Girls", 0) or 0)
                total = rape + kidnap + dowry + assault + insult + cruelty + importation

                records.append((
                    state_ut, district_name, year, rape, kidnap, dowry,
                    assault, insult, cruelty, importation, total, is_total
                ))

        if records:
            c.executemany("""
            INSERT INTO india_crimes_against_women (
                state_ut, district, year, rape, kidnapping_abduction, dowry_deaths,
                assault_on_women, insult_to_modesty, cruelty_by_husband, importation_of_girls,
                total_crimes, is_state_total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, records)

    conn.commit()
    conn.close()

def get_women_crime_summary(state: Optional[str] = None, district: Optional[str] = None, year: Optional[int] = None) -> Dict[str, Any]:
    """Returns high-level summary KPIs and indicators for crimes against women."""
    conn = get_db_connection()
    c = conn.cursor()

    params = []
    where_clauses = []

    if state:
        where_clauses.append("state_ut = ?")
        params.append(state)

    if district:
        where_clauses.append("district = ?")
        params.append(district.title())
        where_clauses.append("is_state_total = 0")
    else:
        # If no specific district, use real district records for aggregation
        where_clauses.append("is_state_total = 0")

    if year:
        where_clauses.append("year = ?")
        params.append(year)

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

    query = f"""
    SELECT 
        COUNT(*) as record_count,
        SUM(total_crimes) as total_crimes,
        SUM(rape) as total_rape,
        SUM(kidnapping_abduction) as total_kidnap,
        SUM(dowry_deaths) as total_dowry,
        SUM(assault_on_women) as total_assault,
        SUM(insult_to_modesty) as total_insult,
        SUM(cruelty_by_husband) as total_cruelty,
        SUM(importation_of_girls) as total_importation
    FROM india_crimes_against_women
    {where_sql}
    """
    c.execute(query, params)
    res = dict(c.fetchone())

    total = res["total_crimes"] or 0
    cruelty = res["total_cruelty"] or 0
    rape = res["total_rape"] or 0
    assault = res["total_assault"] or 0
    dowry = res["total_dowry"] or 0
    kidnap = res["total_kidnap"] or 0
    insult = res["total_insult"] or 0

    cruelty_pct = round((cruelty / (total or 1)) * 100, 1)
    rape_pct = round((rape / (total or 1)) * 100, 1)
    assault_pct = round((assault / (total or 1)) * 100, 1)
    dowry_pct = round((dowry / (total or 1)) * 100, 1)

    # Calculate 2001 vs 2014 growth
    c.execute("""
    SELECT 
        SUM(CASE WHEN year = 2001 THEN total_crimes ELSE 0 END) as total_2001,
        SUM(CASE WHEN year = 2014 THEN total_crimes ELSE 0 END) as total_2014
    FROM india_crimes_against_women
    WHERE is_state_total = 0
    """)
    growth_res = dict(c.fetchone())
    total_2001 = growth_res["total_2001"] or 1
    total_2014 = growth_res["total_2014"] or 1
    national_growth_pct = round(((total_2014 - total_2001) / total_2001) * 100, 1)

    # Top 5 affected states
    state_params = [year] if year else []
    state_where = "WHERE is_state_total = 0 AND year = ?" if year else "WHERE is_state_total = 0"
    c.execute(f"""
    SELECT state_ut, SUM(total_crimes) as total, SUM(rape) as rape, SUM(cruelty_by_husband) as cruelty
    FROM india_crimes_against_women
    {state_where}
    GROUP BY state_ut
    ORDER BY total DESC
    LIMIT 5
    """, state_params)
    top_states = [dict(r) for r in c.fetchall()]

    conn.close()

    return {
        "record_count": res["record_count"],
        "total_crimes": total,
        "rape": rape,
        "rape_pct": rape_pct,
        "kidnapping_abduction": kidnap,
        "dowry_deaths": dowry,
        "dowry_pct": dowry_pct,
        "assault_on_women": assault,
        "assault_pct": assault_pct,
        "insult_to_modesty": insult,
        "cruelty_by_husband": cruelty,
        "cruelty_pct": cruelty_pct,
        "importation_of_girls": res["total_importation"] or 0,
        "selected_year": year or "All Years (2001-2014)",
        "selected_state": state or "All India",
        "selected_district": district or "All Districts",
        "longitudinal_growth_pct": national_growth_pct,
        "top_states": top_states
    }

def get_women_temporal_trend(state: Optional[str] = None, district: Optional[str] = None) -> List[Dict[str, Any]]:
    """Returns year-by-year historical progression from 2001 to 2014."""
    conn = get_db_connection()
    c = conn.cursor()

    params = []
    where_clauses = ["is_state_total = 0"]

    if state:
        where_clauses.append("state_ut = ?")
        params.append(state)

    if district:
        where_clauses.append("district = ?")
        params.append(district.title())

    where_sql = f"WHERE {' AND '.join(where_clauses)}"

    query = f"""
    SELECT 
        year,
        SUM(total_crimes) as total_crimes,
        SUM(rape) as rape,
        SUM(kidnapping_abduction) as kidnapping_abduction,
        SUM(dowry_deaths) as dowry_deaths,
        SUM(assault_on_women) as assault_on_women,
        SUM(insult_to_modesty) as insult_to_modesty,
        SUM(cruelty_by_husband) as cruelty_by_husband,
        SUM(importation_of_girls) as importation_of_girls
    FROM india_crimes_against_women
    {where_sql}
    GROUP BY year
    ORDER BY year ASC
    """
    c.execute(query, params)
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

def get_women_category_breakdown(state: Optional[str] = None, district: Optional[str] = None, year: Optional[int] = None) -> Dict[str, Any]:
    """Returns crime head proportions for donut/pie visualizations."""
    conn = get_db_connection()
    c = conn.cursor()

    params = []
    where_clauses = ["is_state_total = 0"]

    if state:
        where_clauses.append("state_ut = ?")
        params.append(state)

    if district:
        where_clauses.append("district = ?")
        params.append(district.title())

    if year:
        where_clauses.append("year = ?")
        params.append(year)

    where_sql = f"WHERE {' AND '.join(where_clauses)}"

    query = f"""
    SELECT 
        SUM(rape) as rape,
        SUM(kidnapping_abduction) as kidnapping_abduction,
        SUM(dowry_deaths) as dowry_deaths,
        SUM(assault_on_women) as assault_on_women,
        SUM(insult_to_modesty) as insult_to_modesty,
        SUM(cruelty_by_husband) as cruelty_by_husband,
        SUM(importation_of_girls) as importation_of_girls,
        SUM(total_crimes) as total_crimes
    FROM india_crimes_against_women
    {where_sql}
    """
    c.execute(query, params)
    row = dict(c.fetchone())
    conn.close()

    total = row.get("total_crimes") or 1

    categories = [
        {"name": "Cruelty by Husband (Sec 498A)", "key": "cruelty_by_husband", "count": row["cruelty_by_husband"] or 0, "pct": round(((row["cruelty_by_husband"] or 0) / total) * 100, 1), "color": "#f43f5e"},
        {"name": "Assault on Modesty (Sec 354)", "key": "assault_on_women", "count": row["assault_on_women"] or 0, "pct": round(((row["assault_on_women"] or 0) / total) * 100, 1), "color": "#fb923c"},
        {"name": "Kidnapping & Abduction", "key": "kidnapping_abduction", "count": row["kidnapping_abduction"] or 0, "pct": round(((row["kidnapping_abduction"] or 0) / total) * 100, 1), "color": "#f59e0b"},
        {"name": "Rape (Sec 376)", "key": "rape", "count": row["rape"] or 0, "pct": round(((row["rape"] or 0) / total) * 100, 1), "color": "#ef4444"},
        {"name": "Dowry Deaths (Sec 304B)", "key": "dowry_deaths", "count": row["dowry_deaths"] or 0, "pct": round(((row["dowry_deaths"] or 0) / total) * 100, 1), "color": "#8b5cf6"},
        {"name": "Insult to Modesty (Sec 509)", "key": "insult_to_modesty", "count": row["insult_to_modesty"] or 0, "pct": round(((row["insult_to_modesty"] or 0) / total) * 100, 1), "color": "#06b6d4"},
        {"name": "Importation of Girls", "key": "importation_of_girls", "count": row["importation_of_girls"] or 0, "pct": round(((row["importation_of_girls"] or 0) / total) * 100, 1), "color": "#10b981"}
    ]

    return {
        "total_crimes": total if row.get("total_crimes") else 0,
        "categories": categories
    }

def get_women_districts(
    state: Optional[str] = None,
    district: Optional[str] = None,
    year: Optional[int] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "total_crimes",
    sort_order: str = "desc",
    limit: int = 50,
    offset: int = 0
) -> Dict[str, Any]:
    """Returns filterable and paginated district records."""
    conn = get_db_connection()
    c = conn.cursor()

    valid_sort_cols = {
        "year", "state_ut", "district", "total_crimes", "rape",
        "kidnapping_abduction", "dowry_deaths", "assault_on_women",
        "insult_to_modesty", "cruelty_by_husband", "importation_of_girls"
    }
    sort_col = sort_by if sort_by in valid_sort_cols else "total_crimes"
    order = "ASC" if sort_order.lower() == "asc" else "DESC"

    where_clauses = ["is_state_total = 0"]
    params = []

    if state:
        where_clauses.append("state_ut = ?")
        params.append(state)

    if district:
        where_clauses.append("district = ?")
        params.append(district.title())

    if year:
        where_clauses.append("year = ?")
        params.append(year)

    if search:
        search_term = f"%{search.strip().lower()}%"
        where_clauses.append("(LOWER(district) LIKE ? OR LOWER(state_ut) LIKE ?)")
        params.extend([search_term, search_term])

    where_sql = f"WHERE {' AND '.join(where_clauses)}"

    # Get total count
    count_query = f"SELECT COUNT(*) as total FROM india_crimes_against_women {where_sql}"
    c.execute(count_query, params)
    total_records = c.fetchone()["total"]

    # Fetch rows
    data_query = f"""
    SELECT 
        id, state_ut, district, year, rape, kidnapping_abduction,
        dowry_deaths, assault_on_women, insult_to_modesty,
        cruelty_by_husband, importation_of_girls, total_crimes
    FROM india_crimes_against_women
    {where_sql}
    ORDER BY {sort_col} {order}
    LIMIT ? OFFSET ?
    """
    c.execute(data_query, params + [limit, offset])
    rows = [dict(r) for r in c.fetchall()]

    conn.close()

    return {
        "total": total_records,
        "limit": limit,
        "offset": offset,
        "records": rows
    }

def get_women_states_comparison(year: Optional[int] = None, sort_by: str = "total_crimes") -> List[Dict[str, Any]]:
    """Returns state rankings for crimes against women."""
    conn = get_db_connection()
    c = conn.cursor()

    valid_cols = {"total_crimes", "rape", "cruelty_by_husband", "assault_on_women", "dowry_deaths", "kidnapping_abduction"}
    sort_col = sort_by if sort_by in valid_cols else "total_crimes"

    params = []
    where_sql = "WHERE is_state_total = 0"
    if year:
        where_sql += " AND year = ?"
        params.append(year)

    query = f"""
    SELECT 
        state_ut,
        SUM(total_crimes) as total_crimes,
        SUM(rape) as rape,
        SUM(kidnapping_abduction) as kidnapping_abduction,
        SUM(dowry_deaths) as dowry_deaths,
        SUM(assault_on_women) as assault_on_women,
        SUM(insult_to_modesty) as insult_to_modesty,
        SUM(cruelty_by_husband) as cruelty_by_husband,
        COUNT(DISTINCT district) as district_count
    FROM india_crimes_against_women
    {where_sql}
    GROUP BY state_ut
    ORDER BY {sort_col} DESC
    """
    c.execute(query, params)
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

def export_women_crimes_csv(state: Optional[str] = None, year: Optional[int] = None) -> str:
    """Exports filtered crimes against women dataset as CSV text."""
    conn = get_db_connection()
    c = conn.cursor()

    params = []
    where_clauses = ["is_state_total = 0"]

    if state:
        where_clauses.append("state_ut = ?")
        params.append(state)

    if year:
        where_clauses.append("year = ?")
        params.append(year)

    where_sql = f"WHERE {' AND '.join(where_clauses)}"

    query = f"""
    SELECT 
        year, state_ut, district, rape, kidnapping_abduction,
        dowry_deaths, assault_on_women, insult_to_modesty,
        cruelty_by_husband, importation_of_girls, total_crimes
    FROM india_crimes_against_women
    {where_sql}
    ORDER BY year DESC, total_crimes DESC
    """
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Year", "State / UT", "District", "Rape (Sec 376)", "Kidnapping & Abduction",
        "Dowry Deaths (Sec 304B)", "Assault on Modesty (Sec 354)", "Insult to Modesty (Sec 509)",
        "Cruelty by Husband (Sec 498A)", "Importation of Girls", "Total Crimes Against Women"
    ])

    for r in rows:
        writer.writerow([
            r["year"], r["state_ut"], r["district"], r["rape"], r["kidnapping_abduction"],
            r["dowry_deaths"], r["assault_on_women"], r["insult_to_modesty"],
            r["cruelty_by_husband"], r["importation_of_girls"], r["total_crimes"]
        ])

    return output.getvalue()

if __name__ == "__main__":
    init_women_data_table(force_recreate=True)
    summary = get_women_crime_summary()
    print("Seeded successfully. Summary:", summary)
