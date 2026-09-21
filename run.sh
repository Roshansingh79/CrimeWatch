#!/usr/bin/env bash
set -e

# Navigate to project directory
cd "$(dirname "$0")"

echo "================================================================="
echo "  CRIMETRACK // INTEL-X"
echo "  Crime Data Analytics & Visualization System"
echo "================================================================="

# Ensure virtual environment exists
if [ ! -d ".venv" ]; then
    echo "[*] Creating Python virtual environment..."
    python3 -m venv .venv
fi

echo "[*] Activating virtual environment..."
source .venv/bin/activate

echo "[*] Installing required dependencies..."
pip install -r requirements.txt --quiet

# Check if SQLite database exists and has records
if [ ! -f "data/crimes.db" ]; then
    echo "[*] Initializing database and fetching real Chicago crime incidents..."
    python3 scripts/fetch_data.py 15000
fi

echo ""
echo "[✓] System Ready!"
echo "[*] Launching Crime Analytics & GIS Command Center on http://127.0.0.1:8080"
echo "================================================================="

python3 main.py
