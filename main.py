import os
import io
import csv
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from fastapi import FastAPI, Query, HTTPException, BackgroundTasks, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from backend.database import init_db
from backend.analytics import (
    get_kpis,
    get_temporal_analytics,
    get_spatial_points,
    get_category_analytics,
    get_predictive_risk_model,
    get_crimes_list,
    get_filter_options,
    build_where_clause
)
from backend.database import get_db_connection
from backend.auth import (
    create_user,
    authenticate_user,
    get_user_by_session,
    logout_session,
    get_all_users_count
)
from scripts.fetch_data import fetch_and_ingest
from backend.india_data import (
    init_india_table,
    get_india_summary,
    get_india_states,
    get_india_districts,
    get_india_district_by_name,
    search_india_global,
    get_india_categories,
    get_india_cities,
    sync_live_india_data,
    export_india_csv_data,
    export_india_districts_csv_data,
    get_india_realtime_telemetry,
    init_india_incidents_table,
    get_india_incidents_list,
    export_india_incidents_csv,
    export_india_cities_csv
)
from backend.india_women_data import (
    init_women_data_table,
    get_women_crime_summary,
    get_women_temporal_trend,
    get_women_category_breakdown,
    get_women_districts,
    get_women_states_comparison,
    export_women_crimes_csv
)

from backend.global_cities_data import (
    GLOBAL_CITIES_DATA,
    get_all_countries,
    get_global_cities_list,
    get_city_profile,
    get_calibrated_city_summary,
    get_calibrated_city_spatial_points,
    get_calibrated_city_crimes_list,
    get_calibrated_city_categories,
    get_calibrated_city_temporal,
    get_calibrated_city_predictive_risk,
    export_global_cities_csv,
    register_new_country_city
)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    init_india_table()
    init_women_data_table()
    init_india_incidents_table()
    yield

app = FastAPI(
    title="Crime Data Analytics & Visualization System",
    description="Real-world crime intelligence platform powered by City of Chicago open data and Global Metropolitan Intelligence",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = Path(__file__).resolve().parent / "frontend"

@app.get("/api/health")
def health_check():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) as count FROM crimes")
    cnt = c.fetchone()["count"]
    conn.close()
    return {"status": "online", "database": "crimes.db", "total_incidents": cnt}

@app.get("/api/global/countries")
def api_global_countries():
    """Returns list of 50+ countries with city counts, flags, and regions."""
    return get_all_countries()

@app.get("/api/global/cities")
def api_global_cities(
    country: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    risk_tier: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("safety_index"),
    sort_order: str = Query("desc")
):
    """Returns filtered, searchable roster of 150+ world metropolitan cities."""
    return get_global_cities_list(
        country=country,
        region=region,
        risk_tier=risk_tier,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )

@app.get("/api/global/cities/{city_name}")
def api_global_city_profile(city_name: str):
    """Returns complete intelligence profile for a specific global city."""
    profile = get_city_profile(city_name)
    if not profile:
        raise HTTPException(status_code=404, detail=f"City '{city_name}' not found in global registry.")
    return profile

@app.get("/api/global/cities-export")
def api_global_cities_export():
    """Download entire world cities safety and crime database as CSV."""
    csv_content = export_global_cities_csv()
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=world_cities_crime_safety_index.csv"}
    )

class AICopilotRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    history: Optional[List[Dict[str, Any]]] = None

@app.post("/api/ai/copilot")
def api_ai_copilot(req: AICopilotRequest):
    """Processes interactive queries via CrimeWatch Tactical AI Copilot."""
    from backend.ai_copilot import process_ai_copilot_query
    return process_ai_copilot_query(
        message=req.message,
        context=req.context,
        history=req.history
    )

@app.get("/api/ai/suggestions")
def api_ai_suggestions(city: Optional[str] = Query(None), is_india: Optional[bool] = Query(False)):
    """Returns contextual prompt starter chips for the active city or platform."""
    from backend.ai_copilot import get_contextual_suggestions
    return {"suggestions": get_contextual_suggestions({"city": city or "Chicago", "is_india": is_india})}

class AddCountryCityRequest(BaseModel):
    country: str
    city_name: str
    country_code: Optional[str] = "XX"
    flag: Optional[str] = "🌐"
    region: Optional[str] = "Global"
    population_millions: Optional[float] = 1.0
    lat: Optional[float] = 0.0
    lng: Optional[float] = 0.0
    crime_index: Optional[float] = 45.0
    safety_index: Optional[float] = 55.0
    crime_rate_per_100k: Optional[int] = 2500
    violent_crime_rate_per_100k: Optional[int] = 450
    risk_tier: Optional[str] = "Moderate"
    emergency_number: Optional[str] = "112"
    police_agency: Optional[str] = "Municipal Police Force"
    districts: Optional[List[str]] = None

@app.post("/api/global/cities", status_code=201)
def api_add_global_country_city(req: AddCountryCityRequest):
    """Add a new custom country and metropolitan city to the global surveillance system."""
    country = req.country.strip()
    city_name = req.city_name.strip()
    if not country:
        raise HTTPException(status_code=400, detail="Country name is required.")
    if not city_name:
        raise HTTPException(status_code=400, detail="City name is required.")

    # Format districts list
    dist_objs = []
    if req.districts:
        for i, d in enumerate(req.districts):
            d_name = d.strip()
            if d_name:
                dist_objs.append({"id": f"{req.country_code}-{i+1:02d}", "name": d_name})
    if not dist_objs:
        dist_objs = [
            {"id": f"{req.country_code}-01", "name": "Central District"},
            {"id": f"{req.country_code}-02", "name": "North Sector"},
            {"id": f"{req.country_code}-03", "name": "South Sector"}
        ]

    # Derive safety if not set or calibrate
    crime_idx = max(0.0, min(100.0, float(req.crime_index or 45.0)))
    safety_idx = max(0.0, min(100.0, float(req.safety_index or (100.0 - crime_idx))))
    
    tier = req.risk_tier
    if not tier or tier not in ["Low Risk", "Moderate", "Elevated", "Critical"]:
        if crime_idx < 35:
            tier = "Low Risk"
        elif crime_idx < 55:
            tier = "Moderate"
        elif crime_idx < 70:
            tier = "Elevated"
        else:
            tier = "Critical"

    entry = {
        "city_name": city_name,
        "country": country,
        "country_code": (req.country_code or "XX").upper()[:3],
        "flag": req.flag or "🌐",
        "region": req.region or "Global",
        "population_millions": float(req.population_millions or 1.0),
        "lat": float(req.lat or 0.0),
        "lng": float(req.lng or 0.0),
        "crime_index": crime_idx,
        "safety_index": safety_idx,
        "crime_rate_per_100k": int(req.crime_rate_per_100k or int(crime_idx * 50)),
        "violent_crime_rate_per_100k": int(req.violent_crime_rate_per_100k or int(crime_idx * 12)),
        "risk_tier": tier,
        "emergency_number": req.emergency_number or "112",
        "police_agency": req.police_agency or "Municipal Police Department",
        "is_live_db": False,
        "districts": dist_objs
    }

    try:
        profile = register_new_country_city(entry)
        return {
            "success": True,
            "message": f"Successfully registered {city_name}, {country} into Global Surveillance System.",
            "profile": profile
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/filter-options")
def filter_options(city: Optional[str] = None):
    if city and city.lower() != "chicago":
        profile = get_city_profile(city)
        if profile:
            return {
                "crime_types": [
                    "THEFT", "BATTERY / ASSAULT", "CRIMINAL DAMAGE / MISCHIEF",
                    "BURGLARY", "MOTOR VEHICLE THEFT", "ROBBERY", "NARCOTICS", "WEAPONS OFFENSE"
                ],
                "districts": profile.get("districts", []),
                "min_date": "2024-01-01",
                "max_date": "2026-12-31",
                "total_records": 3200,
                "city": profile["city_name"],
                "country": profile["country"]
            }
    return get_filter_options()

@app.get("/api/summary")
def summary(
    primary_type: Optional[str] = None,
    district: Optional[str] = None,
    arrest: Optional[int] = None,
    domestic: Optional[int] = None,
    is_violent: Optional[int] = None,
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    hour_start: Optional[int] = None,
    hour_end: Optional[int] = None,
    search: Optional[str] = None,
    city: Optional[str] = None
):
    filters = {
        "primary_type": primary_type,
        "district": district,
        "arrest": arrest,
        "domestic": domestic,
        "is_violent": is_violent,
        "date_start": date_start,
        "date_end": date_end,
        "hour_start": hour_start,
        "hour_end": hour_end,
        "search": search
    }
    if city and city.lower() != "chicago":
        return get_calibrated_city_summary(city, filters)
    return get_kpis(filters)

@app.get("/api/temporal")
def temporal(
    primary_type: Optional[str] = None,
    district: Optional[str] = None,
    arrest: Optional[int] = None,
    domestic: Optional[int] = None,
    is_violent: Optional[int] = None,
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    hour_start: Optional[int] = None,
    hour_end: Optional[int] = None,
    city: Optional[str] = None
):
    if city and city.lower() != "chicago":
        return get_calibrated_city_temporal(city)
    filters = {
        "primary_type": primary_type,
        "district": district,
        "arrest": arrest,
        "domestic": domestic,
        "is_violent": is_violent,
        "date_start": date_start,
        "date_end": date_end,
        "hour_start": hour_start,
        "hour_end": hour_end
    }
    return get_temporal_analytics(filters)

@app.get("/api/spatial")
def spatial(
    primary_type: Optional[str] = None,
    district: Optional[str] = None,
    arrest: Optional[int] = None,
    domestic: Optional[int] = None,
    is_violent: Optional[int] = None,
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    limit: int = Query(2500, le=5000),
    city: Optional[str] = None
):
    if city and city.lower() != "chicago":
        return get_calibrated_city_spatial_points(city, limit=limit)
    filters = {
        "primary_type": primary_type,
        "district": district,
        "arrest": arrest,
        "domestic": domestic,
        "is_violent": is_violent,
        "date_start": date_start,
        "date_end": date_end
    }
    return get_spatial_points(filters, limit=limit)

@app.get("/api/categories")
def categories(
    district: Optional[str] = None,
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    arrest: Optional[int] = None,
    city: Optional[str] = None
):
    if city and city.lower() != "chicago":
        return get_calibrated_city_categories(city)
    filters = {
        "district": district,
        "date_start": date_start,
        "date_end": date_end,
        "arrest": arrest
    }
    return get_category_analytics(filters)

@app.get("/api/predictive/risk")
def predictive_risk(city: Optional[str] = None):
    if city and city.lower() != "chicago":
        return get_calibrated_city_predictive_risk(city)
    return get_predictive_risk_model()

@app.get("/api/crimes")
def list_crimes(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    sort_by: str = Query("date"),
    order: str = Query("DESC"),
    primary_type: Optional[str] = None,
    district: Optional[str] = None,
    arrest: Optional[int] = None,
    domestic: Optional[int] = None,
    is_violent: Optional[int] = None,
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    search: Optional[str] = None,
    city: Optional[str] = None
):
    if city and city.lower() != "chicago":
        return get_calibrated_city_crimes_list(
            city_name=city,
            page=page,
            page_size=page_size,
            primary_type=primary_type,
            district=district,
            is_violent=is_violent,
            arrest=arrest,
            domestic=domestic,
            search=search
        )
    filters = {
        "primary_type": primary_type,
        "district": district,
        "arrest": arrest,
        "domestic": domestic,
        "is_violent": is_violent,
        "date_start": date_start,
        "date_end": date_end,
        "search": search
    }
    return get_crimes_list(filters, page=page, page_size=page_size, sort_by=sort_by, order=order)

@app.get("/api/crimes/export")
def export_crimes_csv(
    primary_type: Optional[str] = None,
    district: Optional[str] = None,
    arrest: Optional[int] = None,
    domestic: Optional[int] = None,
    is_violent: Optional[int] = None,
    date_start: Optional[str] = None,
    date_end: Optional[str] = None,
    search: Optional[str] = None,
    city: Optional[str] = None
):
    """Exports filtered incidents to a downloadable CSV stream."""
    if city and city.lower() != "chicago":
        data = get_calibrated_city_crimes_list(
            city_name=city,
            page=1,
            page_size=1000,
            primary_type=primary_type,
            district=district,
            is_violent=is_violent,
            arrest=arrest,
            domestic=domestic,
            search=search
        )
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Case Number", "Date Time", "Primary Crime Type", "Description",
            "Location Type", "Arrested", "Domestic", "District",
            "Block Address", "Latitude", "Longitude", "Is Violent"
        ])
        for r in data["records"]:
            writer.writerow([
                r["case_number"], r["date"], r["primary_type"], r["description"],
                r["location_description"], "YES" if r["arrest"] else "NO",
                "YES" if r["domestic"] else "NO", r["district_name"],
                r["block"], r["latitude"], r["longitude"], "YES" if r["is_violent"] else "NO"
            ])
        output.seek(0)
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={city.lower()}_crime_incidents.csv"}
        )

    filters = {
        "primary_type": primary_type,
        "district": district,
        "arrest": arrest,
        "domestic": domestic,
        "is_violent": is_violent,
        "date_start": date_start,
        "date_end": date_end,
        "search": search
    }
    where_sql, params = build_where_clause(filters)
    conn = get_db_connection()
    c = conn.cursor()

    query = f"""
        SELECT
            case_number, date, primary_type, description, location_description,
            arrest, domestic, beat, district, block, latitude, longitude, is_violent
        FROM crimes
        WHERE {where_sql}
        ORDER BY date DESC
        LIMIT 5000
    """
    c.execute(query, params)
    rows = c.fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Case Number", "Date Time", "Primary Crime Type", "Description",
        "Location Type", "Arrested", "Domestic", "Beat", "District",
        "Block Address", "Latitude", "Longitude", "Is Violent"
    ])

    for r in rows:
        writer.writerow([
            r["case_number"], r["date"], r["primary_type"], r["description"],
            r["location_description"], "YES" if r["arrest"] else "NO",
            "YES" if r["domestic"] else "NO", r["beat"], r["district"],
            r["block"], r["latitude"], r["longitude"], "YES" if r["is_violent"] else "NO"
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=crime_analytics_export.csv"}
    )

@app.post("/api/sync")
def sync_live_data(background_tasks: BackgroundTasks, limit: int = Query(2500, le=10000)):
    """Triggers an asynchronous live ETL fetch from the Chicago Socrata Open Data Portal."""
    try:
        new_records = fetch_and_ingest(target_records=limit)
        return {
            "status": "success",
            "message": f"Successfully synced and updated {new_records} incidents from City of Chicago portal.",
            "records_synced": new_records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# =========================================================================
# INDIA NATIONAL CRIME RECORDS BUREAU (NCRB) ANALYTICS ENDPOINTS
# =========================================================================

@app.get("/api/india/summary")
def india_summary(
    date: Optional[str] = Query(None, description="Selected date (YYYY-MM-DD)"),
    year: Optional[int] = Query(None, description="Selected year (e.g. 2024)")
):
    """Returns top-level national crime metrics for India calibrated by date."""
    return get_india_summary(date=date, year=year)

@app.get("/api/india/states")
def india_states(
    search: Optional[str] = Query(None, description="Search term for state/UT or capital"),
    zone: Optional[str] = Query(None, description="Filter by geographic zone"),
    date: Optional[str] = Query(None, description="Selected date (YYYY-MM-DD)"),
    year: Optional[int] = Query(None, description="Selected year")
):
    """Returns state and UT level crime statistics with spatial coordinates calibrated by date."""
    return get_india_states(search=search, zone=zone, date=date, year=year)

@app.get("/api/india/categories")
def india_categories(
    date: Optional[str] = Query(None, description="Selected date (YYYY-MM-DD)"),
    year: Optional[int] = Query(None, description="Selected year")
):
    """Returns broad crime category distribution across India calibrated by date."""
    return get_india_categories(date=date, year=year)

@app.get("/api/india/realtime")
def india_realtime(
    date: Optional[str] = Query(None, description="Selected date (YYYY-MM-DD)"),
    state: Optional[str] = Query(None, description="Filter by state or UT"),
    district: Optional[str] = Query(None, description="Filter by district"),
    search: Optional[str] = Query(None, description="Filter by search query or location name")
):
    """Returns authentic live telemetry feeds, active dispatches, and recent incident logs across India."""
    return get_india_realtime_telemetry(date_str=date, state=state, district=district, search=search)

@app.get("/api/india/cities")
def india_cities(
    zone: Optional[str] = Query(None),
    risk_tier: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("safety_index"),
    sort_order: str = Query("desc")
):
    """Returns major metropolitan mega-city crime & safety intelligence statistics."""
    return get_india_cities(
        zone=zone,
        risk_tier=risk_tier,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order
    )

@app.get("/api/india/cities/export")
def india_cities_export():
    """Download entire India Metropolitan Cities crime and safety roster as CSV."""
    csv_content = export_india_cities_csv()
    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=india_cities_crime_safety_roster.csv"}
    )


@app.post("/api/india/sync")
def india_sync(
    date: Optional[str] = Query(None, description="Optional date context for sync"),
    limit: int = Query(5000, le=10000, description="Number of incidents to ingest from CCTNS stream")
):
    """Triggers live synchronization of authentic India NCRB crime datasets and CCTNS incident streams."""
    return sync_live_india_data(date_str=date, limit=limit)

@app.get("/api/india/incidents")
def india_incidents(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    is_violent: Optional[int] = Query(None),
    arrest: Optional[int] = Query(None),
    chargesheet: Optional[int] = Query(None),
    domestic: Optional[int] = Query(None),
    search: Optional[str] = Query(None)
):
    """Returns paginated, searchable individual incident FIR dispatches from SQLite database."""
    return get_india_incidents_list(
        page=page,
        page_size=page_size,
        state=state,
        district=district,
        category=category,
        is_violent=is_violent,
        arrest=arrest,
        chargesheet=chargesheet,
        domestic=domestic,
        search=search
    )

@app.get("/api/india/incidents/export")
def india_incidents_export(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    is_violent: Optional[int] = Query(None),
    arrest: Optional[int] = Query(None),
    domestic: Optional[int] = Query(None),
    search: Optional[str] = Query(None)
):
    """Exports filtered live India incident FIRs as a CSV file."""
    csv_str = export_india_incidents_csv(
        state=state,
        district=district,
        category=category,
        is_violent=is_violent,
        arrest=arrest,
        domestic=domestic,
        search=search
    )
    return StreamingResponse(
        iter([csv_str]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=india_live_incidents_export.csv"}
    )

@app.get("/api/india/export")
def india_export():
    """Exports full India NCRB dataset as a CSV file."""
    csv_str = export_india_csv_data()
    return StreamingResponse(
        iter([csv_str]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=india_ncrb_crime_data.csv"}
    )

@app.get("/api/india/districts")
def india_districts(
    search: Optional[str] = Query(None, description="Search term for district, headquarters, or state"),
    state: Optional[str] = Query(None, description="Filter by state or UT name"),
    risk_tier: Optional[str] = Query(None, description="Filter by risk tier"),
    zone: Optional[str] = Query(None, description="Filter by geographic zone"),
    is_commissionerate: Optional[int] = Query(None, description="Filter commissionerates (1 or 0)"),
    sort_by: str = Query("ipc_crimes", description="Field to sort by"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    limit: int = Query(1000, ge=1, le=2000),
    offset: int = Query(0, ge=0),
    date: Optional[str] = Query(None, description="Selected date (YYYY-MM-DD)"),
    year: Optional[int] = Query(None, description="Selected year")
):
    """Returns official Indian administrative and police districts with crime statistics and coordinates."""
    return get_india_districts(
        search=search,
        state=state,
        risk_tier=risk_tier,
        zone=zone,
        is_commissionerate=is_commissionerate,
        sort_by=sort_by,
        sort_order=sort_order,
        limit=limit,
        offset=offset,
        date=date,
        year=year
    )

@app.get("/api/india/districts/export")
def india_districts_export():
    """Exports all Indian districts crime statistics as a CSV file."""
    csv_str = export_india_districts_csv_data()
    return StreamingResponse(
        iter([csv_str]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=india_districts_crime_data.csv"}
    )

@app.get("/api/india/districts/{district_name}")
def india_district_detail(district_name: str):
    """Returns detailed dossier for a specific Indian district."""
    dist = get_india_district_by_name(district_name)
    if not dist:
        raise HTTPException(status_code=404, detail=f"District '{district_name}' not found")
    return dist

@app.get("/api/india/search")
def india_global_search(q: str = Query("", description="Instant search across states and districts")):
    """Instant unified search across all Indian States and Districts."""
    return search_india_global(q)

# =========================================================================
# INDIA CRIMES AGAINST WOMEN (2001 - 2014) LONGITUDINAL ENDPOINTS
# =========================================================================

@app.get("/api/india/women/summary")
def india_women_summary(
    state: Optional[str] = Query(None, description="Filter by state or UT"),
    district: Optional[str] = Query(None, description="Filter by district"),
    year: Optional[int] = Query(None, description="Filter by specific year (2001-2014)")
):
    """Returns top-level KPIs and metrics for crimes against women."""
    return get_women_crime_summary(state=state, district=district, year=year)

@app.get("/api/india/women/temporal")
def india_women_temporal(
    state: Optional[str] = Query(None, description="Filter by state or UT"),
    district: Optional[str] = Query(None, description="Filter by district")
):
    """Returns 14-year temporal trend progression (2001-2014) by crime category."""
    return get_women_temporal_trend(state=state, district=district)

@app.get("/api/india/women/categories")
def india_women_categories(
    state: Optional[str] = Query(None, description="Filter by state or UT"),
    district: Optional[str] = Query(None, description="Filter by district"),
    year: Optional[int] = Query(None, description="Filter by specific year")
):
    """Returns crime head proportions and percentages for donut/pie charts."""
    return get_women_category_breakdown(state=state, district=district, year=year)

@app.get("/api/india/women/states")
def india_women_states(
    year: Optional[int] = Query(None, description="Filter by year"),
    sort_by: str = Query("total_crimes", description="Column to rank states by")
):
    """Returns state and UT comparative ranking for crimes against women."""
    return get_women_states_comparison(year=year, sort_by=sort_by)

@app.get("/api/india/women/districts")
def india_women_districts(
    state: Optional[str] = Query(None, description="Filter by state or UT"),
    district: Optional[str] = Query(None, description="Filter by district"),
    year: Optional[int] = Query(None, description="Filter by specific year"),
    category: Optional[str] = Query(None, description="Filter by crime category"),
    search: Optional[str] = Query(None, description="Search term for district or state"),
    sort_by: str = Query("total_crimes", description="Sort column"),
    sort_order: str = Query("desc", description="Sort order (asc/desc)"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    """Returns paginated, filterable district records for crimes against women."""
    return get_women_districts(
        state=state,
        district=district,
        year=year,
        category=category,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        limit=limit,
        offset=offset
    )

@app.get("/api/india/women/export")
def india_women_export(
    state: Optional[str] = Query(None, description="Filter by state or UT"),
    year: Optional[int] = Query(None, description="Filter by year")
):
    """Exports filtered crimes against women dataset as a downloadable CSV."""
    csv_str = export_women_crimes_csv(state=state, year=year)
    filename = f"india_crimes_against_women_{state or 'national'}_{year or '2001_2014'}.csv".replace(" ", "_").lower()
    return StreamingResponse(
        iter([csv_str]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# =========================================================================
# USER AUTHENTICATION & SESSION MANAGEMENT ENDPOINTS
# =========================================================================

class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "analyst"
    organization: Optional[str] = None
    badge_number: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/signup")
def auth_signup(req: SignUpRequest):
    """Registers a new user account and creates an authenticated session in SQLite."""
    user, token, err = create_user(
        name=req.name,
        email=req.email,
        password=req.password,
        role=req.role or "analyst",
        organization=req.organization,
        badge_number=req.badge_number
    )
    if err or not user:
        raise HTTPException(status_code=400, detail=err or "Registration failed.")
    return {
        "status": "success",
        "message": f"Welcome to CrimeWatch, {user['name']}!",
        "user": user,
        "token": token
    }

@app.post("/api/auth/login")
def auth_login(req: LoginRequest):
    """Authenticates user credentials and generates a fresh 30-day session token."""
    user, token, err = authenticate_user(email=req.email, password=req.password)
    if err or not user:
        raise HTTPException(status_code=401, detail=err or "Authentication failed.")
    return {
        "status": "success",
        "message": f"Welcome back, {user['name']}!",
        "user": user,
        "token": token
    }

@app.get("/api/auth/me")
def auth_me(
    authorization: Optional[str] = Header(None),
    token: Optional[str] = Query(None)
):
    """Resolves active session token to user profile. Returns authenticated=True/False."""
    session_token = None
    if authorization and authorization.startswith("Bearer "):
        session_token = authorization.split(" ", 1)[1].strip()
    elif token:
        session_token = token.strip()

    if not session_token:
        return {"authenticated": False, "user": None}

    user = get_user_by_session(session_token)
    if not user:
        return {"authenticated": False, "user": None}

    return {
        "authenticated": True,
        "user": user
    }

@app.post("/api/auth/logout")
def auth_logout(
    authorization: Optional[str] = Header(None),
    token: Optional[str] = Query(None)
):
    """Invalidates and deletes active user session token."""
    session_token = None
    if authorization and authorization.startswith("Bearer "):
        session_token = authorization.split(" ", 1)[1].strip()
    elif token:
        session_token = token.strip()

    if session_token:
        logout_session(session_token)
    return {
        "status": "success",
        "message": "Logged out successfully"
    }

@app.get("/api/auth/stats")
def auth_stats():
    """Returns general user registration statistics."""
    return {
        "total_registered_users": get_all_users_count()
    }

# Mount static files for frontend assets
app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")

@app.get("/")
def serve_index():
    return FileResponse(
        FRONTEND_DIR / "index.html",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

@app.get("/india")
def serve_india():
    return FileResponse(
        FRONTEND_DIR / "india.html",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    print(f"[*] Starting Crime Data Analytics & Visualization System on http://127.0.0.1:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
