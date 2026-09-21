import sqlite3
from typing import Dict, Any, List, Optional
from backend.database import get_db_connection

DISTRICT_NAMES = {
    "001": "Central / Loop",
    "002": "Wentworth",
    "003": "Grand Crossing",
    "004": "South Chicago",
    "005": "Calumet",
    "006": "Gresham",
    "007": "Englewood",
    "008": "Chicago Lawn",
    "009": "Deering",
    "010": "Ogden",
    "011": "Harrison",
    "012": "Near West",
    "014": "Shakespeare",
    "015": "Austin",
    "016": "Jefferson Park",
    "017": "Albany Park",
    "018": "Near North",
    "019": "Town Hall",
    "020": "Lincoln",
    "022": "Morgan Park",
    "024": "Rogers Park",
    "025": "Grand Central"
}

def build_where_clause(filters: Dict[str, Any]) -> tuple[str, List[Any]]:
    """Constructs dynamic SQL WHERE clause and parameters from filter dictionary."""
    clauses = ["1=1"]
    params = []

    if filters.get("primary_type"):
        clauses.append("primary_type = ?")
        params.append(filters["primary_type"])

    if filters.get("district"):
        clauses.append("district = ?")
        params.append(filters["district"])

    if filters.get("arrest") is not None:
        clauses.append("arrest = ?")
        params.append(int(filters["arrest"]))

    if filters.get("domestic") is not None:
        clauses.append("domestic = ?")
        params.append(int(filters["domestic"]))

    if filters.get("is_violent") is not None:
        clauses.append("is_violent = ?")
        params.append(int(filters["is_violent"]))

    if filters.get("date_start"):
        clauses.append("date >= ?")
        params.append(filters["date_start"] + " 00:00:00")

    if filters.get("date_end"):
        clauses.append("date <= ?")
        params.append(filters["date_end"] + " 23:59:59")

    if filters.get("hour_start") is not None and filters.get("hour_end") is not None:
        h_start = int(filters["hour_start"])
        h_end = int(filters["hour_end"])
        if h_start <= h_end:
            clauses.append("hour BETWEEN ? AND ?")
            params.extend([h_start, h_end])
        else:
            clauses.append("(hour >= ? OR hour <= ?)")
            params.extend([h_start, h_end])

    if filters.get("search"):
        search_term = f"%{filters['search'].strip()}%"
        clauses.append("(case_number LIKE ? OR block LIKE ? OR description LIKE ?)")
        params.extend([search_term, search_term, search_term])

    return " AND ".join(clauses), params

def get_kpis(filters: Dict[str, Any] = {}) -> Dict[str, Any]:
    """Computes high-level Key Performance Indicators for the current filters."""
    where_sql, params = build_where_clause(filters)
    conn = get_db_connection()
    c = conn.cursor()

    query = f"""
    SELECT
        COUNT(*) as total_incidents,
        SUM(is_violent) as violent_incidents,
        SUM(arrest) as arrest_count,
        SUM(domestic) as domestic_count
    FROM crimes
    WHERE {where_sql}
    """
    c.execute(query, params)
    row = c.fetchone()

    total = row["total_incidents"] or 0
    violent = row["violent_incidents"] or 0
    arrests = row["arrest_count"] or 0
    domestic = row["domestic_count"] or 0

    violent_rate = round((violent / total * 100), 1) if total > 0 else 0.0
    arrest_rate = round((arrests / total * 100), 1) if total > 0 else 0.0
    domestic_rate = round((domestic / total * 100), 1) if total > 0 else 0.0

    # Top crime type
    c.execute(f"""
        SELECT primary_type, COUNT(*) as cnt
        FROM crimes
        WHERE {where_sql}
        GROUP BY primary_type
        ORDER BY cnt DESC
        LIMIT 1
    """, params)
    top_type_row = c.fetchone()
    top_crime_type = top_type_row["primary_type"] if top_type_row else "N/A"

    # Top district
    c.execute(f"""
        SELECT district, COUNT(*) as cnt
        FROM crimes
        WHERE {where_sql} AND district != 'Unknown'
        GROUP BY district
        ORDER BY cnt DESC
        LIMIT 1
    """, params)
    top_dist_row = c.fetchone()
    top_district_id = top_dist_row["district"] if top_dist_row else "N/A"
    top_district_name = DISTRICT_NAMES.get(top_district_id, f"District {top_district_id}")

    # Safest district
    c.execute(f"""
        SELECT district, COUNT(*) as cnt
        FROM crimes
        WHERE {where_sql} AND district != 'Unknown'
        GROUP BY district
        ORDER BY cnt ASC
        LIMIT 1
    """, params)
    safe_dist_row = c.fetchone()
    safest_district_id = safe_dist_row["district"] if safe_dist_row else "N/A"
    safest_district_name = DISTRICT_NAMES.get(safest_district_id, f"District {safest_district_id}")

    # Date range
    c.execute(f"SELECT MIN(date) as min_d, MAX(date) as max_d FROM crimes WHERE {where_sql}", params)
    date_range_row = c.fetchone()

    conn.close()

    return {
        "total_incidents": total,
        "violent_incidents": violent,
        "violent_rate": violent_rate,
        "property_incidents": total - violent,
        "property_rate": round(100.0 - violent_rate, 1) if total > 0 else 0.0,
        "arrest_count": arrests,
        "arrest_rate": arrest_rate,
        "domestic_count": domestic,
        "domestic_rate": domestic_rate,
        "top_crime_type": top_crime_type,
        "top_district": {
            "id": top_district_id,
            "name": top_district_name,
            "count": top_dist_row["cnt"] if top_dist_row else 0
        },
        "safest_district": {
            "id": safest_district_id,
            "name": safest_district_name,
            "count": safe_dist_row["cnt"] if safe_dist_row else 0
        },
        "date_range": {
            "start": date_range_row["min_d"] if date_range_row else None,
            "end": date_range_row["max_d"] if date_range_row else None
        }
    }

def get_temporal_analytics(filters: Dict[str, Any] = {}) -> Dict[str, Any]:
    """Generates 24-hour diurnal patterns, day-of-week trends, and daily timeline."""
    where_sql, params = build_where_clause(filters)
    conn = get_db_connection()
    c = conn.cursor()

    # 1. 24-hour diurnal curve
    c.execute(f"""
        SELECT hour, COUNT(*) as count, SUM(is_violent) as violent
        FROM crimes
        WHERE {where_sql} AND hour IS NOT NULL
        GROUP BY hour
        ORDER BY hour ASC
    """, params)
    hourly_raw = {r["hour"]: {"count": r["count"], "violent": r["violent"] or 0} for r in c.fetchall()}
    hourly_data = [
        {
            "hour": h,
            "label": f"{h:02d}:00",
            "count": hourly_raw.get(h, {}).get("count", 0),
            "violent": hourly_raw.get(h, {}).get("violent", 0)
        }
        for h in range(24)
    ]

    # Peak crime hour
    peak_hour = max(hourly_data, key=lambda x: x["count"]) if hourly_data else None

    # 2. Day of Week distribution
    days_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    c.execute(f"""
        SELECT day_of_week, day_name, COUNT(*) as count, SUM(is_violent) as violent
        FROM crimes
        WHERE {where_sql} AND day_of_week IS NOT NULL
        GROUP BY day_of_week, day_name
        ORDER BY day_of_week ASC
    """, params)
    dow_raw = {r["day_of_week"]: {"name": r["day_name"], "count": r["count"], "violent": r["violent"] or 0} for r in c.fetchall()}
    dow_data = [
        {
            "day_index": i,
            "day_name": days_order[i],
            "count": dow_raw.get(i, {}).get("count", 0),
            "violent": dow_raw.get(i, {}).get("violent", 0)
        }
        for i in range(7)
    ]

    # 3. Daily timeline
    c.execute(f"""
        SELECT substr(date, 1, 10) as day_str, COUNT(*) as count, SUM(is_violent) as violent, SUM(arrest) as arrest
        FROM crimes
        WHERE {where_sql} AND date IS NOT NULL
        GROUP BY day_str
        ORDER BY day_str ASC
    """, params)
    timeline = [
        {
            "date": r["day_str"],
            "count": r["count"],
            "violent": r["violent"] or 0,
            "arrest": r["arrest"] or 0
        }
        for r in c.fetchall()
    ]

    conn.close()

    return {
        "hourly": hourly_data,
        "peak_hour": peak_hour,
        "day_of_week": dow_data,
        "timeline": timeline
    }

def get_spatial_points(filters: Dict[str, Any] = {}, limit: int = 2500) -> List[Dict[str, Any]]:
    """Returns geospatial coordinate points with crime details and heatmap intensity weights."""
    where_sql, params = build_where_clause(filters)
    conn = get_db_connection()
    c = conn.cursor()

    query = f"""
        SELECT
            id, case_number, date, primary_type, description,
            location_description, arrest, domestic, district, block,
            latitude, longitude, is_violent
        FROM crimes
        WHERE {where_sql} AND latitude IS NOT NULL AND longitude IS NOT NULL
        ORDER BY date DESC
        LIMIT ?
    """
    params.append(limit)
    c.execute(query, params)
    rows = c.fetchall()

    points = []
    for r in rows:
        # Intensity weight: violent crimes get higher weight (1.0 vs 0.55), arrests slight reduction
        base_weight = 1.0 if r["is_violent"] else 0.55
        points.append({
            "id": r["id"],
            "case_number": r["case_number"],
            "date": r["date"],
            "type": r["primary_type"],
            "desc": r["description"],
            "location": r["location_description"],
            "arrest": bool(r["arrest"]),
            "domestic": bool(r["domestic"]),
            "district": r["district"],
            "block": r["block"],
            "lat": r["latitude"],
            "lng": r["longitude"],
            "is_violent": bool(r["is_violent"]),
            "weight": base_weight
        })

    conn.close()
    return points

def get_category_analytics(filters: Dict[str, Any] = {}) -> Dict[str, Any]:
    """Returns crime offense breakdowns, arrest rates by category, and location types."""
    where_sql, params = build_where_clause(filters)
    conn = get_db_connection()
    c = conn.cursor()

    # Primary crime categories
    c.execute(f"""
        SELECT
            primary_type,
            COUNT(*) as count,
            SUM(arrest) as arrests,
            SUM(is_violent) as violent
        FROM crimes
        WHERE {where_sql}
        GROUP BY primary_type
        ORDER BY count DESC
        LIMIT 12
    """, params)
    categories = [
        {
            "category": r["primary_type"],
            "count": r["count"],
            "arrests": r["arrests"] or 0,
            "arrest_rate": round((r["arrests"] or 0) / r["count"] * 100, 1) if r["count"] > 0 else 0.0,
            "is_violent": bool(r["violent"])
        }
        for r in c.fetchall()
    ]

    # Top location descriptions
    c.execute(f"""
        SELECT
            location_description,
            COUNT(*) as count
        FROM crimes
        WHERE {where_sql} AND location_description IS NOT NULL AND location_description != 'OTHER'
        GROUP BY location_description
        ORDER BY count DESC
        LIMIT 10
    """, params)
    locations = [
        {"location": r["location_description"], "count": r["count"]}
        for r in c.fetchall()
    ]

    conn.close()
    return {
        "categories": categories,
        "locations": locations
    }

def get_predictive_risk_model() -> Dict[str, Any]:
    """
    Computes statistical crime threat index and predictive risk scores
    for all 22 Chicago Police Districts based on volume, violence ratio, and clearance rate.
    """
    conn = get_db_connection()
    c = conn.cursor()

    # District level aggregation
    c.execute("""
        SELECT
            district,
            COUNT(*) as total_crimes,
            SUM(is_violent) as violent_crimes,
            SUM(arrest) as arrests,
            AVG(latitude) as avg_lat,
            AVG(longitude) as avg_lng
        FROM crimes
        WHERE district != 'Unknown'
        GROUP BY district
        ORDER BY total_crimes DESC
    """)
    dist_rows = c.fetchall()

    if not dist_rows:
        conn.close()
        return {"districts": [], "hourly_threat_curve": []}

    max_crimes = max(r["total_crimes"] for r in dist_rows)

    district_risk_list = []
    for r in dist_rows:
        dist_id = r["district"]
        total = r["total_crimes"]
        violent = r["violent_crimes"] or 0
        arrests = r["arrests"] or 0

        violent_ratio = (violent / total) if total > 0 else 0
        arrest_ratio = (arrests / total) if total > 0 else 0
        normalized_volume = total / max_crimes if max_crimes > 0 else 0

        # Composite Threat Score (0 to 100):
        # Higher volume and higher violence increase threat; higher arrest clearance rate lowers threat.
        threat_score = (normalized_volume * 50) + (violent_ratio * 40) - (arrest_ratio * 15)
        threat_score = max(5.0, min(98.0, threat_score))

        # Safety Index is inverse of threat score (0 to 100)
        safety_index = round(100.0 - threat_score, 1)
        threat_score = round(threat_score, 1)

        # Risk Classification
        if threat_score >= 65:
            risk_tier = "High Alert"
            badge_class = "danger"
        elif threat_score >= 45:
            risk_tier = "Elevated"
            badge_class = "warning"
        elif threat_score >= 25:
            risk_tier = "Moderate"
            badge_class = "info"
        else:
            risk_tier = "Low / Safe"
            badge_class = "success"

        district_risk_list.append({
            "district_id": dist_id,
            "district_name": DISTRICT_NAMES.get(dist_id, f"District {dist_id}"),
            "total_crimes": total,
            "violent_crimes": violent,
            "violent_ratio": round(violent_ratio * 100, 1),
            "arrest_rate": round(arrest_ratio * 100, 1),
            "threat_score": threat_score,
            "safety_index": safety_index,
            "risk_tier": risk_tier,
            "badge_class": badge_class,
            "lat": r["avg_lat"],
            "lng": r["avg_lng"]
        })

    # Sort districts by threat score descending
    district_risk_list.sort(key=lambda x: x["threat_score"], reverse=True)

    # Hourly predictive threat curve (24-hour cycle)
    c.execute("""
        SELECT hour, COUNT(*) as count, SUM(is_violent) as violent
        FROM crimes
        WHERE hour IS NOT NULL
        GROUP BY hour
        ORDER BY hour ASC
    """)
    hourly_rows = c.fetchall()
    total_crimes_all = sum(r["count"] for r in hourly_rows) or 1

    hourly_threat = []
    for r in hourly_rows:
        h = r["hour"]
        pct = (r["count"] / total_crimes_all) * 100
        violent_pct = (r["violent"] / r["count"] * 100) if r["count"] > 0 else 0
        risk_prob = round((pct * 0.6) + (violent_pct * 0.4), 1)

        hourly_threat.append({
            "hour": h,
            "label": f"{h:02d}:00",
            "incident_count": r["count"],
            "incident_share_pct": round(pct, 1),
            "violent_pct": round(violent_pct, 1),
            "predictive_risk_prob": risk_prob
        })

    conn.close()

    return {
        "districts": district_risk_list,
        "hourly_threat_curve": hourly_threat
    }

def get_crimes_list(
    filters: Dict[str, Any] = {},
    page: int = 1,
    page_size: int = 50,
    sort_by: str = "date",
    order: str = "DESC"
) -> Dict[str, Any]:
    """Returns paginated, searchable, filterable crime incidents."""
    where_sql, params = build_where_clause(filters)
    conn = get_db_connection()
    c = conn.cursor()

    # Total matching count
    c.execute(f"SELECT COUNT(*) as total FROM crimes WHERE {where_sql}", params)
    total = c.fetchone()["total"]

    valid_sorts = {
        "date": "date",
        "primary_type": "primary_type",
        "district": "district",
        "arrest": "arrest",
        "is_violent": "is_violent"
    }
    sort_col = valid_sorts.get(sort_by, "date")
    sort_order = "ASC" if str(order).upper() == "ASC" else "DESC"

    offset = (page - 1) * page_size
    query = f"""
        SELECT
            id, case_number, date, year, hour, day_name,
            block, primary_type, description, location_description,
            arrest, domestic, beat, district, latitude, longitude, is_violent
        FROM crimes
        WHERE {where_sql}
        ORDER BY {sort_col} {sort_order}
        LIMIT ? OFFSET ?
    """
    params.extend([page_size, offset])
    c.execute(query, params)
    records = [dict(r) for r in c.fetchall()]

    for r in records:
        r["district_name"] = DISTRICT_NAMES.get(r["district"], f"District {r['district']}")

    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 1

    conn.close()

    return {
        "records": records,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }

def get_filter_options() -> Dict[str, Any]:
    """Returns available dropdown options for filtering."""
    conn = get_db_connection()
    c = conn.cursor()

    c.execute("SELECT DISTINCT primary_type FROM crimes ORDER BY primary_type ASC")
    types = [r["primary_type"] for r in c.fetchall() if r["primary_type"]]

    c.execute("SELECT DISTINCT district FROM crimes WHERE district != 'Unknown' ORDER BY district ASC")
    districts = [
        {"id": r["district"], "name": f"Dist {r['district']} - {DISTRICT_NAMES.get(r['district'], '')}"}
        for r in c.fetchall()
    ]

    c.execute("SELECT MIN(substr(date, 1, 10)) as min_d, MAX(substr(date, 1, 10)) as max_d FROM crimes")
    row = c.fetchone()

    conn.close()

    return {
        "crime_types": types,
        "districts": districts,
        "min_date": row["min_d"] if row else None,
        "max_date": row["max_d"] if row else None
    }
