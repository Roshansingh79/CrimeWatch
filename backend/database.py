import sqlite3
import os
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "crimes.db"

def get_db_connection():
    """Returns a SQLite connection with row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema with performance indexes."""
    os.makedirs(DB_PATH.parent, exist_ok=True)
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS crimes (
        id TEXT PRIMARY KEY,
        case_number TEXT,
        date TEXT,
        year INTEGER,
        month INTEGER,
        day INTEGER,
        day_of_week INTEGER,
        day_name TEXT,
        hour INTEGER,
        block TEXT,
        iucr TEXT,
        primary_type TEXT,
        description TEXT,
        location_description TEXT,
        arrest INTEGER DEFAULT 0,
        domestic INTEGER DEFAULT 0,
        beat TEXT,
        district TEXT,
        ward TEXT,
        community_area TEXT,
        fbi_code TEXT,
        latitude REAL,
        longitude REAL,
        is_violent INTEGER DEFAULT 0,
        synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # India National & District Telemetry Incidents Table (matching Chicago crimes schema)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS india_incidents (
        id TEXT PRIMARY KEY,
        fir_number TEXT,
        date TEXT,
        year INTEGER,
        month INTEGER,
        day INTEGER,
        hour INTEGER,
        state_ut TEXT,
        district TEXT,
        police_station TEXT,
        ipc_section TEXT,
        offense_category TEXT,
        description TEXT,
        location_detail TEXT,
        is_violent INTEGER DEFAULT 0,
        arrest INTEGER DEFAULT 0,
        chargesheet_filed INTEGER DEFAULT 0,
        domestic INTEGER DEFAULT 0,
        latitude REAL,
        longitude REAL,
        erss_call_id TEXT,
        responding_unit TEXT,
        investigating_officer TEXT,
        synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Performance indexes for analytics and spatial/temporal queries
    indexes = [
        "CREATE INDEX IF NOT EXISTS idx_crimes_date ON crimes(date);",
        "CREATE INDEX IF NOT EXISTS idx_crimes_primary_type ON crimes(primary_type);",
        "CREATE INDEX IF NOT EXISTS idx_crimes_district ON crimes(district);",
        "CREATE INDEX IF NOT EXISTS idx_crimes_arrest ON crimes(arrest);",
        "CREATE INDEX IF NOT EXISTS idx_crimes_domestic ON crimes(domestic);",
        "CREATE INDEX IF NOT EXISTS idx_crimes_coords ON crimes(latitude, longitude);",
        "CREATE INDEX IF NOT EXISTS idx_crimes_hour ON crimes(hour);",
        "CREATE INDEX IF NOT EXISTS idx_crimes_day_of_week ON crimes(day_of_week);",
        "CREATE INDEX IF NOT EXISTS idx_crimes_is_violent ON crimes(is_violent);",
        "CREATE INDEX IF NOT EXISTS idx_crimes_location ON crimes(location_description);",
        # India incidents indexes
        "CREATE INDEX IF NOT EXISTS idx_india_incidents_date ON india_incidents(date);",
        "CREATE INDEX IF NOT EXISTS idx_india_incidents_state ON india_incidents(state_ut);",
        "CREATE INDEX IF NOT EXISTS idx_india_incidents_district ON india_incidents(district);",
        "CREATE INDEX IF NOT EXISTS idx_india_incidents_category ON india_incidents(offense_category);",
        "CREATE INDEX IF NOT EXISTS idx_india_incidents_violent ON india_incidents(is_violent);",
        "CREATE INDEX IF NOT EXISTS idx_india_incidents_arrest ON india_incidents(arrest);",
        "CREATE INDEX IF NOT EXISTS idx_india_incidents_cs ON india_incidents(chargesheet_filed);",
        "CREATE INDEX IF NOT EXISTS idx_india_incidents_domestic ON india_incidents(domestic);",
        "CREATE INDEX IF NOT EXISTS idx_india_incidents_coords ON india_incidents(latitude, longitude);"
    ]

    for idx_sql in indexes:
        cursor.execute(idx_sql)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized at {DB_PATH}")
