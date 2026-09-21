/**
 * CrimeTrack Intelligence // Frontend Dashboard & GIS Analytics Controller
 */

// Application State
const state = {
    filters: {
        country: "United States",
        city: "Chicago",
        primary_type: "",
        district: "",
        is_violent: null,
        arrest: null,
        domestic: null,
        search: "",
        date_start: null,
        date_end: null
    },
    pagination: {
        page: 1,
        page_size: 25,
        total_pages: 1,
        total: 0
    },
    activeView: "view-dashboard",
    map: null,
    heatLayer: null,
    markersLayer: null,
    spatialPoints: [],
    mapMode: "heatmap", // "heatmap" or "markers"
    charts: {},
    summaryData: null,
    predictiveData: null,
    globalCountries: [],
    globalCities: [],
    currentCityProfile: null
};

// District Coordinates Center Points for Chicago
const DISTRICT_CENTERS = {
    "001": [41.8674, -87.6244],
    "002": [41.8021, -87.6200],
    "003": [41.7640, -87.6050],
    "004": [41.7310, -87.5620],
    "005": [41.6910, -87.6210],
    "006": [41.7480, -87.6530],
    "007": [41.7760, -87.6570],
    "008": [41.7780, -87.7120],
    "009": [41.8150, -87.6680],
    "010": [41.8490, -87.7100],
    "011": [41.8830, -87.7260],
    "012": [41.8750, -87.6740],
    "014": [41.9210, -87.6970],
    "015": [41.8900, -87.7650],
    "016": [41.9750, -87.7780],
    "017": [41.9680, -87.7180],
    "018": [41.9030, -87.6380],
    "019": [41.9480, -87.6540],
    "020": [41.9790, -87.6690],
    "022": [41.7050, -87.6740],
    "024": [42.0080, -87.6720],
    "025": [41.9220, -87.7660]
};

// Initialization on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

async function initApp() {
    setupNavigation();
    setupFilters();
    setupModals();
    setupMapControls();
    setupSafetyFooter();
    setupGlobalCitiesListeners();
    
    // Initial fetch of options and data
    await loadFilterOptions();
    await refreshAllData();

    // Expose control handles to window for AI Copilot
    window.switchCity = switchCity;
    window.refreshAllData = refreshAllData;
}

/**
 * Setup Tab Navigation
 */
function setupNavigation() {
    const tabs = document.querySelectorAll(".nav-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const targetViewId = tab.getAttribute("data-view");
            document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
            
            const targetPanel = document.getElementById(targetViewId);
            if (targetPanel) {
                targetPanel.classList.add("active");
                state.activeView = targetViewId;

                // If switching to Map view, ensure Leaflet renders canvas correctly
                if (targetViewId === "view-map") {
                    if (!state.map) {
                        initLeafletMap();
                    } else {
                        setTimeout(() => state.map.invalidateSize(), 150);
                    }
                } else if (targetViewId === "view-global-cities") {
                    loadGlobalCitiesRoster();
                }
            }
        });
    });

    // Executive briefing button in topbar
    const btnBriefing = document.getElementById("btn-open-briefing");
    if (btnBriefing) {
        btnBriefing.addEventListener("click", () => {
            const tabReport = document.getElementById("tab-report");
            if (tabReport) tabReport.click();
        });
    }

    // CSV Export button
    const btnExport = document.getElementById("btn-export-csv");
    if (btnExport) {
        btnExport.addEventListener("click", handleExportCSV);
    }
}

/**
 * Setup Global Filter Controls
 */
function setupFilters() {
    // Country select
    const countrySelect = document.getElementById("filter-country");
    if (countrySelect) {
        countrySelect.addEventListener("change", async (e) => {
            const selectedCountry = e.target.value;
            state.filters.country = selectedCountry;
            repopulateCityDropdown(selectedCountry);
            const citySelect = document.getElementById("filter-city");
            if (citySelect && citySelect.options.length > 0) {
                await switchCity(citySelect.value);
            }
        });
    }

    // City select
    const citySelect = document.getElementById("filter-city");
    if (citySelect) {
        citySelect.addEventListener("change", async (e) => {
            await switchCity(e.target.value);
        });
    }

    // Offense Category select
    const crimeTypeSelect = document.getElementById("filter-crime-type");
    crimeTypeSelect.addEventListener("change", (e) => {
        state.filters.primary_type = e.target.value;
        state.pagination.page = 1;
        refreshAllData();
    });

    // District select
    const districtSelect = document.getElementById("filter-district");
    districtSelect.addEventListener("change", (e) => {
        state.filters.district = e.target.value;
        state.pagination.page = 1;
        refreshAllData();
    });

    // Violent/Property Toggle
    setupToggleGroup("toggle-violence", (val) => {
        state.filters.is_violent = val === "" ? null : parseInt(val);
        state.pagination.page = 1;
        refreshAllData();
    });

    // Arrest Toggle
    setupToggleGroup("toggle-arrest", (val) => {
        state.filters.arrest = val === "" ? null : parseInt(val);
        state.pagination.page = 1;
        refreshAllData();
    });

    // Domestic Toggle
    setupToggleGroup("toggle-domestic", (val) => {
        state.filters.domestic = val === "" ? null : parseInt(val);
        state.pagination.page = 1;
        refreshAllData();
    });

    // Search Input with Debounce
    const searchInput = document.getElementById("filter-search-input");
    let debounceTimer;
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                state.filters.search = e.target.value;
                state.pagination.page = 1;
                refreshAllData();
            }, 350);
        });
    }

    // Reset Filters Button
    const btnReset = document.getElementById("btn-reset-filters");
    btnReset.addEventListener("click", () => {
        state.filters.primary_type = "";
        state.filters.district = "";
        state.filters.is_violent = null;
        state.filters.arrest = null;
        state.filters.domestic = null;
        state.filters.search = "";
        state.filters.date_start = null;
        state.filters.date_end = null;

        crimeTypeSelect.value = "";
        districtSelect.value = "";
        if (searchInput) searchInput.value = "";
        resetToggleButtons("toggle-violence");
        resetToggleButtons("toggle-arrest");
        resetToggleButtons("toggle-domestic");
        state.pagination.page = 1;
        refreshAllData();
    });

    // Pagination buttons in Incident Explorer
    document.getElementById("btn-page-prev").addEventListener("click", () => {
        if (state.pagination.page > 1) {
            state.pagination.page--;
            loadIncidentExplorer();
        }
    });
    document.getElementById("btn-page-next").addEventListener("click", () => {
        if (state.pagination.page < state.pagination.total_pages) {
            state.pagination.page++;
            loadIncidentExplorer();
        }
    });
}

function setupToggleGroup(groupId, callback) {
    const container = document.getElementById(groupId);
    if (!container) return;
    const buttons = container.querySelectorAll(".btn-toggle");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            callback(btn.getAttribute("data-val"));
        });
    });
}

function resetToggleButtons(groupId) {
    const container = document.getElementById(groupId);
    if (!container) return;
    const buttons = container.querySelectorAll(".btn-toggle");
    buttons.forEach((b, idx) => {
        if (idx === 0) b.classList.add("active");
        else b.classList.remove("active");
    });
}

/**
 * Setup Modals & Sync Ingestion Flow
 */
function setupModals() {
    // Incident Details Modal
    const modalIncident = document.getElementById("modal-incident");
    const btnCloseIncident = document.getElementById("btn-close-modal");
    const btnDismissIncident = document.getElementById("btn-modal-dismiss");

    const closeIncidentModal = () => {
        modalIncident.classList.remove("active");
        modalIncident.setAttribute("aria-hidden", "true");
    };

    if (btnCloseIncident) btnCloseIncident.addEventListener("click", closeIncidentModal);
    if (btnDismissIncident) btnDismissIncident.addEventListener("click", closeIncidentModal);

    // Sync Live Data Modal
    const modalSync = document.getElementById("modal-sync");
    const btnOpenSync = document.getElementById("btn-sync-data");
    const btnCloseSync = document.getElementById("btn-close-sync-modal");
    const btnCancelSync = document.getElementById("btn-cancel-sync");
    const btnConfirmSync = document.getElementById("btn-confirm-sync");

    const openSyncModal = () => {
        modalSync.classList.add("active");
        modalSync.setAttribute("aria-hidden", "false");
    };
    const closeSyncModal = () => {
        modalSync.classList.remove("active");
        modalSync.setAttribute("aria-hidden", "true");
        document.getElementById("sync-progress-box").classList.add("hidden");
        btnConfirmSync.disabled = false;
    };

    if (btnOpenSync) btnOpenSync.addEventListener("click", openSyncModal);
    if (btnCloseSync) btnCloseSync.addEventListener("click", closeSyncModal);
    if (btnCancelSync) btnCancelSync.addEventListener("click", closeSyncModal);

    if (btnConfirmSync) {
        btnConfirmSync.addEventListener("click", async () => {
            const limitSelect = document.getElementById("sync-record-count");
            const count = limitSelect ? parseInt(limitSelect.value) : 5000;
            const progressBox = document.getElementById("sync-progress-box");
            const statusMsg = document.getElementById("sync-status-msg");

            progressBox.classList.remove("hidden");
            statusMsg.textContent = `Connecting to Chicago Open Data API and ingesting ${count.toLocaleString()} real incidents...`;
            btnConfirmSync.disabled = true;

            try {
                const res = await fetch(`/api/sync?limit=${count}`, { method: "POST" });
                const json = await res.json();
                if (res.ok) {
                    statusMsg.textContent = json.message || "Ingestion complete!";
                    setTimeout(async () => {
                        closeSyncModal();
                        await loadFilterOptions();
                        await refreshAllData();
                    }, 1200);
                } else {
                    statusMsg.textContent = "Error during ingestion: " + (json.detail || "Server error");
                    btnConfirmSync.disabled = false;
                }
            } catch (err) {
                statusMsg.textContent = "Network error: " + err.message;
                btnConfirmSync.disabled = false;
            }
        });
    }
}

/**
 * Setup Map Controls & Quick District Jump
 */
function setupMapControls() {
    const btnHeatmap = document.getElementById("btn-layer-heatmap");
    const btnMarkers = document.getElementById("btn-layer-markers");

    if (btnHeatmap && btnMarkers) {
        btnHeatmap.addEventListener("click", () => {
            btnHeatmap.classList.add("active");
            btnMarkers.classList.remove("active");
            state.mapMode = "heatmap";
            renderMapLayers();
        });

        btnMarkers.addEventListener("click", () => {
            btnMarkers.classList.add("active");
            btnHeatmap.classList.remove("active");
            state.mapMode = "markers";
            renderMapLayers();
        });
    }

    const radiusSlider = document.getElementById("heatmap-radius-slider");
    const radiusVal = document.getElementById("radius-val");
    if (radiusSlider) {
        radiusSlider.addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            radiusVal.textContent = val;
            if (state.heatLayer && state.mapMode === "heatmap") {
                state.heatLayer.setOptions({ radius: val });
            }
        });
    }

    const blurSlider = document.getElementById("heatmap-blur-slider");
    const blurVal = document.getElementById("blur-val");
    if (blurSlider) {
        blurSlider.addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            blurVal.textContent = val;
            if (state.heatLayer && state.mapMode === "heatmap") {
                state.heatLayer.setOptions({ blur: val });
            }
        });
    }
}

/**
 * Load Initial Filter Dropdown Options
 */
async function loadFilterOptions() {
    try {
        // 1. Fetch Global Countries & Cities list
        const [countriesRes, citiesRes] = await Promise.allSettled([
            fetch("/api/global/countries"),
            fetch("/api/global/cities?sort_by=population_millions&sort_order=desc")
        ]);

        if (countriesRes.status === "fulfilled" && countriesRes.value.ok) {
            state.globalCountries = await countriesRes.value.json();

            // Populate Country Selector
            const countrySelect = document.getElementById("filter-country");
            if (countrySelect && state.globalCountries.length > 0) {
                const curVal = countrySelect.value || state.filters.country || "United States";
                countrySelect.innerHTML = "";
                state.globalCountries.forEach(c => {
                    const opt = document.createElement("option");
                    opt.value = c.country;
                    opt.textContent = `${c.flag} ${c.country} (${c.city_count} ${c.city_count === 1 ? 'city' : 'cities'})`;
                    if (c.country.toLowerCase() === curVal.toLowerCase()) {
                        opt.selected = true;
                    }
                    countrySelect.appendChild(opt);
                });
                countrySelect.value = curVal;
            }
        }

        if (citiesRes.status === "fulfilled" && citiesRes.value.ok) {
            state.globalCities = await citiesRes.value.json();

            // Populate City Selector for initial country
            repopulateCityDropdown(state.filters.country, state.filters.city);

            // Set current city profile
            state.currentCityProfile = state.globalCities.find(
                c => c.city_name.toLowerCase() === state.filters.city.toLowerCase()
            ) || state.globalCities[0];
        } else {
            repopulateCityDropdown(state.filters.country, state.filters.city);
        }

        // 2. Fetch options for active city
        const res = await fetch(`/api/filter-options?city=${encodeURIComponent(state.filters.city)}`);
        if (!res.ok) return;
        const data = await res.json();

        // Populate Crime Types
        const crimeTypeSelect = document.getElementById("filter-crime-type");
        const currentVal = crimeTypeSelect.value;
        crimeTypeSelect.innerHTML = '<option value="">All Crime Categories</option>';
        (data.crime_types || []).forEach(type => {
            const opt = document.createElement("option");
            opt.value = type;
            opt.textContent = type;
            crimeTypeSelect.appendChild(opt);
        });
        crimeTypeSelect.value = currentVal;

        // Populate Districts
        const districtSelect = document.getElementById("filter-district");
        districtSelect.innerHTML = `<option value="">All ${(data.districts || []).length} Districts</option>`;
        (data.districts || []).forEach(d => {
            const opt = document.createElement("option");
            opt.value = d.id;
            opt.textContent = d.name;
            districtSelect.appendChild(opt);
        });
        districtSelect.value = "";

        // Populate District Quick Jump Chips on Map Sidebar
        const chipContainer = document.getElementById("district-tags-container");
        if (chipContainer) {
            chipContainer.innerHTML = "";
            (data.districts || []).forEach(d => {
                const chip = document.createElement("button");
                chip.type = "button";
                chip.className = "district-chip";
                chip.textContent = d.id ? `D-${d.id}` : (d.name.length > 14 ? d.name.slice(0, 12) + "..." : d.name);
                chip.title = d.name;
                chip.addEventListener("click", () => {
                    const coords = DISTRICT_CENTERS[d.id];
                    if (coords && state.map) {
                        state.map.setView(coords, 14, { animate: true });
                    }
                    districtSelect.value = d.id;
                    state.filters.district = d.id;
                    refreshAllData();
                });
                chipContainer.appendChild(chip);
            });
        }

    } catch (e) {
        console.error("Failed to load filter options:", e);
    }
}

/**
 * Builds Query String from State Filters
 */
function buildQueryString(extraParams = {}) {
    const params = new URLSearchParams();
    if (state.filters.country) params.set("country", state.filters.country);
    if (state.filters.city) params.set("city", state.filters.city);
    if (state.filters.primary_type) params.set("primary_type", state.filters.primary_type);
    if (state.filters.district) params.set("district", state.filters.district);
    if (state.filters.is_violent !== null) params.set("is_violent", state.filters.is_violent);
    if (state.filters.arrest !== null) params.set("arrest", state.filters.arrest);
    if (state.filters.domestic !== null) params.set("domestic", state.filters.domestic);
    if (state.filters.search) params.set("search", state.filters.search);
    if (state.filters.date_start) params.set("date_start", state.filters.date_start);
    if (state.filters.date_end) params.set("date_end", state.filters.date_end);

    for (const [k, v] of Object.entries(extraParams)) {
        if (v !== undefined && v !== null) params.set(k, v);
    }
    return params.toString();
}

/**
 * Refreshes All Analytical Modules
 */
async function refreshAllData() {
    await Promise.all([
        loadSummaryKPIs(),
        loadTemporalAnalytics(),
        loadCategoryAnalytics(),
        loadPredictiveModel(),
        loadSpatialData(),
        loadIncidentExplorer()
    ]);
    populateExecutiveBriefing();
}

/**
 * 1. Load Summary KPI Cards
 */
async function loadSummaryKPIs() {
    try {
        const q = buildQueryString();
        const res = await fetch(`/api/summary?${q}`);
        if (!res.ok) return;
        const data = await res.json();
        state.summaryData = data;

        // Update Topbar and KPI Elements
        document.getElementById("header-total-count").textContent = data.total_incidents.toLocaleString();
        document.getElementById("val-total-incidents").textContent = data.total_incidents.toLocaleString();
        document.getElementById("val-violent-incidents").textContent = data.violent_incidents.toLocaleString();
        document.getElementById("val-violent-rate").textContent = `${data.violent_rate}%`;
        document.getElementById("val-arrest-rate").textContent = `${data.arrest_rate}%`;
        document.getElementById("val-arrest-count").textContent = `${data.arrest_count.toLocaleString()} arrests`;
        document.getElementById("val-domestic-rate").textContent = `${data.domestic_rate}%`;
        document.getElementById("val-domestic-count").textContent = `${data.domestic_count.toLocaleString()} cases`;
        
        const topDist = data.top_district;
        document.getElementById("val-top-district").textContent = topDist ? `Dist ${topDist.id}` : "N/A";
        document.getElementById("val-top-district-detail").textContent = topDist ? `${topDist.name} (${topDist.count} incidents)` : "";

        if (data.date_range && data.date_range.start && data.date_range.end) {
            const s = data.date_range.start.split(" ")[0];
            const e = data.date_range.end.split(" ")[0];
            document.getElementById("val-date-span").textContent = `Active Range: ${s} to ${e}`;
        }
    } catch (e) {
        console.error("Failed to load KPIs:", e);
    }
}

/**
 * 2. Load Temporal & Trend Analytics
 */
async function loadTemporalAnalytics() {
    try {
        const q = buildQueryString();
        const res = await fetch(`/api/temporal?${q}`);
        if (!res.ok) return;
        const data = await res.json();

        // Update Peak Hour Badge
        if (data.peak_hour) {
            document.getElementById("peak-hour-badge").textContent = `PEAK: ${data.peak_hour.label} (${data.peak_hour.count} INCIDENTS)`;
        }

        // Render 24-Hour Diurnal Chart
        renderDiurnalChart(data.hourly);

        // Render Day-of-Week Surge Chart
        renderDowChart(data.day_of_week);

        // Render Daily Timeline Chart
        renderTimelineChart(data.timeline);

        // Render Hourly Severity Split Chart
        renderHourlySplitChart(data.hourly);

    } catch (e) {
        console.error("Failed to load temporal analytics:", e);
    }
}

/**
 * 3. Load Category & Location Analytics
 */
async function loadCategoryAnalytics() {
    try {
        const q = buildQueryString();
        const res = await fetch(`/api/categories?${q}`);
        if (!res.ok) return;
        const data = await res.json();

        // Render Categories Donut Chart
        renderCategoriesDonut(data.categories);

        // Render Top Locations Bar Chart
        renderLocationsBar(data.locations);

        // Render Arrest Clearance Rate by Offense
        renderArrestClearanceChart(data.categories);

    } catch (e) {
        console.error("Failed to load category analytics:", e);
    }
}

/**
 * 4. Load Predictive Risk Model & Safety Index
 */
async function loadPredictiveModel() {
    try {
        const res = await fetch("/api/predictive/risk");
        if (!res.ok) return;
        const data = await res.json();
        state.predictiveData = data;

        // Render Predictive Risk Forecast Chart
        renderPredictiveRiskChart(data.hourly_threat_curve);

        // Populate District Safety Index Table
        const tbody = document.getElementById("tbody-district-risk");
        if (tbody) {
            tbody.innerHTML = "";
            data.districts.forEach(d => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong class="col-case-no">Dist ${d.district_id}</strong></td>
                    <td><strong>${d.district_name}</strong></td>
                    <td>${d.total_crimes.toLocaleString()}</td>
                    <td class="text-danger font-mono">${d.violent_crimes.toLocaleString()}</td>
                    <td>${d.violent_ratio}%</td>
                    <td>${d.arrest_rate}%</td>
                    <td><strong class="text-danger">${d.threat_score}</strong></td>
                    <td><strong class="text-emerald">${d.safety_index} / 100</strong></td>
                    <td><span class="badge-pill badge-${d.badge_class}">${d.risk_tier}</span></td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (e) {
        console.error("Failed to load predictive model:", e);
    }
}

/**
 * 5. Load Spatial Geospatial Points & Render Map
 */
async function loadSpatialData() {
    try {
        const q = buildQueryString({ limit: 3000 });
        const res = await fetch(`/api/spatial?${q}`);
        if (!res.ok) return;
        const points = await res.json();
        state.spatialPoints = points;

        const countEl = document.getElementById("map-rendered-count");
        if (countEl) countEl.textContent = points.length.toLocaleString();

        if (state.map) {
            renderMapLayers();
        }
    } catch (e) {
        console.error("Failed to load spatial points:", e);
    }
}

/**
 * Initialize Leaflet GIS Map with CartoDB Dark Matter Tiles
 */
function initLeafletMap() {
    const mapContainer = document.getElementById("leaflet-crime-map");
    if (!mapContainer || state.map) return;

    // Chicago Center Coordinates
    state.map = L.map("leaflet-crime-map", {
        center: [41.8781, -87.6298],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
    });

    // Add Zoom Control to top-right
    L.control.zoom({ position: "topright" }).addTo(state.map);

    // CartoDB Dark Matter Tile Layer (sleek cyber dark theme)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd"
    }).addTo(state.map);

    state.markersLayer = L.layerGroup().addTo(state.map);

    renderMapLayers();
}

/**
 * Render Active Map Layers (Heatmap or Incident Pins)
 */
function renderMapLayers() {
    if (!state.map) return;

    // Clear existing layers
    if (state.heatLayer) {
        state.map.removeLayer(state.heatLayer);
        state.heatLayer = null;
    }
    if (state.markersLayer) {
        state.markersLayer.clearLayers();
    }

    if (state.mapMode === "heatmap") {
        // Prepare Heatmap data: [lat, lng, weight]
        const heatPoints = state.spatialPoints.map(p => [p.lat, p.lng, p.weight]);
        const radius = parseInt(document.getElementById("heatmap-radius-slider")?.value || 25);
        const blur = parseInt(document.getElementById("heatmap-blur-slider")?.value || 15);

        state.heatLayer = L.heatLayer(heatPoints, {
            radius: radius,
            blur: blur,
            maxZoom: 17,
            gradient: {
                0.2: "#10b981",
                0.4: "#06b6d4",
                0.6: "#f59e0b",
                0.8: "#ef4444",
                1.0: "#7f1d1d"
            }
        }).addTo(state.map);
    } else {
        // Incident Markers Mode
        const slice = state.spatialPoints.slice(0, 400); // Limit to top 400 for responsive rendering
        slice.forEach(p => {
            const markerColor = p.is_violent ? "#ef4444" : "#38bdf8";
            const marker = L.circleMarker([p.lat, p.lng], {
                radius: p.is_violent ? 6 : 5,
                fillColor: markerColor,
                color: "#ffffff",
                weight: 1,
                opacity: 0.9,
                fillOpacity: 0.85
            });

            const popupHtml = `
                <div class="popup-crime-header">
                    <span class="popup-type">${p.type}</span>
                    <span class="popup-badge ${p.is_violent ? 'badge-danger' : 'badge-info'}">
                        ${p.is_violent ? 'VIOLENT' : 'PROPERTY'}
                    </span>
                </div>
                <div class="popup-item">
                    <span class="popup-item-label">Case Number:</span>
                    <span class="popup-item-val">${p.case_number}</span>
                </div>
                <div class="popup-item">
                    <span class="popup-item-label">Location:</span>
                    <span class="popup-item-val">${p.block}</span>
                </div>
                <div class="popup-item">
                    <span class="popup-item-label">Timestamp:</span>
                    <span class="popup-item-val">${p.date}</span>
                </div>
                <div class="popup-item">
                    <span class="popup-item-label">Arrest:</span>
                    <span class="popup-item-val ${p.arrest ? 'text-emerald' : 'text-danger'}">
                        ${p.arrest ? 'YES (Suspect Apprehended)' : 'NO (Unsolved)'}
                    </span>
                </div>
            `;
            marker.bindPopup(popupHtml);
            state.markersLayer.addLayer(marker);
        });
    }
}

/**
 * 6. Load Incident Explorer Table
 */
async function loadIncidentExplorer() {
    try {
        const q = buildQueryString({
            page: state.pagination.page,
            page_size: state.pagination.page_size
        });
        const res = await fetch(`/api/crimes?${q}`);
        if (!res.ok) return;
        const data = await res.json();

        state.pagination.total = data.total;
        state.pagination.total_pages = data.total_pages;

        // Update Pagination Controls
        document.getElementById("page-indicator").textContent = `Page ${data.page} of ${data.total_pages.toLocaleString()} (${data.total.toLocaleString()} records)`;
        document.getElementById("explorer-match-count").textContent = `Displaying ${data.records.length} matching incidents (Total matching: ${data.total.toLocaleString()})`;
        document.getElementById("btn-page-prev").disabled = data.page <= 1;
        document.getElementById("btn-page-next").disabled = data.page >= data.total_pages;

        // Populate Table Body
        const tbody = document.getElementById("tbody-incidents");
        tbody.innerHTML = "";

        if (data.records.length === 0) {
            tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 24px; color: var(--text-muted);">No incident records matched the specified filter criteria.</td></tr>`;
            return;
        }

        data.records.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="col-case-no">${r.case_number}</span></td>
                <td>${r.date.split(".")[0]}</td>
                <td><strong>${r.primary_type}</strong></td>
                <td><small class="text-secondary">${r.description || "-"}</small></td>
                <td class="col-block" title="${r.block}">${r.block}</td>
                <td><span class="badge-pill badge-info">Dist ${r.district}</span></td>
                <td>
                    <span class="badge-pill ${r.is_violent ? 'badge-danger' : 'badge-warning'}">
                        ${r.is_violent ? 'VIOLENT' : 'PROPERTY'}
                    </span>
                </td>
                <td>
                    <span class="badge-pill ${r.arrest ? 'badge-success' : 'badge-danger'}">
                        ${r.arrest ? 'YES' : 'NO'}
                    </span>
                </td>
                <td>
                    <span class="badge-pill ${r.domestic ? 'badge-warning' : 'badge-info'}">
                        ${r.domestic ? 'DOMESTIC' : 'PUBLIC'}
                    </span>
                </td>
                <td>
                    <button type="button" class="btn btn-outline btn-sm btn-inspect" data-id="${r.id}">
                        Inspect
                    </button>
                </td>
            `;

            tr.querySelector(".btn-inspect").addEventListener("click", () => {
                showIncidentModal(r);
            });

            tbody.appendChild(tr);
        });

    } catch (e) {
        console.error("Failed to load incident explorer:", e);
    }
}

/**
 * Show Detailed Incident Inspector Modal
 */
function showIncidentModal(incident) {
    const modal = document.getElementById("modal-incident");
    document.getElementById("modal-incident-title").textContent = `Case #${incident.case_number}`;
    document.getElementById("modal-badge-type").textContent = `${incident.primary_type} (${incident.is_violent ? 'VIOLENT CRIME' : 'NON-VIOLENT OFFENSE'})`;
    
    const body = document.getElementById("modal-incident-body");
    body.innerHTML = `
        <div class="modal-grid">
            <div class="modal-field">
                <span class="modal-field-label">Primary Offense</span>
                <span class="modal-field-value">${incident.primary_type}</span>
            </div>
            <div class="modal-field">
                <span class="modal-field-label">IUCR Code & Sub-Classification</span>
                <span class="modal-field-value">${incident.iucr || 'N/A'} - ${incident.description}</span>
            </div>
            <div class="modal-field">
                <span class="modal-field-label">Timestamp</span>
                <span class="modal-field-value">${incident.date}</span>
            </div>
            <div class="modal-field">
                <span class="modal-field-label">Location Type</span>
                <span class="modal-field-value">${incident.location_description || 'STREET'}</span>
            </div>
            <div class="modal-field">
                <span class="modal-field-label">Street Block Address</span>
                <span class="modal-field-value">${incident.block}</span>
            </div>
            <div class="modal-field">
                <span class="modal-field-label">Police District & Beat</span>
                <span class="modal-field-value">Dist ${incident.district} (${incident.district_name || 'Chicago'}) // Beat ${incident.beat || 'N/A'}</span>
            </div>
            <div class="modal-field">
                <span class="modal-field-label">Suspect Apprehended / Arrested</span>
                <span class="modal-field-value ${incident.arrest ? 'text-emerald' : 'text-danger'}">
                    ${incident.arrest ? 'YES (Suspect In Custody)' : 'NO (Unsolved / Open)'}
                </span>
            </div>
            <div class="modal-field">
                <span class="modal-field-label">Domestic Violence Classification</span>
                <span class="modal-field-value ${incident.domestic ? 'text-warning' : 'text-info'}">
                    ${incident.domestic ? 'YES (Domestic Incident)' : 'NO (Public Domain)'}
                </span>
            </div>
            <div class="modal-field" style="grid-column: span 2;">
                <span class="modal-field-label">GPS Verified Coordinates</span>
                <span class="modal-field-value text-sky">
                    ${incident.latitude && incident.longitude ? `${incident.latitude}, ${incident.longitude}` : 'Approximate Block Centroid'}
                </span>
            </div>
        </div>
    `;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

/**
 * 7. Populate Executive Briefing & Report
 */
function populateExecutiveBriefing() {
    if (!state.summaryData) return;
    const s = state.summaryData;

    document.getElementById("report-timestamp").textContent = new Date().toLocaleString();

    document.getElementById("report-exec-summary").innerHTML = `
        Between <strong>${s.date_range?.start?.split(' ')[0] || 'Active'}</strong> and 
        <strong>${s.date_range?.end?.split(' ')[0] || 'Present'}</strong>, a total of 
        <strong>${s.total_incidents.toLocaleString()}</strong> crime incidents were logged. 
        Violent crimes account for <strong>${s.violent_rate}%</strong> (${s.violent_incidents.toLocaleString()} cases), 
        while property/non-violent offenses comprise <strong>${s.property_rate}%</strong>. 
        The current overall arrest clearance rate stands at <strong>${s.arrest_rate}%</strong>.
    `;

    // KPI Summary boxes
    const kpiContainer = document.getElementById("report-kpi-summary-cards");
    if (kpiContainer) {
        kpiContainer.innerHTML = `
            <div class="report-kpi-box">
                <span class="lbl">Total Reported</span>
                <span class="val">${s.total_incidents.toLocaleString()}</span>
            </div>
            <div class="report-kpi-box">
                <span class="lbl">Violent Incidents</span>
                <span class="val text-danger">${s.violent_incidents.toLocaleString()}</span>
            </div>
            <div class="report-kpi-box">
                <span class="lbl">Arrest Clearance</span>
                <span class="val text-info">${s.arrest_rate}%</span>
            </div>
            <div class="report-kpi-box">
                <span class="lbl">Domestic Dispute</span>
                <span class="val text-warning">${s.domestic_rate}%</span>
            </div>
        `;
    }

    // Hotspot Grid
    if (state.predictiveData && state.predictiveData.districts) {
        const top3 = state.predictiveData.districts.slice(0, 3);
        const hotspotContainer = document.getElementById("report-hotspot-list");
        if (hotspotContainer) {
            hotspotContainer.innerHTML = "";
            top3.forEach(h => {
                const card = document.createElement("div");
                card.className = "hotspot-card";
                card.innerHTML = `
                    <div class="h-name">Dist ${h.district_id} - ${h.district_name}</div>
                    <div class="h-sub">${h.total_crimes.toLocaleString()} crimes (${h.violent_ratio}% violent)</div>
                    <div class="h-score">Threat Index: ${h.threat_score} / 100 (${h.risk_tier})</div>
                `;
                hotspotContainer.appendChild(card);
            });
        }
    }
}

/**
 * Handle CSV Export
 */
function handleExportCSV() {
    const q = buildQueryString();
    const downloadUrl = `/api/crimes/export?${q}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "crime_data_analytics.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ==========================================================================
   Chart.js Rendering Functions
   ========================================================================== */

const CHART_COLORS = {
    crimson: "#ef4444",
    cyan: "#06b6d4",
    sky: "#38bdf8",
    amber: "#f59e0b",
    emerald: "#10b981",
    purple: "#8b5cf6",
    grid: "rgba(255, 255, 255, 0.06)",
    text: "#94a3b8"
};

function renderDiurnalChart(hourlyData) {
    const ctx = document.getElementById("chart-diurnal");
    if (!ctx) return;

    if (state.charts.diurnal) state.charts.diurnal.destroy();

    const labels = hourlyData.map(h => h.label);
    const totalCounts = hourlyData.map(h => h.count);
    const violentCounts = hourlyData.map(h => h.violent);

    state.charts.diurnal = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Total Incidents",
                    data: totalCounts,
                    borderColor: CHART_COLORS.sky,
                    backgroundColor: "rgba(56, 189, 248, 0.12)",
                    borderWidth: 2.5,
                    tension: 0.35,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6
                },
                {
                    label: "Violent Incidents",
                    data: violentCounts,
                    borderColor: CHART_COLORS.crimson,
                    backgroundColor: "rgba(239, 68, 68, 0.18)",
                    borderWidth: 2,
                    tension: 0.35,
                    fill: true,
                    pointRadius: 2.5,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { labels: { color: CHART_COLORS.text, font: { family: "Inter", size: 11 } } },
                tooltip: { backgroundColor: "rgba(14, 20, 36, 0.95)", borderColor: "rgba(56, 189, 248, 0.4)", borderWidth: 1 }
            },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { family: "Inter", size: 10 } } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { family: "Inter", size: 10 } } }
            }
        }
    });
}

function renderCategoriesDonut(categoriesData) {
    const ctx = document.getElementById("chart-categories-donut");
    if (!ctx) return;

    if (state.charts.donut) state.charts.donut.destroy();

    const top6 = categoriesData.slice(0, 6);
    const labels = top6.map(c => c.category);
    const values = top6.map(c => c.count);

    const palette = [
        CHART_COLORS.sky,
        CHART_COLORS.crimson,
        CHART_COLORS.amber,
        CHART_COLORS.emerald,
        CHART_COLORS.purple,
        CHART_COLORS.cyan
    ];

    state.charts.donut = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: palette,
                borderColor: "rgba(14, 20, 36, 0.9)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "right", labels: { color: CHART_COLORS.text, font: { family: "Inter", size: 10 }, boxWidth: 12 } }
            },
            cutout: "68%"
        }
    });
}

function renderDowChart(dowData) {
    const ctx = document.getElementById("chart-dow");
    if (!ctx) return;

    if (state.charts.dow) state.charts.dow.destroy();

    const labels = dowData.map(d => d.day_name.substring(0, 3));
    const counts = dowData.map(d => d.count);
    const violent = dowData.map(d => d.violent);

    state.charts.dow = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Property / Other",
                    data: counts.map((c, i) => c - violent[i]),
                    backgroundColor: "rgba(56, 189, 248, 0.7)",
                    borderRadius: 4
                },
                {
                    label: "Violent Crimes",
                    data: violent,
                    backgroundColor: "rgba(239, 68, 68, 0.8)",
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: CHART_COLORS.text, font: { family: "Inter", size: 10 } } }
            },
            scales: {
                x: { stacked: true, grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } },
                y: { stacked: true, grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } }
            }
        }
    });
}

function renderLocationsBar(locationsData) {
    const ctx = document.getElementById("chart-locations");
    if (!ctx) return;

    if (state.charts.locations) state.charts.locations.destroy();

    const top8 = locationsData.slice(0, 8);
    const labels = top8.map(l => l.location.length > 18 ? l.location.substring(0, 18) + "..." : l.location);
    const counts = top8.map(l => l.count);

    state.charts.locations = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Incident Volume",
                data: counts,
                backgroundColor: "rgba(6, 182, 212, 0.7)",
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } },
                y: { grid: { display: false }, ticks: { color: CHART_COLORS.text, font: { size: 10 } } }
            }
        }
    });
}

function renderTimelineChart(timelineData) {
    const ctx = document.getElementById("chart-daily-timeline");
    if (!ctx) return;

    if (state.charts.timeline) state.charts.timeline.destroy();

    const labels = timelineData.map(t => t.date);
    const counts = timelineData.map(t => t.count);
    const violent = timelineData.map(t => t.violent);
    const arrest = timelineData.map(t => t.arrest);

    state.charts.timeline = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Daily Incidents",
                    data: counts,
                    borderColor: CHART_COLORS.sky,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 2
                },
                {
                    label: "Violent Incidents",
                    data: violent,
                    borderColor: CHART_COLORS.crimson,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 2
                },
                {
                    label: "Arrest Clearance",
                    data: arrest,
                    borderColor: CHART_COLORS.emerald,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    pointRadius: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { labels: { color: CHART_COLORS.text, font: { family: "Inter", size: 11 } } }
            },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, maxTicksLimit: 14 } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } }
            }
        }
    });
}

function renderArrestClearanceChart(categoriesData) {
    const ctx = document.getElementById("chart-arrest-clearance");
    if (!ctx) return;

    if (state.charts.clearance) state.charts.clearance.destroy();

    const top8 = categoriesData.slice(0, 8);
    const labels = top8.map(c => c.category);
    const rates = top8.map(c => c.arrest_rate);

    state.charts.clearance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Clearance Rate (%)",
                data: rates,
                backgroundColor: rates.map(r => r > 25 ? "rgba(16, 185, 129, 0.75)" : "rgba(245, 158, 11, 0.75)"),
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 9 }, maxRotation: 45 } },
                y: {
                    grid: { color: CHART_COLORS.grid },
                    ticks: { color: CHART_COLORS.text, callback: (v) => v + "%" },
                    max: 100
                }
            }
        }
    });
}

function renderHourlySplitChart(hourlyData) {
    const ctx = document.getElementById("chart-hourly-split");
    if (!ctx) return;

    if (state.charts.split) state.charts.split.destroy();

    const labels = hourlyData.map(h => h.label);
    const total = hourlyData.map(h => h.count);
    const violent = hourlyData.map(h => h.violent);
    const violentPct = total.map((t, i) => t > 0 ? Math.round((violent[i] / t) * 100) : 0);

    state.charts.split = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Violent Crime % of Hourly Total",
                data: violentPct,
                backgroundColor: violentPct.map(p => p >= 40 ? "rgba(239, 68, 68, 0.85)" : "rgba(56, 189, 248, 0.6)"),
                borderRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `Violent Ratio: ${ctx.raw}%`
                    }
                }
            },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 9 } } },
                y: {
                    grid: { color: CHART_COLORS.grid },
                    ticks: { color: CHART_COLORS.text, callback: (v) => v + "%" },
                    max: 100
                }
            }
        }
    });
}

function renderPredictiveRiskChart(hourlyThreatCurve) {
    const ctx = document.getElementById("chart-predictive-risk");
    if (!ctx) return;

    if (state.charts.predictive) state.charts.predictive.destroy();

    const labels = hourlyThreatCurve.map(h => h.label);
    const riskProb = hourlyThreatCurve.map(h => h.predictive_risk_prob);
    const volumeShare = hourlyThreatCurve.map(h => h.incident_share_pct);

    state.charts.predictive = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Composite Threat Probability Index",
                    data: riskProb,
                    borderColor: CHART_COLORS.crimson,
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: CHART_COLORS.crimson
                },
                {
                    label: "Hourly Incident Volume Share (%)",
                    data: volumeShare,
                    borderColor: CHART_COLORS.cyan,
                    borderWidth: 2,
                    tension: 0.4,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: { labels: { color: CHART_COLORS.text, font: { family: "Inter", size: 11 } } },
                tooltip: { backgroundColor: "rgba(14, 20, 36, 0.95)", borderColor: "rgba(239, 68, 68, 0.4)", borderWidth: 1 }
            },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } }
            }
        }
    });
}

/**
 * Setup Safety Footer and Helpline Copy Listeners
 */
function setupSafetyFooter() {
    document.addEventListener("click", (e) => {
        const copyBtn = e.target.closest("[data-copy]");
        if (copyBtn) {
            e.preventDefault();
            const textToCopy = copyBtn.getAttribute("data-copy");
            const label = copyBtn.getAttribute("data-copy-label") || "Helpline";
            if (textToCopy) {
                copyToClipboard(textToCopy, label);

                // Visual button confirmation feedback
                const origHtml = copyBtn.innerHTML;
                copyBtn.classList.add("copied");
                const spanEl = copyBtn.querySelector("span");
                if (spanEl) spanEl.textContent = "Copied!";
                setTimeout(() => {
                    copyBtn.innerHTML = origHtml;
                    copyBtn.classList.remove("copied");
                }, 1800);
            }
        }
    });
}

function showSafetyToast(message) {
    const toast = document.getElementById("safety-toast");
    const msgEl = document.getElementById("safety-toast-message");
    if (!toast) return;
    if (msgEl) msgEl.textContent = message;
    toast.classList.add("show");
    if (window._safetyToastTimer) clearTimeout(window._safetyToastTimer);
    window._safetyToastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

function copyToClipboard(text, label = "Helpline") {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showSafetyToast(`Copied ${label}: ${text}`);
        }).catch(() => {
            fallbackCopyText(text, label);
        });
    } else {
        fallbackCopyText(text, label);
    }
}

function fallbackCopyText(text, label = "Helpline") {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand("copy");
        showSafetyToast(`Copied ${label}: ${text}`);
    } catch (err) {
        showSafetyToast(`Helpline: ${text}`);
    }
    document.body.removeChild(textArea);
}

/**
 * =========================================================================
 * GLOBAL CITIES & COUNTRIES SURVEILLANCE ENGINE
 * =========================================================================
 */

function repopulateCityDropdown(countryName, selectCityName = null) {
    const citySelect = document.getElementById("filter-city");
    if (!citySelect) return;
    citySelect.innerHTML = "";

    const cNameLower = (countryName || "").toLowerCase();
    let filtered = (state.globalCities || []).filter(c => (c.country || "").toLowerCase() === cNameLower);

    // Fallback if globalCities array is not loaded yet but globalCountries has city list
    if (filtered.length === 0 && state.globalCountries && state.globalCountries.length > 0) {
        const countryObj = state.globalCountries.find(c => (c.country || "").toLowerCase() === cNameLower);
        if (countryObj && countryObj.cities) {
            filtered = countryObj.cities.map(name => ({
                city_name: name,
                country: countryObj.country,
                risk_tier: "Active"
            }));
        }
    }

    filtered.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.city_name;
        opt.textContent = c.risk_tier ? `${c.city_name} (${c.risk_tier})` : c.city_name;
        citySelect.appendChild(opt);
    });

    if (selectCityName && filtered.some(c => (c.city_name || "").toLowerCase() === selectCityName.toLowerCase())) {
        citySelect.value = selectCityName;
    } else if (filtered.length > 0) {
        citySelect.value = filtered[0].city_name;
    }
}

async function repopulateDistrictsForCity(cityName) {
    try {
        const res = await fetch(`/api/filter-options?city=${encodeURIComponent(cityName)}`);
        if (!res.ok) return;
        const data = await res.json();

        // Populate Districts dropdown
        const districtSelect = document.getElementById("filter-district");
        if (districtSelect) {
            const count = (data.districts || []).length;
            districtSelect.innerHTML = `<option value="">All ${count} Districts / Sectors</option>`;
            (data.districts || []).forEach(d => {
                const opt = document.createElement("option");
                opt.value = d.id;
                opt.textContent = d.name;
                districtSelect.appendChild(opt);
            });
            districtSelect.value = "";
        }

        // Map sidebar quick-jump chips
        const chipContainer = document.getElementById("district-tags-container");
        if (chipContainer) {
            chipContainer.innerHTML = "";
            (data.districts || []).forEach(d => {
                const chip = document.createElement("button");
                chip.type = "button";
                chip.className = "district-chip";
                chip.textContent = d.id ? `D-${d.id}` : (d.name.length > 14 ? d.name.slice(0, 12) + "..." : d.name);
                chip.title = d.name;
                chip.addEventListener("click", () => {
                    districtSelect.value = d.id;
                    state.filters.district = d.id;
                    refreshAllData();
                });
                chipContainer.appendChild(chip);
            });
        }
    } catch (e) {
        console.error("Error repopulating districts:", e);
    }
}

async function switchCity(cityName) {
    if (!cityName) return;
    state.filters.city = cityName;
    state.filters.district = "";
    state.pagination.page = 1;

    try {
        const res = await fetch(`/api/global/cities/${encodeURIComponent(cityName)}`);
        if (res.ok) {
            const profile = await res.json();
            state.currentCityProfile = profile;
            state.filters.country = profile.country;

            // Sync Country dropdown
            const countrySelect = document.getElementById("filter-country");
            if (countrySelect && countrySelect.value !== profile.country) {
                countrySelect.value = profile.country;
                repopulateCityDropdown(profile.country, profile.city_name);
            } else {
                const citySelect = document.getElementById("filter-city");
                if (citySelect) citySelect.value = profile.city_name;
            }

            // Fly Leaflet map to city center if map exists
            if (state.map && profile.lat && profile.lng) {
                state.map.flyTo([profile.lat, profile.lng], 12, { animate: true, duration: 1.2 });
            }

            // Update Header Status Badge
            const statusLabel = document.querySelector("#system-status-badge .status-label");
            if (statusLabel) {
                statusLabel.innerHTML = `DATASET ACTIVE: <strong id="header-total-count">...</strong> INCIDENTS (${profile.flag} ${profile.city_name.toUpperCase()}, ${profile.country_code})`;
            }

            // Update Active Surveillance Displays in Roster
            const activeCityEl = document.getElementById("active-surveillance-city-name");
            if (activeCityEl) activeCityEl.textContent = `${profile.flag} ${profile.city_name}, ${profile.country_code}`;
            const activeAgencyEl = document.getElementById("active-surveillance-agency");
            if (activeAgencyEl) activeAgencyEl.textContent = profile.police_agency;

            // Repopulate districts for this city
            await repopulateDistrictsForCity(cityName);
        }
    } catch (e) {
        console.error("Error switching city profile:", e);
    }

    await refreshAllData();

    // If World Cities roster is open or rendered, update active card highlight
    updateActiveCityCardHighlight();
}

/**
 * 7. World Cities Roster Module
 */
async function loadGlobalCitiesRoster() {
    const grid = document.getElementById("grid-global-cities");
    if (!grid) return;

    const searchInput = document.getElementById("input-search-global-cities");
    const regionSelect = document.getElementById("select-global-region");
    const sortSelect = document.getElementById("select-global-sort");
    const riskSelect = document.getElementById("select-global-risk-tier");

    const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const regionVal = regionSelect ? regionSelect.value : "all";
    const sortVal = sortSelect ? sortSelect.value : "safety_index_desc";
    const riskVal = riskSelect ? riskSelect.value : "all";

    // Filter cities in state
    let filtered = [...state.globalCities];

    if (regionVal !== "all") {
        filtered = filtered.filter(c => c.region.toLowerCase() === regionVal.toLowerCase());
    }

    if (riskVal !== "all") {
        filtered = filtered.filter(c => c.risk_tier.toLowerCase() === riskVal.toLowerCase());
    }

    if (searchVal) {
        filtered = filtered.filter(c => 
            c.city_name.toLowerCase().includes(searchVal) ||
            c.country.toLowerCase().includes(searchVal) ||
            c.police_agency.toLowerCase().includes(searchVal) ||
            c.region.toLowerCase().includes(searchVal)
        );
    }

    // Sort
    if (sortVal === "safety_index_desc") {
        filtered.sort((a, b) => b.safety_index - a.safety_index);
    } else if (sortVal === "crime_index_desc") {
        filtered.sort((a, b) => b.crime_index - a.crime_index);
    } else if (sortVal === "population_desc") {
        filtered.sort((a, b) => b.population_millions - a.population_millions);
    } else if (sortVal === "city_asc") {
        filtered.sort((a, b) => a.city_name.localeCompare(b.city_name));
    } else if (sortVal === "country_asc") {
        filtered.sort((a, b) => a.country.localeCompare(b.country));
    }

    // Match count badge
    const badge = document.getElementById("global-cities-match-count");
    if (badge) {
        badge.textContent = `Displaying ${filtered.length} of ${state.globalCities.length} World Metros`;
    }

    // Update active surveillance display in KPI card
    if (state.currentCityProfile) {
        const activeCityEl = document.getElementById("active-surveillance-city-name");
        if (activeCityEl) activeCityEl.textContent = `${state.currentCityProfile.flag} ${state.currentCityProfile.city_name}, ${state.currentCityProfile.country_code}`;
        const activeAgencyEl = document.getElementById("active-surveillance-agency");
        if (activeAgencyEl) activeAgencyEl.textContent = state.currentCityProfile.police_agency;
    }

    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
                <p style="font-size: 1.1rem; margin-bottom: 8px;">No world cities matched your filter criteria.</p>
                <button type="button" class="btn btn-outline btn-sm" id="btn-reset-roster-filters">Reset Roster Filters</button>
            </div>
        `;
        document.getElementById("btn-reset-roster-filters")?.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (regionSelect) regionSelect.value = "all";
            if (riskSelect) riskSelect.value = "all";
            if (sortSelect) sortSelect.value = "safety_index_desc";
            loadGlobalCitiesRoster();
        });
        return;
    }

    filtered.forEach(city => {
        const isCurrent = state.filters.city.toLowerCase() === city.city_name.toLowerCase();
        const card = document.createElement("div");
        card.className = `world-city-card ${isCurrent ? 'active-surveillance' : ''}`;
        card.setAttribute("data-city", city.city_name);
        card.setAttribute("title", `Click to monitor ${city.city_name}`);

        // Safety badge color class for pill
        let safetyPillClass = "pill-safe";
        if (city.safety_index < 40) {
            safetyPillClass = "pill-danger";
        } else if (city.safety_index < 65) {
            safetyPillClass = "pill-warning";
        }

        card.innerHTML = `
            <div class="world-city-top-bar">
                <h3 class="world-city-title" title="${city.city_name}, ${city.country}">${city.city_name}, ${city.country}</h3>
                ${isCurrent ? `
                <div class="world-city-active-badge">
                    <span class="badge-dot"></span>
                    <span>Surveillance Active</span>
                </div>` : ''}
            </div>
            <div class="world-city-pills">
                <span class="world-city-pill ${safetyPillClass}">🛡️ ${city.safety_index} Safety</span>
                <span class="world-city-pill">${city.flag} ${city.country}</span>
                <span class="world-city-pill">👥 ${city.population_millions}M</span>
                ${isCurrent ? `<span class="world-city-pill pill-active">✓ Active</span>` : ''}
            </div>
        `;

        card.addEventListener("click", async () => {
            if (state.filters.city.toLowerCase() === city.city_name.toLowerCase()) return;
            await switchCity(city.city_name);
        });

        grid.appendChild(card);
    });
}

function updateActiveCityCardHighlight() {
    const cards = document.querySelectorAll(".world-city-card");
    cards.forEach(card => {
        const cityName = card.getAttribute("data-city");
        const isCurrent = cityName && cityName.toLowerCase() === state.filters.city.toLowerCase();
        const topBar = card.querySelector(".world-city-top-bar");
        const pillsWrap = card.querySelector(".world-city-pills");
        let activeBadge = card.querySelector(".world-city-active-badge");
        let activePill = card.querySelector(".pill-active");

        if (isCurrent) {
            card.classList.add("active-surveillance");
            if (!activeBadge && topBar) {
                const badgeEl = document.createElement("div");
                badgeEl.className = "world-city-active-badge";
                badgeEl.innerHTML = `<span class="badge-dot"></span><span>Surveillance Active</span>`;
                topBar.appendChild(badgeEl);
            }
            if (!activePill && pillsWrap) {
                const pillEl = document.createElement("span");
                pillEl.className = "world-city-pill pill-active";
                pillEl.textContent = "✓ Active";
                pillsWrap.appendChild(pillEl);
            }
        } else {
            card.classList.remove("active-surveillance");
            if (activeBadge) activeBadge.remove();
            if (activePill) activePill.remove();
        }
    });
}

function setupGlobalCitiesListeners() {
    const searchInput = document.getElementById("input-search-global-cities");
    let deb;
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            clearTimeout(deb);
            deb = setTimeout(loadGlobalCitiesRoster, 250);
        });
    }

    const regionSelect = document.getElementById("select-global-region");
    if (regionSelect) regionSelect.addEventListener("change", loadGlobalCitiesRoster);

    const sortSelect = document.getElementById("select-global-sort");
    if (sortSelect) sortSelect.addEventListener("change", loadGlobalCitiesRoster);

    const riskSelect = document.getElementById("select-global-risk-tier");
    if (riskSelect) riskSelect.addEventListener("change", loadGlobalCitiesRoster);

    const btnExportRoster = document.getElementById("btn-export-global-cities");
    if (btnExportRoster) {
        btnExportRoster.addEventListener("click", () => {
            window.open("/api/global/cities-export", "_blank");
        });
    }
}


