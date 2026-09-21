/**
 * Bharat CrimeTrack // Dedicated India NCRB Analytics Controller
 * Supports Comprehensive Search & Inspection across all 36 States and all Districts in India.
 */

const indiaState = {
    activeView: "view-india-overview",
    map: null,
    statesLayer: null,
    districtsLayer: null,
    currentGisLayer: "states", // "states" | "districts"
    selectedGisState: "all",
    currentExplorerView: "states", // "states" | "districts" | "incidents"
    incidentsPage: 1,
    incidentsTotalPages: 1,
    incidentsTotalCount: 5000,
    currentSafetyView: "states", // "states" | "districts"
    filters: {
        category: "",
        state: "",
        district: "",
        violence: "",
        arrest: "",
        domestic: "",
        search: "",
        date: new Date().toISOString().split("T")[0],
        preset: "live",
        year: null
    },
    realtimeData: null,
    realtimeAutoRefreshTimer: null,
    currentRealtimeFilter: "all",
    statesData: [],
    districtsData: [],
    citiesData: [],
    categoriesData: [],
    summaryData: null,
    charts: {},
    activeEntity: null,
    activeEntityType: "state",
    activeCity: "Delhi City"
};

const CHART_COLORS = {
    saffron: "#fb923c",
    emerald: "#10b981",
    crimson: "#ef4444",
    cyan: "#06b6d4",
    sky: "#38bdf8",
    amber: "#f59e0b",
    purple: "#8b5cf6",
    grid: "rgba(255, 255, 255, 0.06)",
    text: "#94a3b8"
};

document.addEventListener("DOMContentLoaded", () => {
    initIndiaPortal();
});

async function initIndiaPortal() {
    try { setupNavigation(); } catch (e) { console.error("Nav init error:", e); }
    try { setupModals(); } catch (e) { console.error("Modals init error:", e); }
    try { setupFilterStrip(); } catch (e) { console.error("Filter strip init error:", e); }
    try { setupExplorerToggles(); } catch (e) { console.error("Explorer toggles init error:", e); }
    try { setupSafetyToggles(); } catch (e) { console.error("Safety toggles init error:", e); }
    try { setupGisControls(); } catch (e) { console.error("GIS controls init error:", e); }
    try { setupWomenControls(); } catch (e) { console.error("Women controls init error:", e); }
    try { setupSafetyFooter(); } catch (e) { console.error("Safety footer init error:", e); }
    try { setupBannerButtons(); } catch (e) { console.error("Banner buttons init error:", e); }
    try { setupKpiInteractions(); } catch (e) { console.error("KPI interactions init error:", e); }
    try { setupIndiaCitiesListeners(); } catch (e) { console.error("Cities roster init error:", e); }

    const btnOverviewExplorer = document.getElementById("btn-overview-open-explorer");
    if (btnOverviewExplorer) {
        btnOverviewExplorer.addEventListener("click", () => {
            const tabExplorer = document.getElementById("tab-explorer");
            if (tabExplorer) tabExplorer.click();
            switchToExplorerDistrictsView();
            applyAllFilters();
        });
    }

    await loadAllIndiaData();
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
                indiaState.activeView = targetViewId;

                // If switching to GIS Map, ensure Leaflet canvas renders correctly
                if (targetViewId === "view-india-gis") {
                    if (!indiaState.map) {
                        initIndiaMap();
                    } else {
                        setTimeout(() => indiaState.map.invalidateSize(), 150);
                    }
                }

                // If switching to Women Safety dashboard, load data if not yet loaded
                if (targetViewId === "view-india-women") {
                    if (!womenState.loaded) {
                        loadWomenData();
                    }
                }

                // If switching to India Cities Roster, render cities cards
                if (targetViewId === "view-india-cities") {
                    loadIndiaCitiesRoster();
                }
            }
        });
    });
}

/**
 * Setup Quick-Action Banner Buttons & Header Links
 */
function setupBannerButtons() {
    // 1. Official NCRB Bulletin Button
    const btnBulletin = document.getElementById("btn-bulletin-link");
    if (btnBulletin) {
        btnBulletin.addEventListener("click", (e) => {
            e.preventDefault();
            const tabBriefing = document.getElementById("tab-briefing");
            if (tabBriefing) {
                tabBriefing.click();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    // 2. 36 States & UTs Explorer Button
    const btnStates = document.getElementById("btn-states-link");
    if (btnStates) {
        btnStates.addEventListener("click", (e) => {
            e.preventDefault();
            const tabExplorer = document.getElementById("tab-explorer");
            if (tabExplorer) {
                tabExplorer.click();
                switchToExplorerStatesView();
                applyAllFilters();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    // 3. Real-Time Dataset Active (Sync Pill)
    const btnSyncPill = document.getElementById("btn-sync-pill");
    if (btnSyncPill) {
        btnSyncPill.addEventListener("click", (e) => {
            e.preventDefault();
            const btnSync = document.getElementById("btn-sync-india");
            if (btnSync) {
                btnSync.click();
            }
        });
    }

    // 4. Brand Header Logo Link (Return to National Overview)
    const brandLink = document.getElementById("brand-header-link");
    if (brandLink) {
        brandLink.addEventListener("click", (e) => {
            e.preventDefault();
            const tabOverview = document.getElementById("tab-overview");
            if (tabOverview) {
                tabOverview.click();
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }
}

/**
 * Setup Modals & Live Sync Flow
 */
function setupModals() {
    // State/District Detail Modal
    const modalDetail = document.getElementById("modal-state-detail");
    const btnCloseDetail = document.getElementById("btn-close-state-modal");
    const btnDismissDetail = document.getElementById("btn-modal-state-dismiss");
    const btnLocateMap = document.getElementById("btn-modal-locate-map");

    const closeDetailModal = () => {
        modalDetail.classList.remove("active");
        modalDetail.setAttribute("aria-hidden", "true");
    };

    if (btnCloseDetail) btnCloseDetail.addEventListener("click", closeDetailModal);
    if (btnDismissDetail) btnDismissDetail.addEventListener("click", closeDetailModal);

    if (btnLocateMap) {
        btnLocateMap.addEventListener("click", () => {
            closeDetailModal();
            if (indiaState.activeEntity) {
                locateEntityOnMap(indiaState.activeEntity, indiaState.activeEntityType);
            }
        });
    }

    // Live Sync Modal
    const modalSync = document.getElementById("modal-india-sync");
    const btnOpenSync = document.getElementById("btn-sync-india");
    const btnCloseSync = document.getElementById("btn-close-sync-modal");
    const btnCancelSync = document.getElementById("btn-cancel-india-sync");
    const btnConfirmSync = document.getElementById("btn-confirm-india-sync");

    const openSyncModal = () => {
        modalSync.classList.add("active");
        modalSync.setAttribute("aria-hidden", "false");
    };
    const closeSyncModal = () => {
        modalSync.classList.remove("active");
        modalSync.setAttribute("aria-hidden", "true");
        const progressBox = document.getElementById("india-sync-progress");
        if (progressBox) progressBox.classList.add("hidden");
        if (btnConfirmSync) btnConfirmSync.disabled = false;
    };

    if (btnOpenSync) btnOpenSync.addEventListener("click", openSyncModal);
    if (btnCloseSync) btnCloseSync.addEventListener("click", closeSyncModal);
    if (btnCancelSync) btnCancelSync.addEventListener("click", closeSyncModal);

    if (btnConfirmSync) {
        btnConfirmSync.addEventListener("click", async () => {
            btnConfirmSync.disabled = true;
            const progressBox = document.getElementById("india-sync-progress");
            const statusMsg = document.getElementById("india-sync-status-msg");
            const recordCountSelect = document.getElementById("india-sync-record-count");
            const count = recordCountSelect ? recordCountSelect.value : 5000;

            if (progressBox) progressBox.classList.remove("hidden");

            try {
                if (statusMsg) statusMsg.textContent = "Connecting to National CCTNS Gateways & NCRB repositories...";
                await new Promise(r => setTimeout(r, 600));

                if (statusMsg) statusMsg.textContent = `Streaming and ingesting ${Number(count).toLocaleString()} verified incident FIRs across 790+ districts...`;
                await new Promise(r => setTimeout(r, 800));

                const dateParam = indiaState.filters.date ? `&date=${indiaState.filters.date}` : "";
                const res = await fetch(`/api/india/sync?limit=${count}${dateParam}`, { method: "POST" });
                const data = await res.json();

                const totalIncidents = data.total_active_incidents || count;
                const headerCountEl = document.getElementById("india-header-total-count");
                if (headerCountEl) {
                    headerCountEl.textContent = Number(totalIncidents).toLocaleString();
                }

                if (statusMsg) statusMsg.textContent = `Sync Complete! Ingested ${data.records_synced.toLocaleString()} incidents. Active dataset: ${Number(totalIncidents).toLocaleString()} records.`;
                await new Promise(r => setTimeout(r, 600));

                const badge = document.getElementById("badge-last-sync");
                if (badge) {
                    badge.textContent = `LIVE SYNCED: ${new Date().toLocaleTimeString()}`;
                    badge.className = "badge-pill badge-warning";
                }

                closeSyncModal();
                await loadAllIndiaData();

                if (indiaState.currentExplorerView === "incidents") {
                    await loadIndiaIncidents(1);
                }
            } catch (err) {
                if (statusMsg) statusMsg.textContent = "Connection error: " + err.message;
                btnConfirmSync.disabled = false;
            }
        });
    }
}

/**
 * Setup Global Filter Strip Controls
 */
function setupFilterStrip() {
    // 0. Calendar Date & Preset selector
    const dateInput = document.getElementById("filter-india-date");
    const presetSelect = document.getElementById("filter-india-preset");
    const todayStr = new Date().toISOString().split("T")[0];

    if (dateInput) {
        dateInput.value = indiaState.filters.date || todayStr;

        const handleDateChange = async (e) => {
            const val = e.target.value;
            if (!val) return;
            indiaState.filters.date = val;
            indiaState.filters.year = null;
            if (presetSelect) {
                const yestStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
                if (val === todayStr) presetSelect.value = "live";
                else if (val === yestStr) presetSelect.value = "yesterday";
                else presetSelect.value = "custom";
            }
            await loadAllIndiaData();
            applyAllFilters();
            showSafetyToast(`📅 Loaded Crime Telemetry for ${val}`);
        };

        dateInput.addEventListener("input", handleDateChange);
        dateInput.addEventListener("change", handleDateChange);
    }

    if (presetSelect) {
        presetSelect.addEventListener("change", async (e) => {
            const p = e.target.value;
            indiaState.filters.preset = p;
            const now = new Date();
            let chosenDate = now.toISOString().split("T")[0];
            let chosenYear = null;

            if (p === "live") {
                chosenDate = now.toISOString().split("T")[0];
                chosenYear = null;
            } else if (p === "yesterday") {
                chosenDate = new Date(Date.now() - 86400000).toISOString().split("T")[0];
                chosenYear = null;
            } else if (p === "rolling7") {
                chosenDate = now.toISOString().split("T")[0];
                chosenYear = null;
            } else if (p === "thismonth") {
                chosenDate = now.toISOString().split("T")[0];
                chosenYear = null;
            } else if (["2025", "2024", "2023", "2022", "2021", "2020"].includes(p)) {
                chosenDate = `${p}-12-31`;
                chosenYear = parseInt(p, 10);
            }

            if (p !== "custom" && dateInput) {
                dateInput.value = chosenDate;
            }
            indiaState.filters.date = chosenDate;
            indiaState.filters.year = chosenYear;
            await loadAllIndiaData();
            applyAllFilters();
            showSafetyToast(`📅 Switched to ${presetSelect.options[presetSelect.selectedIndex].text}`);
        });
    }

    // 0.1 Real-Time Ingestion Fetch Button
    const btnFetchRealtime = document.getElementById("btn-fetch-realtime");
    if (btnFetchRealtime) {
        btnFetchRealtime.addEventListener("click", async () => {
            btnFetchRealtime.classList.add("loading");
            try {
                const curDate = indiaState.filters.date || new Date().toISOString().split("T")[0];
                await fetch(`/api/india/sync?date=${encodeURIComponent(curDate)}`, { method: "POST" });
                await loadAllIndiaData();
                await loadRealtimeData(true);
            } catch (err) {
                console.error("Realtime sync error:", err);
            } finally {
                btnFetchRealtime.classList.remove("loading");
            }
        });
    }

    // 0.2 Real-time Stream Refresh Button
    const btnStreamRefresh = document.getElementById("btn-stream-refresh-now");
    if (btnStreamRefresh) {
        btnStreamRefresh.addEventListener("click", async () => {
            await loadRealtimeData(true);
        });
    }

    // 0.3 Real-time Category Toggles
    const rtCategoryToggles = document.getElementById("realtime-category-toggles");
    if (rtCategoryToggles) {
        rtCategoryToggles.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-toggle");
            if (!btn) return;
            rtCategoryToggles.querySelectorAll(".btn-toggle").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            indiaState.currentRealtimeFilter = btn.getAttribute("data-rt-cat") || "all";
            if (indiaState.realtimeData) {
                renderRealtimeIncidentList(indiaState.realtimeData.incidents || []);
            }
        });
    }

    // 0.4 Auto-refresh toggle (Live 12s heartbeat)
    const toggleAutoRefresh = document.getElementById("toggle-realtime-auto");
    if (toggleAutoRefresh) {
        const setupAutoTimer = () => {
            if (indiaState.realtimeAutoRefreshTimer) {
                clearInterval(indiaState.realtimeAutoRefreshTimer);
                indiaState.realtimeAutoRefreshTimer = null;
            }
            if (toggleAutoRefresh.checked && (indiaState.filters.preset === "live" || !indiaState.filters.year)) {
                indiaState.realtimeAutoRefreshTimer = setInterval(() => {
                    loadRealtimeData(false);
                }, 12000);
            }
        };
        toggleAutoRefresh.addEventListener("change", setupAutoTimer);
        setupAutoTimer();
    }

    // 1. Offense Category select
    const catSelect = document.getElementById("filter-crime-type");
    if (catSelect) {
        catSelect.addEventListener("change", (e) => {
            indiaState.filters.category = e.target.value;
            applyAllFilters();
        });
    }

    // 2. State select
    const stateSelect = document.getElementById("filter-state");
    if (stateSelect) {
        const handleStateChange = (e) => {
            const val = e.target.value;
            indiaState.filters.state = val;
            indiaState.filters.district = "";
            populateDistrictDropdown(val);

            // Sync with Explorer state filter
            const explorerStateFilter = document.getElementById("filter-district-state");
            if (explorerStateFilter) explorerStateFilter.value = val || "all";

            // Sync with GIS state filter
            const gisFilter = document.getElementById("gis-state-filter");
            if (gisFilter) gisFilter.value = val || "all";

            // Pan GIS map to state if selected
            if (val && indiaState.map) {
                const st = indiaState.statesData.find(s => s.state_ut === val);
                if (st) {
                    indiaState.map.flyTo([st.lat, st.lng], 6, { duration: 1.2 });
                }
            }
            applyAllFilters();
        };

        stateSelect.addEventListener("change", handleStateChange);
        stateSelect.addEventListener("input", handleStateChange);
    }

    // 3. District select
    const distSelect = document.getElementById("filter-district");
    if (distSelect) {
        const handleDistChange = (e) => {
            const val = e.target.value;
            indiaState.filters.district = val;
            if (val) {
                const distObj = indiaState.districtsData.find(d => d.district_name === val);
                if (distObj) {
                    indiaState.filters.state = distObj.state_ut;
                    if (stateSelect) stateSelect.value = distObj.state_ut;

                    const explorerStateFilter = document.getElementById("filter-district-state");
                    if (explorerStateFilter) explorerStateFilter.value = distObj.state_ut;

                    const gisFilter = document.getElementById("gis-state-filter");
                    if (gisFilter) gisFilter.value = distObj.state_ut;

                    if (indiaState.map) {
                        setGisLayer("districts");
                        indiaState.map.flyTo([distObj.lat, distObj.lng], 10, { duration: 1.2 });
                    }
                }
                // Automatically switch explorer view to districts when district selected
                switchToExplorerDistrictsView();
            }
            applyAllFilters();
        };

        distSelect.addEventListener("change", handleDistChange);
        distSelect.addEventListener("input", handleDistChange);
    }

    // 4. Active Filter Banner Actions
    const btnQuickClear = document.getElementById("btn-quick-clear-filter");
    if (btnQuickClear) {
        btnQuickClear.addEventListener("click", () => {
            clearStateAndDistrictFilters();
        });
    }

    const btnBannerDistricts = document.getElementById("btn-banner-view-districts");
    if (btnBannerDistricts) {
        btnBannerDistricts.addEventListener("click", () => {
            const tabExplorer = document.getElementById("tab-explorer");
            if (tabExplorer) tabExplorer.click();
            switchToExplorerDistrictsView();
            applyAllFilters();
        });
    }

    const btnBannerMap = document.getElementById("btn-banner-view-map");
    if (btnBannerMap) {
        btnBannerMap.addEventListener("click", () => {
            const tabGis = document.getElementById("tab-gis");
            if (tabGis) tabGis.click();
            if (indiaState.filters.district) {
                const dist = indiaState.districtsData.find(d => d.district_name === indiaState.filters.district);
                if (dist) locateEntityOnMap(dist, "district");
            } else if (indiaState.filters.state) {
                const st = indiaState.statesData.find(s => s.state_ut === indiaState.filters.state);
                if (st) locateEntityOnMap(st, "state");
            }
        });
    }

    // 5. Crime Class Toggle (All | Violent | Property)
    setupToggleGroup("toggle-violence", (val) => {
        indiaState.filters.violence = val;
        applyAllFilters();
    });

    // 6. Arrest Status Toggle (All | Arrested | Unsolved)
    setupToggleGroup("toggle-arrest", (val) => {
        indiaState.filters.arrest = val;
        applyAllFilters();
    });

    // 7. Domestic Flag Toggle (All | Domestic | Public)
    setupToggleGroup("toggle-domestic", (val) => {
        indiaState.filters.domestic = val;
        applyAllFilters();
    });

    // 8. Search Input with live debounce and autocomplete
    const searchInput = document.getElementById("filter-search-input");
    const clearBtn = document.getElementById("btn-clear-search");
    const resultsContainer = document.getElementById("search-dropdown-results");
    let debounceTimer = null;

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.trim();
            indiaState.filters.search = query;
            if (clearBtn) clearBtn.style.display = query ? "block" : "none";

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                applyAllFilters();
                if (query.length >= 2 && resultsContainer) {
                    fetchSearchResults(query);
                } else if (resultsContainer) {
                    resultsContainer.style.display = "none";
                }
            }, 220);
        });

        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && resultsContainer) {
                resultsContainer.style.display = "none";
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
                indiaState.filters.search = "";
            }
            clearBtn.style.display = "none";
            if (resultsContainer) {
                resultsContainer.style.display = "none";
                resultsContainer.innerHTML = "";
            }
            applyAllFilters();
        });
    }

    // Close autocomplete on click outside
    document.addEventListener("click", (e) => {
        if (!e.target.closest("#india-search-wrapper") && resultsContainer) {
            resultsContainer.style.display = "none";
        }
    });

    // 9. Reset Filters Button
    const btnReset = document.getElementById("btn-reset-filters");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            indiaState.filters = {
                category: "",
                state: "",
                district: "",
                violence: "",
                arrest: "",
                domestic: "",
                search: "",
                date: new Date().toISOString().split("T")[0],
                preset: "live",
                year: null
            };
            if (catSelect) catSelect.value = "";
            if (stateSelect) stateSelect.value = "";
            populateDistrictDropdown("");
            if (distSelect) distSelect.value = "";
            if (searchInput) searchInput.value = "";
            if (clearBtn) clearBtn.style.display = "none";
            if (resultsContainer) {
                resultsContainer.style.display = "none";
                resultsContainer.innerHTML = "";
            }

            const todayStr = new Date().toISOString().split("T")[0];
            const dateInputReset = document.getElementById("filter-india-date");
            const presetSelectReset = document.getElementById("filter-india-preset");
            if (dateInputReset) dateInputReset.value = todayStr;
            if (presetSelectReset) presetSelectReset.value = "live";

            const explorerStateFilter = document.getElementById("filter-district-state");
            if (explorerStateFilter) explorerStateFilter.value = "all";

            const gisFilter = document.getElementById("gis-state-filter");
            if (gisFilter) gisFilter.value = "all";

            resetToggleButtons("toggle-violence");
            resetToggleButtons("toggle-arrest");
            resetToggleButtons("toggle-domestic");

            if (indiaState.map) {
                indiaState.map.flyTo([22.8, 80.0], 5, { duration: 1.0 });
            }
            loadAllIndiaData();
            applyAllFilters();
        });
    }
}

function clearStateAndDistrictFilters() {
    indiaState.filters.state = "";
    indiaState.filters.district = "";
    const stateSelect = document.getElementById("filter-state");
    if (stateSelect) stateSelect.value = "";
    populateDistrictDropdown("");
    const distSelect = document.getElementById("filter-district");
    if (distSelect) distSelect.value = "";

    const explorerStateFilter = document.getElementById("filter-district-state");
    if (explorerStateFilter) explorerStateFilter.value = "all";

    const gisFilter = document.getElementById("gis-state-filter");
    if (gisFilter) gisFilter.value = "all";

    applyAllFilters();
}

function setupToggleGroup(groupId, callback) {
    const container = document.getElementById(groupId);
    if (!container) return;
    const buttons = container.querySelectorAll(".btn-toggle");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            callback(btn.getAttribute("data-val") || "");
        });
    });
}

function resetToggleButtons(groupId) {
    const container = document.getElementById(groupId);
    if (!container) return;
    const buttons = container.querySelectorAll(".btn-toggle");
    buttons.forEach((btn, idx) => {
        if (idx === 0) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}

function populateDistrictDropdown(selectedState = "") {
    const districtSelect = document.getElementById("filter-district");
    if (!districtSelect) return;

    const currentDistVal = indiaState.filters.district || districtSelect.value;

    let list = indiaState.districtsData || [];
    if (list.length === 0) {
        // Fallback to static options in DOM before network fetch completes
        const allOpts = Array.from(districtSelect.querySelectorAll("option[data-state]"));
        if (allOpts.length > 0) {
            allOpts.forEach(opt => {
                const optState = opt.getAttribute("data-state");
                opt.style.display = (!selectedState || optState === selectedState) ? "" : "none";
            });
            const firstOpt = districtSelect.querySelector("option:first-child");
            if (firstOpt) {
                firstOpt.textContent = `All ${selectedState ? selectedState + " Districts" : "780+ Districts"}`;
            }
            return;
        }
    }

    if (selectedState) {
        list = list.filter(d => d.state_ut === selectedState);
    }

    districtSelect.innerHTML = `<option value="">All ${selectedState ? selectedState + " Districts (" + list.length + ")" : "780+ Districts"}</option>`;

    const sorted = [...list].sort((a, b) => a.district_name.localeCompare(b.district_name));
    sorted.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.district_name;
        opt.textContent = `${d.district_name} (${d.state_ut})`;
        opt.setAttribute("data-state", d.state_ut);
        if (currentDistVal === d.district_name) {
            opt.selected = true;
        }
        districtSelect.appendChild(opt);
    });

    if (currentDistVal && !sorted.some(d => d.district_name === currentDistVal)) {
        districtSelect.value = "";
        indiaState.filters.district = "";
    }
}

async function fetchSearchResults(query) {
    try {
        const res = await fetch(`/api/india/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        renderGlobalSearchResults(data, query);
    } catch (err) {
        console.error("Search error:", err);
    }
}

/**
 * Render Autocomplete Dropdown Search Results
 */
function renderGlobalSearchResults(data, query) {
    const resultsContainer = document.getElementById("search-dropdown-results");
    if (!resultsContainer) return;

    const { states, districts, total_matches } = data;

    if (total_matches === 0) {
        resultsContainer.innerHTML = `
            <div class="search-result-item" style="color: var(--text-muted); cursor: default;">
                <span>No matching states or districts found for "<strong>${escapeHtml(query)}</strong>"</span>
            </div>
        `;
        resultsContainer.style.display = "block";
        return;
    }

    let html = "";

    // States Section
    if (states && states.length > 0) {
        html += `<div class="dropdown-section-title">States & Union Territories (${states.length})</div>`;
        states.forEach(st => {
            html += `
                <div class="search-result-item" data-type="state" data-name="${st.state_ut}">
                    <div class="search-result-info">
                        <span class="search-result-name">🇮🇳 ${st.state_ut}</span>
                        <span class="search-result-sub">Capital: ${st.capital} // ${st.zone} Zone</span>
                    </div>
                    <div class="search-result-badge-col">
                        <span class="font-mono text-sky" style="font-size: 0.78rem;">${st.ipc_crimes.toLocaleString()} crimes</span>
                        <span class="badge-pill badge-${st.badge_class}" style="font-size: 0.7rem;">${st.risk_tier}</span>
                    </div>
                </div>
            `;
        });
    }

    // Districts Section
    if (districts && districts.length > 0) {
        html += `<div class="dropdown-section-title">Districts & Police Commissionerates (${districts.length})</div>`;
        districts.forEach(d => {
            const commPill = d.is_commissionerate ? `<span class="badge-comm">POLICE COMM.</span>` : "";
            html += `
                <div class="search-result-item" data-type="district" data-name="${d.district_name}">
                    <div class="search-result-info">
                        <span class="search-result-name">🏛️ ${d.district_name} ${commPill}</span>
                        <span class="search-result-sub">State: ${d.state_ut} // HQ: ${d.headquarters}</span>
                    </div>
                    <div class="search-result-badge-col">
                        <span class="font-mono text-sky" style="font-size: 0.78rem;">${d.ipc_crimes.toLocaleString()} IPC</span>
                        <span class="badge-pill badge-${d.badge_class}" style="font-size: 0.7rem;">${d.risk_tier}</span>
                    </div>
                </div>
            `;
        });
    }

    resultsContainer.innerHTML = html;
    resultsContainer.style.display = "block";

    // Bind click handlers to items
    resultsContainer.querySelectorAll(".search-result-item").forEach(item => {
        item.addEventListener("click", () => {
            const type = item.getAttribute("data-type");
            const name = item.getAttribute("data-name");
            resultsContainer.style.display = "none";

            if (type === "state") {
                const stateObj = indiaState.statesData.find(s => s.state_ut === name);
                if (stateObj) {
                    showEntityModal(stateObj, "state");
                    indiaState.filters.state = name;
                    const stSelect = document.getElementById("filter-state");
                    if (stSelect) stSelect.value = name;
                    populateDistrictDropdown(name);
                    applyAllFilters();
                }
            } else if (type === "district") {
                const distObj = indiaState.districtsData.find(d => d.district_name === name);
                if (distObj) {
                    showEntityModal(distObj, "district");
                    indiaState.filters.district = name;
                    indiaState.filters.state = distObj.state_ut;
                    const stSelect = document.getElementById("filter-state");
                    if (stSelect) stSelect.value = distObj.state_ut;
                    populateDistrictDropdown(distObj.state_ut);
                    const distSelect = document.getElementById("filter-district");
                    if (distSelect) distSelect.value = name;
                    applyAllFilters();
                }
            }
        });
    });
}

/**
 * Apply All Filters across Overview KPIs, GIS Map, Tables and Analytics
 */
function applyAllFilters() {
    const f = indiaState.filters;

    let filteredStates = [...indiaState.statesData];
    let filteredDistricts = [...indiaState.districtsData];

    // 1. State filter
    if (f.state) {
        filteredStates = filteredStates.filter(s => s.state_ut === f.state);
        filteredDistricts = filteredDistricts.filter(d => d.state_ut === f.state);
    }

    // 2. District filter
    if (f.district) {
        filteredDistricts = filteredDistricts.filter(d => d.district_name === f.district);
        if (filteredDistricts.length > 0) {
            filteredStates = filteredStates.filter(s => s.state_ut === filteredDistricts[0].state_ut);
        }
    }

    // 3. Search query filter
    if (f.search) {
        const q = f.search.toLowerCase().trim();
        filteredStates = filteredStates.filter(s =>
            s.state_ut.toLowerCase().includes(q) ||
            s.capital.toLowerCase().includes(q) ||
            s.zone.toLowerCase().includes(q) ||
            (s.risk_tier && s.risk_tier.toLowerCase().includes(q))
        );
        filteredDistricts = filteredDistricts.filter(d =>
            d.district_name.toLowerCase().includes(q) ||
            d.state_ut.toLowerCase().includes(q) ||
            d.headquarters.toLowerCase().includes(q) ||
            d.zone.toLowerCase().includes(q) ||
            (d.risk_tier && d.risk_tier.toLowerCase().includes(q))
        );

        // If search matches districts but not states (e.g. searching "Lucknow", "Pune", "Thane")
        // automatically switch Explorer to Districts view so the user sees results
        if (filteredStates.length === 0 && filteredDistricts.length > 0) {
            switchToExplorerDistrictsView();
        }
    }

    // 4. Crime Class (Violent vs Property)
    if (f.violence === "violent") {
        filteredDistricts = filteredDistricts.filter(d => (d.violent_crimes / (d.ipc_crimes || 1)) >= 0.09);
        filteredStates = filteredStates.filter(s => (s.violent_crimes / (s.ipc_crimes || 1)) >= 0.08);
    } else if (f.violence === "property") {
        filteredDistricts = filteredDistricts.filter(d => (d.violent_crimes / (d.ipc_crimes || 1)) < 0.09);
        filteredStates = filteredStates.filter(s => (s.violent_crimes / (s.ipc_crimes || 1)) < 0.08);
    }

    // 5. Arrest Status (Chargesheet Clearance >= 75%)
    if (f.arrest === "arrested") {
        filteredDistricts = filteredDistricts.filter(d => d.chargesheet_rate >= 75.0);
        filteredStates = filteredStates.filter(s => s.chargesheet_rate >= 75.0);
    } else if (f.arrest === "unsolved") {
        filteredDistricts = filteredDistricts.filter(d => d.chargesheet_rate < 75.0);
        filteredStates = filteredStates.filter(s => s.chargesheet_rate < 75.0);
    }

    // 6. Domestic Flag
    if (f.domestic === "domestic") {
        filteredDistricts = filteredDistricts.filter(d => (d.crimes_against_women / (d.ipc_crimes || 1)) >= 0.09);
        filteredStates = filteredStates.filter(s => (s.crimes_against_women / (s.ipc_crimes || 1)) >= 0.08);
    } else if (f.domestic === "public") {
        filteredDistricts = filteredDistricts.filter(d => (d.crimes_against_women / (d.ipc_crimes || 1)) < 0.09);
        filteredStates = filteredStates.filter(s => (s.crimes_against_women / (s.ipc_crimes || 1)) < 0.08);
    }

    // 7. Offense Category emphasis / sort
    if (f.category === "violent") {
        filteredDistricts.sort((a, b) => b.violent_crimes - a.violent_crimes);
        filteredStates.sort((a, b) => b.violent_crimes - a.violent_crimes);
    } else if (f.category === "women") {
        filteredDistricts.sort((a, b) => b.crimes_against_women - a.crimes_against_women);
        filteredStates.sort((a, b) => b.crimes_against_women - a.crimes_against_women);
    } else if (f.category === "cyber") {
        filteredDistricts.sort((a, b) => b.cyber_crimes - a.cyber_crimes);
        filteredStates.sort((a, b) => b.cyber_crimes - a.cyber_crimes);
    } else if (f.category === "property") {
        filteredDistricts.sort((a, b) => (b.ipc_crimes - b.violent_crimes) - (a.ipc_crimes - a.violent_crimes));
        filteredStates.sort((a, b) => (b.ipc_crimes - b.violent_crimes) - (a.ipc_crimes - a.violent_crimes));
    }

    // Update Overview KPIs
    updateOverviewKpis(filteredStates, filteredDistricts);

    // Update Active Filter Banner
    updateFilterBanner(filteredStates, filteredDistricts);

    // Update Dynamic Charts for State / District selection
    updateDynamicCharts(filteredStates, filteredDistricts);

    // Update Overview Districts Table
    renderOverviewDistrictsTable(filteredDistricts);

    // Update Explorer Tables
    renderExplorerTable(filteredStates);
    renderExplorerDistrictsTable(filteredDistricts);

    const countEl = document.getElementById("india-explorer-count");
    if (countEl) {
        if (indiaState.currentExplorerView === "districts") {
            countEl.textContent = `${filteredDistricts.length} Districts cataloged ${f.state ? 'in ' + f.state : ''}`;
        } else {
            countEl.textContent = `${filteredStates.length} States & UTs cataloged`;
        }
    }

    // Update Safety Tables
    renderSafetyTable(filteredStates);
    renderDistrictSafetyTable(filteredDistricts);

    // Update GIS Chips
    renderGisChips(indiaState.currentGisLayer === "districts" ? filteredDistricts : filteredStates, indiaState.currentGisLayer === "districts");

    // Update Map Markers
    // Save active filtered subsets
    indiaState.filteredStates = filteredStates;
    indiaState.filteredDistricts = filteredDistricts;

    renderMapMarkers(filteredStates, filteredDistricts);

    // Synchronize Live Real-Time Incident Stream with selected state/district
    loadRealtimeData(false);
}

/**
 * Safely Set Text Content on an Element by ID
 */
function setKpiText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

/**
 * Update the Top Hotspot District KPI Card
 */
/**
 * Update the Top Hotspot District KPI Card & State Hotspots Showcase Strip
 */
function updateHotspotDistrictKpi(candidateDistricts) {
    const elDistrict = document.getElementById("kpi-india-hotspot");
    const elDetail = document.getElementById("kpi-india-hotspot-detail");
    const elLabel = document.getElementById("kpi-india-hotspot-label");
    const elBadge = document.getElementById("kpi-hotspot-rank-badge");
    const elCounter = document.getElementById("hotspot-nav-counter");
    if (!elDistrict) return;

    const f = indiaState.filters;
    const allDistricts = indiaState.districtsData || [];

    let activeScope = "national"; // "national" | "state" | "district"
    let targetState = "";
    let activeDistrictObj = null;
    let activeDistrictRank = null;
    let relevantDistricts = [];

    // Check if an explicit district is filtered OR search matched a single district
    if (f.district) {
        activeDistrictObj = allDistricts.find(d => d.district_name === f.district);
        if (activeDistrictObj) {
            activeScope = "district";
            targetState = activeDistrictObj.state_ut;
        }
    } else if (f.search && candidateDistricts && candidateDistricts.length === 1) {
        activeDistrictObj = candidateDistricts[0];
        activeScope = "district";
        targetState = activeDistrictObj.state_ut;
    } else if (f.state) {
        activeScope = "state";
        targetState = f.state;
    } else if (candidateDistricts && candidateDistricts.length > 0 && candidateDistricts.length < allDistricts.length) {
        const uniqueStates = [...new Set(candidateDistricts.map(d => d.state_ut))];
        if (uniqueStates.length === 1) {
            activeScope = "state";
            targetState = uniqueStates[0];
        } else {
            activeScope = "filtered";
        }
    }

    if (activeScope === "district" && activeDistrictObj) {
        // True state comparison: find all districts in this district's state
        const stateDists = allDistricts.filter(d => d.state_ut === targetState);
        const sortedInState = [...stateDists].sort((a, b) => (b.ipc_crimes || 0) - (a.ipc_crimes || 0));
        activeDistrictRank = sortedInState.findIndex(d => d.district_name === activeDistrictObj.district_name) + 1;
        relevantDistricts = sortedInState;
        indiaState.currentHotspotsList = sortedInState.slice(0, 5);
        indiaState.activeSelectedDistrictRank = activeDistrictRank;

        const isTopHotspot = activeDistrictRank === 1;
        const topHotspot = sortedInState[0] || activeDistrictObj;

        if (isTopHotspot) {
            if (elLabel) elLabel.textContent = `CRITICAL HOTSPOT (${targetState.toUpperCase()})`;
            elDistrict.textContent = activeDistrictObj.district_name;
            if (elDetail) elDetail.textContent = `${targetState} (${(activeDistrictObj.ipc_crimes || 0).toLocaleString()} incidents) • #1 of ${stateDists.length} in State`;
            if (elBadge) {
                elBadge.className = "badge-pill badge-danger";
                elBadge.textContent = `🔥 #1 STATE HOTSPOT`;
            }
        } else {
            // District is NOT #1 Hotspot (e.g. East Kameng: 141 incidents vs Itanagar: 386 incidents)
            if (elLabel) elLabel.textContent = `STATE PEAK HOTSPOT // ${targetState.toUpperCase()}`;
            elDistrict.textContent = topHotspot.district_name;
            const ratio = ((topHotspot.ipc_crimes || 1) / (activeDistrictObj.ipc_crimes || 1)).toFixed(1);
            if (elDetail) {
                elDetail.textContent = `${(topHotspot.ipc_crimes || 0).toLocaleString()} cases (${ratio}x vs Active ${activeDistrictObj.district_name}: ${(activeDistrictObj.ipc_crimes || 0).toLocaleString()})`;
            }
            if (elBadge) {
                elBadge.className = "badge-pill badge-warning";
                elBadge.textContent = `ACTIVE: #${activeDistrictRank} OF ${stateDists.length}`;
            }
        }

        if (elCounter) elCounter.textContent = `1/${indiaState.currentHotspotsList.length || 1}`;
        indiaState.currentHotspotIndex = 0;

    } else if (activeScope === "state") {
        const stateDists = allDistricts.filter(d => d.state_ut === targetState);
        const sortedInState = (stateDists.length > 0 ? stateDists : candidateDistricts).sort((a, b) => (b.ipc_crimes || 0) - (a.ipc_crimes || 0));
        relevantDistricts = sortedInState;
        indiaState.currentHotspotsList = sortedInState.slice(0, 5);
        indiaState.currentHotspotIndex = 0;

        const topHotspot = sortedInState[0] || { district_name: targetState, state_ut: targetState, ipc_crimes: 0 };
        if (elLabel) elLabel.textContent = `CRITICAL HOTSPOT (${targetState.toUpperCase()})`;
        elDistrict.textContent = topHotspot.district_name;
        if (elDetail) elDetail.textContent = `${targetState} (${(topHotspot.ipc_crimes || 0).toLocaleString()} incidents) • #1 of ${sortedInState.length} in State`;
        if (elBadge) {
            elBadge.className = "badge-pill badge-danger";
            elBadge.textContent = `🔥 #1 IN ${targetState.toUpperCase()}`;
        }
        if (elCounter) elCounter.textContent = `1/${indiaState.currentHotspotsList.length || 1}`;

    } else {
        // National Pan-India Scope
        const baseList = (candidateDistricts && candidateDistricts.length > 0) ? candidateDistricts : allDistricts;
        const sorted = [...baseList].sort((a, b) => (b.ipc_crimes || 0) - (a.ipc_crimes || 0));
        relevantDistricts = sorted;
        indiaState.currentHotspotsList = sorted.slice(0, 5);
        indiaState.currentHotspotIndex = 0;

        const topHotspot = sorted[0] || { district_name: "Malappuram", state_ut: "Kerala", ipc_crimes: 69340 };
        if (elLabel) elLabel.textContent = `NATIONAL CRITICAL HOTSPOT`;
        elDistrict.textContent = topHotspot.district_name;
        if (elDetail) elDetail.textContent = `${topHotspot.state_ut} (${(topHotspot.ipc_crimes || 0).toLocaleString()} incidents) • #1 of ${allDistricts.length} in India`;
        if (elBadge) {
            elBadge.className = "badge-pill badge-danger";
            elBadge.textContent = `🔥 #1 NATIONAL HOTSPOT`;
        }
        if (elCounter) elCounter.textContent = `1/${indiaState.currentHotspotsList.length || 1}`;
    }

    // Render the State Hotspots Showcase Grid
    renderStateHotspotsShowcase(indiaState.currentHotspotsList, activeDistrictObj, activeDistrictRank, targetState || "National");
}

/**
 * Cycle Hotspots Inside the 5th KPI Card
 */
function cycleHotspotKpi(direction) {
    const list = indiaState.currentHotspotsList || [];
    if (list.length <= 1) return;

    if (direction === "next") {
        indiaState.currentHotspotIndex = (indiaState.currentHotspotIndex + 1) % list.length;
    } else {
        indiaState.currentHotspotIndex = (indiaState.currentHotspotIndex - 1 + list.length) % list.length;
    }

    const item = list[indiaState.currentHotspotIndex];
    const elDistrict = document.getElementById("kpi-india-hotspot");
    const elDetail = document.getElementById("kpi-india-hotspot-detail");
    const elBadge = document.getElementById("kpi-hotspot-rank-badge");
    const elCounter = document.getElementById("hotspot-nav-counter");

    if (item && elDistrict) {
        elDistrict.textContent = item.district_name;
        if (elDetail) elDetail.textContent = `${item.state_ut} (${(item.ipc_crimes || 0).toLocaleString()} incidents)`;
        if (elBadge) {
            const rank = indiaState.currentHotspotIndex + 1;
            elBadge.className = rank === 1 ? "badge-pill badge-danger" : (rank <= 3 ? "badge-pill badge-warning" : "badge-pill badge-info");
            elBadge.textContent = `RANK #${rank} HOTSPOT`;
        }
        if (elCounter) {
            elCounter.textContent = `${indiaState.currentHotspotIndex + 1}/${list.length}`;
        }
    }
}

/**
 * Render State & National Critical Hotspots Showcase Grid
 */
function renderStateHotspotsShowcase(hotspots, activeDistrictObj, activeDistrictRank, scopeName) {
    const showcaseCard = document.getElementById("card-state-hotspots-showcase");
    const grid = document.getElementById("state-hotspots-grid");
    const titleEl = document.getElementById("title-state-hotspots");
    const subtitleEl = document.getElementById("subtitle-state-hotspots");
    const countBadge = document.getElementById("badge-hotspots-count");

    if (!showcaseCard || !grid) return;

    if (!hotspots || hotspots.length === 0) {
        showcaseCard.style.display = "none";
        return;
    }

    showcaseCard.style.display = "block";

    const isState = scopeName && scopeName !== "National";
    if (titleEl) {
        titleEl.textContent = isState 
            ? `Critical Hotspot Districts in ${scopeName}` 
            : `National Critical Hotspot Jurisdictions (Pan-India)`;
    }
    if (subtitleEl) {
        subtitleEl.textContent = isState
            ? `Top incident density jurisdictions ranked in ${scopeName} by total IPC volume and violent threat`
            : `Top 5 high-incident density districts & commissionerates requiring active tactical surveillance across India`;
    }
    if (countBadge) {
        countBadge.textContent = `Top ${hotspots.length} Priority Jurisdictions`;
    }

    let cardsHtml = "";

    // 1. Render Top Hotspots (up to 5)
    hotspots.forEach((d, idx) => {
        const rank = idx + 1;
        const isSelected = activeDistrictObj && activeDistrictObj.district_name === d.district_name;
        const rankClass = rank === 1 ? "rank-1" : (rank <= 3 ? "rank-2-3" : "rank-4-5");
        const badgeLabel = rank === 1 ? "🔥 #1 CRITICAL HOTSPOT" : `#${rank} HIGH PRIORITY`;
        const commBadge = d.is_commissionerate ? `<span class="badge-comm" style="font-size: 0.65rem;">COMMISSIONERATE</span>` : "";
        const violentPct = ((d.violent_crimes / (d.ipc_crimes || 1)) * 100).toFixed(1);

        cardsHtml += `
            <div class="state-hotspot-card ${rank === 1 ? 'rank-1' : ''} ${isSelected ? 'active-selected' : ''}" data-district="${escapeHtml(d.district_name)}">
                <div>
                    <div class="state-hotspot-header">
                        <span class="state-hotspot-rank-badge ${rankClass}">${badgeLabel}</span>
                        ${isSelected ? '<span class="badge-pill badge-primary" style="font-size: 0.65rem;">ACTIVE SELECTION</span>' : ''}
                    </div>
                    <div class="state-hotspot-name">${escapeHtml(d.district_name)} ${commBadge}</div>
                    <div class="state-hotspot-sub">State: ${escapeHtml(d.state_ut)} // HQ: ${escapeHtml(d.headquarters || d.district_name)}</div>
                    
                    <div class="state-hotspot-metrics">
                        <div class="state-hotspot-m-item">
                            <span class="state-hotspot-m-label">Total IPC Crimes</span>
                            <span class="state-hotspot-m-val text-amber">${(d.ipc_crimes || 0).toLocaleString()}</span>
                        </div>
                        <div class="state-hotspot-m-item">
                            <span class="state-hotspot-m-label">Violent Offenses</span>
                            <span class="state-hotspot-m-val text-danger">${(d.violent_crimes || 0).toLocaleString()} (${violentPct}%)</span>
                        </div>
                        <div class="state-hotspot-m-item">
                            <span class="state-hotspot-m-label">Crime Rate (/1L)</span>
                            <span class="state-hotspot-m-val text-sky">${d.crime_rate_per_lakh || '--'}</span>
                        </div>
                        <div class="state-hotspot-m-item">
                            <span class="state-hotspot-m-label">Chargesheet Rate</span>
                            <span class="state-hotspot-m-val text-emerald">${d.chargesheet_rate || '--'}%</span>
                        </div>
                    </div>
                </div>

                <div class="state-hotspot-actions">
                    <button type="button" class="btn btn-outline btn-sm btn-hotspot-gis" data-district="${escapeHtml(d.district_name)}" title="Focus on GIS map">
                        🗺️ Map
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm btn-hotspot-dossier" data-district="${escapeHtml(d.district_name)}" title="Open intelligence dossier">
                        📋 Dossier
                    </button>
                </div>
            </div>
        `;
    });

    // 2. If user has an active district selected that is NOT in the top 5 (e.g. East Kameng rank #11):
    // Render a special comparison card for the user's selected district!
    if (activeDistrictObj && activeDistrictRank && activeDistrictRank > hotspots.length) {
        const d = activeDistrictObj;
        const topHotspot = hotspots[0];
        const violentPct = ((d.violent_crimes / (d.ipc_crimes || 1)) * 100).toFixed(1);
        const lowerPct = topHotspot && topHotspot.ipc_crimes > 0 
            ? Math.round((1 - (d.ipc_crimes / topHotspot.ipc_crimes)) * 100)
            : 0;

        cardsHtml += `
            <div class="state-hotspot-card active-selected" data-district="${escapeHtml(d.district_name)}">
                <div>
                    <div class="state-hotspot-header">
                        <span class="state-hotspot-rank-badge rank-user">RANK #${activeDistrictRank} IN ${scopeName.toUpperCase()}</span>
                        <span class="badge-pill badge-primary" style="font-size: 0.65rem;">YOUR ACTIVE SEARCH</span>
                    </div>
                    <div class="state-hotspot-name">${escapeHtml(d.district_name)}</div>
                    <div class="state-hotspot-sub">State: ${escapeHtml(d.state_ut)} // HQ: ${escapeHtml(d.headquarters || d.district_name)}</div>

                    <div class="state-hotspot-comparison-callout">
                        ℹ️ <strong>${escapeHtml(d.district_name)}</strong> is <strong>${lowerPct}% lower</strong> in incident volume than ${scopeName}'s #1 Hotspot (<em>${escapeHtml(topHotspot ? topHotspot.district_name : 'Peak')}</em>).
                    </div>
                    
                    <div class="state-hotspot-metrics">
                        <div class="state-hotspot-m-item">
                            <span class="state-hotspot-m-label">Total IPC Crimes</span>
                            <span class="state-hotspot-m-val text-sky">${(d.ipc_crimes || 0).toLocaleString()}</span>
                        </div>
                        <div class="state-hotspot-m-item">
                            <span class="state-hotspot-m-label">Violent Offenses</span>
                            <span class="state-hotspot-m-val text-muted">${(d.violent_crimes || 0).toLocaleString()} (${violentPct}%)</span>
                        </div>
                        <div class="state-hotspot-m-item">
                            <span class="state-hotspot-m-label">Crime Rate (/1L)</span>
                            <span class="state-hotspot-m-val text-sky">${d.crime_rate_per_lakh || '--'}</span>
                        </div>
                        <div class="state-hotspot-m-item">
                            <span class="state-hotspot-m-label">Chargesheet Rate</span>
                            <span class="state-hotspot-m-val text-emerald">${d.chargesheet_rate || '--'}%</span>
                        </div>
                    </div>
                </div>

                <div class="state-hotspot-actions">
                    <button type="button" class="btn btn-outline btn-sm btn-hotspot-gis" data-district="${escapeHtml(d.district_name)}" title="Focus on GIS map">
                        🗺️ Map
                    </button>
                    <button type="button" class="btn btn-secondary btn-sm btn-hotspot-dossier" data-district="${escapeHtml(d.district_name)}" title="Open intelligence dossier">
                        📋 Dossier
                    </button>
                </div>
            </div>
        `;
    }

    grid.innerHTML = cardsHtml;

    // Bind event listeners to GIS and Dossier buttons on all rendered cards
    grid.querySelectorAll(".btn-hotspot-gis").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const distName = btn.getAttribute("data-district");
            const dist = indiaState.districtsData.find(d => d.district_name === distName);
            if (dist) {
                locateEntityOnMap(dist, "district");
                showSafetyToast(`📍 Plotted ${dist.district_name} on GIS Map`);
            }
        });
    });

    grid.querySelectorAll(".btn-hotspot-dossier").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const distName = btn.getAttribute("data-district");
            const dist = indiaState.districtsData.find(d => d.district_name === distName);
            if (dist) {
                showEntityModal(dist, "district");
            }
        });
    });

    // Make cards clickable to select the district
    grid.querySelectorAll(".state-hotspot-card").forEach(card => {
        card.addEventListener("click", () => {
            const distName = card.getAttribute("data-district");
            const dist = indiaState.districtsData.find(d => d.district_name === distName);
            if (dist) {
                indiaState.filters.district = dist.district_name;
                indiaState.filters.state = dist.state_ut;
                const stateSelect = document.getElementById("filter-state");
                const distSelect = document.getElementById("filter-district");
                if (stateSelect) stateSelect.value = dist.state_ut;
                populateDistrictDropdown(dist.state_ut);
                if (distSelect) distSelect.value = dist.district_name;
                applyAllFilters();
                showSafetyToast(`🏛️ Selected: ${dist.district_name}, ${dist.state_ut}`);
            }
        });
    });
}

/**
 * Update Active Filter Glowing Highlight on KPI Cards
 */
function updateKpiActiveFilterStates() {
    const f = indiaState.filters;
    const cardTotal = document.getElementById("kpi-india-total-card");
    const cardViolent = document.getElementById("kpi-india-violent-card");
    const cardArrest = document.getElementById("kpi-india-arrest-card");
    const cardDomestic = document.getElementById("kpi-india-domestic-card");
    const cardDistrict = document.getElementById("kpi-india-district-card");

    if (cardViolent) {
        if (f.violence === "violent") cardViolent.classList.add("kpi-active-filter");
        else cardViolent.classList.remove("kpi-active-filter");
    }
    if (cardArrest) {
        if (f.arrest === "arrested") cardArrest.classList.add("kpi-active-filter");
        else cardArrest.classList.remove("kpi-active-filter");
    }
    if (cardDomestic) {
        if (f.domestic === "domestic") cardDomestic.classList.add("kpi-active-filter");
        else cardDomestic.classList.remove("kpi-active-filter");
    }
    if (cardDistrict) {
        if (f.district) cardDistrict.classList.add("kpi-active-filter");
        else cardDistrict.classList.remove("kpi-active-filter");
    }
    if (cardTotal) {
        const hasFilters = f.state || f.district || f.violence || f.arrest || f.domestic || f.search;
        if (!hasFilters) cardTotal.classList.add("kpi-active-filter");
        else cardTotal.classList.remove("kpi-active-filter");
    }
}

/**
 * Setup Click Actions for the 5 Iconic KPI Cards to Make Them Fully Working
 */
function setupKpiInteractions() {
    const cardTotal = document.getElementById("kpi-india-total-card");
    const cardViolent = document.getElementById("kpi-india-violent-card");
    const cardArrest = document.getElementById("kpi-india-arrest-card");
    const cardDomestic = document.getElementById("kpi-india-domestic-card");
    const cardDistrict = document.getElementById("kpi-india-district-card");

    // 1. Total Incidents Card -> Click to reset all filters to national view
    if (cardTotal) {
        cardTotal.addEventListener("click", () => {
            const btnReset = document.getElementById("btn-reset-filters");
            if (btnReset) {
                btnReset.click();
            } else {
                indiaState.filters = { state: "", district: "", violence: "", arrest: "", domestic: "", category: "", search: "" };
                applyAllFilters();
            }
            showSafetyToast("🔄 Reset: Viewing All National Incidents (Pan-India)");
        });
        cardTotal.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                cardTotal.click();
            }
        });
    }

    // 2. Violent Crimes Card -> Click to toggle violent offenses filter
    if (cardViolent) {
        cardViolent.addEventListener("click", () => {
            const isViolent = indiaState.filters.violence === "violent";
            const newVal = isViolent ? "" : "violent";
            indiaState.filters.violence = newVal;

            // Sync toggle button group in filter strip
            const container = document.getElementById("toggle-violence");
            if (container) {
                const btns = container.querySelectorAll(".btn-toggle");
                btns.forEach(b => {
                    if (b.getAttribute("data-val") === newVal) b.classList.add("active");
                    else b.classList.remove("active");
                });
            }

            applyAllFilters();

            if (newVal === "violent") {
                showSafetyToast("🚨 Filtered: Violent Crimes Priority (Murder, Assault, Robbery)");
            } else {
                showSafetyToast("Showing All Crime Classes");
            }
        });
        cardViolent.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                cardViolent.click();
            }
        });
    }

    // 3. Arrest Clearance Rate Card -> Click to toggle high clearance jurisdictions
    if (cardArrest) {
        cardArrest.addEventListener("click", () => {
            const isArrested = indiaState.filters.arrest === "arrested";
            const newVal = isArrested ? "" : "arrested";
            indiaState.filters.arrest = newVal;

            // Sync toggle button group in filter strip
            const container = document.getElementById("toggle-arrest");
            if (container) {
                const btns = container.querySelectorAll(".btn-toggle");
                btns.forEach(b => {
                    if (b.getAttribute("data-val") === newVal) b.classList.add("active");
                    else b.classList.remove("active");
                });
            }

            applyAllFilters();

            if (newVal === "arrested") {
                showSafetyToast("⚖️ Filtered: High Clearance Jurisdictions (>= 75% Chargesheet Rate)");
            } else {
                showSafetyToast("Showing All Clearance Rates");
            }
        });
        cardArrest.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                cardArrest.click();
            }
        });
    }

    // 4. Domestic Incidents Card -> Click to toggle domestic disputes / women safety filter
    if (cardDomestic) {
        cardDomestic.addEventListener("click", () => {
            const isDomestic = indiaState.filters.domestic === "domestic";
            const newVal = isDomestic ? "" : "domestic";
            indiaState.filters.domestic = newVal;

            // Sync toggle button group in filter strip
            const container = document.getElementById("toggle-domestic");
            if (container) {
                const btns = container.querySelectorAll(".btn-toggle");
                btns.forEach(b => {
                    if (b.getAttribute("data-val") === newVal) b.classList.add("active");
                    else b.classList.remove("active");
                });
            }

            applyAllFilters();

            if (newVal === "domestic") {
                showSafetyToast("🛡️ Filtered: Domestic Disputes & Crimes Against Women");
            } else {
                showSafetyToast("Showing All Incident Categories");
            }
        });
        cardDomestic.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                cardDomestic.click();
            }
        });
    }

    // 5. Critical Hotspot District Card -> Cycler, Showcase Scroll & Dossier
    const btnPrev = document.getElementById("btn-hotspot-prev");
    const btnNext = document.getElementById("btn-hotspot-next");
    const viewAllLink = document.getElementById("kpi-hotspot-view-all-link");
    const btnShowcaseGis = document.getElementById("btn-showcase-gis-layer");

    if (btnPrev) {
        btnPrev.addEventListener("click", (e) => {
            e.stopPropagation();
            cycleHotspotKpi("prev");
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", (e) => {
            e.stopPropagation();
            cycleHotspotKpi("next");
        });
    }

    if (viewAllLink) {
        viewAllLink.addEventListener("click", (e) => {
            e.stopPropagation();
            const showcase = document.getElementById("card-state-hotspots-showcase");
            if (showcase) {
                showcase.scrollIntoView({ behavior: "smooth", block: "start" });
                showcase.classList.add("pulse-highlight");
                setTimeout(() => showcase.classList.remove("pulse-highlight"), 1200);
            }
        });
    }

    if (btnShowcaseGis) {
        btnShowcaseGis.addEventListener("click", () => {
            const tab = document.querySelector('.nav-tab[data-view="view-india-gis"]');
            if (tab) tab.click();
            showSafetyToast("🗺️ Switched to GIS Heatmap // Viewing High-Priority Hotspot Jurisdictions");
        });
    }

    if (cardDistrict) {
        cardDistrict.addEventListener("click", (e) => {
            // If user clicked inside cycler buttons or view all link, ignore
            if (e.target.closest("#hotspot-kpi-cycler") || e.target.closest("#kpi-hotspot-view-all-link")) return;

            const showcase = document.getElementById("card-state-hotspots-showcase");
            if (showcase && showcase.style.display !== "none") {
                showcase.scrollIntoView({ behavior: "smooth", block: "start" });
                showcase.classList.add("pulse-highlight");
                setTimeout(() => showcase.classList.remove("pulse-highlight"), 1200);
            } else {
                let targetDist = null;
                if (indiaState.currentHotspotsList && indiaState.currentHotspotsList.length > 0) {
                    targetDist = indiaState.currentHotspotsList[indiaState.currentHotspotIndex || 0];
                }
                if (!targetDist && indiaState.filters.district) {
                    targetDist = indiaState.districtsData.find(d => d.district_name === indiaState.filters.district);
                }
                if (targetDist) {
                    showEntityModal(targetDist, "district");
                }
            }
        });
        cardDistrict.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                cardDistrict.click();
            }
        });
    }
}

/**
 * Dynamically Update Overview KPI Numbers across all 5 Iconic Cards
 */
function updateOverviewKpis(filteredStates, filteredDistricts) {
    const f = indiaState.filters;
    const elCsCount = document.getElementById("kpi-india-cs-count");
    const elDateSpan = document.getElementById("kpi-india-date-span");

    // 1. If a specific district is active
    if (f.district) {
        const dist = indiaState.districtsData.find(d => d.district_name === f.district);
        if (dist) {
            const csCount = dist.chargesheets_filed || Math.round((dist.ipc_crimes || 0) * (dist.chargesheet_rate || 0) / 100);
            const womenCases = dist.crimes_against_women || 0;
            const distIpc = dist.ipc_crimes || 1;
            const domRate = ((womenCases / distIpc) * 100).toFixed(1);
            const vRate = ((dist.violent_crimes / distIpc) * 100).toFixed(1);

            setKpiText("kpi-india-total", dist.ipc_crimes.toLocaleString());
            setKpiText("kpi-india-violent", dist.violent_crimes.toLocaleString());
            setKpiText("kpi-india-violent-rate", `${vRate}%`);
            setKpiText("kpi-india-arrest-rate", `${dist.chargesheet_rate}%`);
            if (elCsCount) elCsCount.textContent = `${csCount.toLocaleString()} arrests`;
            setKpiText("kpi-india-cs", `${dist.chargesheet_rate}% Rate`);
            setKpiText("kpi-india-domestic-rate", `${domRate}%`);
            setKpiText("kpi-india-domestic-count", `${womenCases.toLocaleString()} cases`);
            setKpiText("kpi-india-cyber", (dist.cyber_crimes || 0).toLocaleString());
            setKpiText("kpi-india-women", womenCases.toLocaleString());
            if (elDateSpan) elDateSpan.textContent = `Active District: ${dist.district_name}, ${dist.state_ut}`;

            updateHotspotDistrictKpi([dist]);
            updateKpiActiveFilterStates();
            return;
        }
    }

    // 2. If a specific state is active
    if (f.state && filteredStates.length === 1) {
        const st = filteredStates[0];
        const csCount = st.chargesheets_filed || Math.round((st.ipc_crimes || 0) * (st.chargesheet_rate || 0) / 100);
        const womenCases = st.crimes_against_women || 0;
        const stIpc = st.ipc_crimes || 1;
        const domRate = ((womenCases / stIpc) * 100).toFixed(1);
        const vRate = ((st.violent_crimes / stIpc) * 100).toFixed(1);

        setKpiText("kpi-india-total", st.ipc_crimes.toLocaleString());
        setKpiText("kpi-india-violent", st.violent_crimes.toLocaleString());
        setKpiText("kpi-india-violent-rate", `${vRate}%`);
        setKpiText("kpi-india-arrest-rate", `${st.chargesheet_rate}%`);
        if (elCsCount) elCsCount.textContent = `${csCount.toLocaleString()} arrests`;
        setKpiText("kpi-india-cs", `${st.chargesheet_rate}% Rate`);
        setKpiText("kpi-india-domestic-rate", `${domRate}%`);
        setKpiText("kpi-india-domestic-count", `${womenCases.toLocaleString()} cases`);
        setKpiText("kpi-india-cyber", (st.cyber_crimes || 0).toLocaleString());
        setKpiText("kpi-india-women", womenCases.toLocaleString());
        if (elDateSpan) elDateSpan.textContent = `Active State: ${st.state_ut} (${filteredDistricts.length} Districts)`;

        updateHotspotDistrictKpi(filteredDistricts);
        updateKpiActiveFilterStates();
        return;
    }

    // 3. If no filters active, restore official summaryData
    if (filteredStates.length === indiaState.statesData.length && !f.violence && !f.arrest && !f.domestic && !f.category && !f.search) {
        if (indiaState.summaryData) {
            const sum = indiaState.summaryData;
            const csCount = sum.national_chargesheets_filed || Math.round((sum.national_ipc_crimes || 0) * (sum.national_avg_chargesheet_rate || 0) / 100);
            const womenCases = sum.national_crimes_against_women || 0;
            const totalIpc = sum.national_ipc_crimes || 1;
            const domRate = ((womenCases / totalIpc) * 100).toFixed(1);

            setKpiText("kpi-india-total", sum.national_ipc_crimes.toLocaleString());
            setKpiText("kpi-india-violent", sum.national_violent_crimes.toLocaleString());
            setKpiText("kpi-india-violent-rate", `${sum.violent_crime_percentage}%`);
            setKpiText("kpi-india-arrest-rate", `${sum.national_avg_chargesheet_rate}%`);
            if (elCsCount) elCsCount.textContent = `${csCount.toLocaleString()} arrests`;
            setKpiText("kpi-india-cs", `${sum.national_avg_chargesheet_rate}% Rate`);
            setKpiText("kpi-india-domestic-rate", `${domRate}%`);
            setKpiText("kpi-india-domestic-count", `${womenCases.toLocaleString()} cases`);
            setKpiText("kpi-india-cyber", (sum.national_cyber_crimes || 0).toLocaleString());
            setKpiText("kpi-india-women", womenCases.toLocaleString());
            if (elDateSpan) {
                if (sum.selected_date) {
                    elDateSpan.textContent = `Active Range: ${sum.selected_date} (${sum.day_name || 'Live'})`;
                } else {
                    elDateSpan.textContent = `Active Range: ${sum.year || 2026} Calibrated`;
                }
            }

            updateHotspotDistrictKpi(indiaState.districtsData);
            updateKpiActiveFilterStates();
        }
        return;
    }

    // 4. Aggregates for filtered dataset
    if (filteredStates.length > 0) {
        const totalIpc = filteredStates.reduce((acc, s) => acc + (s.ipc_crimes || 0), 0);
        const totalViolent = filteredStates.reduce((acc, s) => acc + (s.violent_crimes || 0), 0);
        const totalCyber = filteredStates.reduce((acc, s) => acc + (s.cyber_crimes || 0), 0);
        const totalWomen = filteredStates.reduce((acc, s) => acc + (s.crimes_against_women || 0), 0);
        const totalCs = filteredStates.reduce((acc, s) => acc + (s.chargesheets_filed || Math.round((s.ipc_crimes || 0) * (s.chargesheet_rate || 0) / 100)), 0);
        const avgCs = (filteredStates.reduce((acc, s) => acc + (s.chargesheet_rate || 0), 0) / (filteredStates.length || 1)).toFixed(1);
        const vRate = totalIpc > 0 ? ((totalViolent / totalIpc) * 100).toFixed(1) : "0.0";
        const domRate = totalIpc > 0 ? ((totalWomen / totalIpc) * 100).toFixed(1) : "0.0";

        setKpiText("kpi-india-total", totalIpc.toLocaleString());
        setKpiText("kpi-india-violent", totalViolent.toLocaleString());
        setKpiText("kpi-india-violent-rate", `${vRate}%`);
        setKpiText("kpi-india-arrest-rate", `${avgCs}%`);
        if (elCsCount) elCsCount.textContent = `${totalCs.toLocaleString()} arrests`;
        setKpiText("kpi-india-cs", `${avgCs}% Rate`);
        setKpiText("kpi-india-domestic-rate", `${domRate}%`);
        setKpiText("kpi-india-domestic-count", `${totalWomen.toLocaleString()} cases`);
        setKpiText("kpi-india-cyber", totalCyber.toLocaleString());
        setKpiText("kpi-india-women", totalWomen.toLocaleString());
        if (elDateSpan) elDateSpan.textContent = `Filtered Scope: ${filteredStates.length} States, ${filteredDistricts.length} Districts`;

        updateHotspotDistrictKpi(filteredDistricts);
        updateKpiActiveFilterStates();
    } else if (filteredDistricts.length > 0) {
        // MATCHED DISTRICTS (e.g. searched for Lucknow, Pune, Thane)
        const totalIpc = filteredDistricts.reduce((acc, d) => acc + (d.ipc_crimes || 0), 0);
        const totalViolent = filteredDistricts.reduce((acc, d) => acc + (d.violent_crimes || 0), 0);
        const totalCyber = filteredDistricts.reduce((acc, d) => acc + (d.cyber_crimes || 0), 0);
        const totalWomen = filteredDistricts.reduce((acc, d) => acc + (d.crimes_against_women || 0), 0);
        const totalCs = filteredDistricts.reduce((acc, d) => acc + (d.chargesheets_filed || Math.round((d.ipc_crimes || 0) * (d.chargesheet_rate || 0) / 100)), 0);
        const avgCs = (filteredDistricts.reduce((acc, d) => acc + (d.chargesheet_rate || 0), 0) / (filteredDistricts.length || 1)).toFixed(1);
        const vRate = totalIpc > 0 ? ((totalViolent / totalIpc) * 100).toFixed(1) : "0.0";
        const domRate = totalIpc > 0 ? ((totalWomen / totalIpc) * 100).toFixed(1) : "0.0";

        setKpiText("kpi-india-total", totalIpc.toLocaleString());
        setKpiText("kpi-india-violent", totalViolent.toLocaleString());
        setKpiText("kpi-india-violent-rate", `${vRate}%`);
        setKpiText("kpi-india-arrest-rate", `${avgCs}%`);
        if (elCsCount) elCsCount.textContent = `${totalCs.toLocaleString()} arrests`;
        setKpiText("kpi-india-cs", `${avgCs}% Rate`);
        setKpiText("kpi-india-domestic-rate", `${domRate}%`);
        setKpiText("kpi-india-domestic-count", `${totalWomen.toLocaleString()} cases`);
        setKpiText("kpi-india-cyber", totalCyber.toLocaleString());
        setKpiText("kpi-india-women", totalWomen.toLocaleString());
        if (elDateSpan) elDateSpan.textContent = `Filtered Scope: ${filteredDistricts.length} Matching Districts`;

        updateHotspotDistrictKpi(filteredDistricts);
        updateKpiActiveFilterStates();
    } else {
        setKpiText("kpi-india-total", "0");
        setKpiText("kpi-india-violent", "0");
        setKpiText("kpi-india-violent-rate", "0.0%");
        setKpiText("kpi-india-arrest-rate", "0.0%");
        if (elCsCount) elCsCount.textContent = "0 arrests";
        setKpiText("kpi-india-cs", "0.0% Rate");
        setKpiText("kpi-india-domestic-rate", "0.0%");
        setKpiText("kpi-india-domestic-count", "0 cases");
        setKpiText("kpi-india-cyber", "0");
        setKpiText("kpi-india-women", "0");
        if (elDateSpan) elDateSpan.textContent = "No matching records found";

        setKpiText("kpi-india-hotspot", "None");
        setKpiText("kpi-india-hotspot-detail", "No active district matches filter");
        updateKpiActiveFilterStates();
    }
}

/**
 * Update the Top Active Filter Banner
 */
function updateFilterBanner(filteredStates, filteredDistricts) {
    const f = indiaState.filters;
    const banner = document.getElementById("india-filter-indicator");
    const bannerText = document.getElementById("india-banner-text");
    const bannerIcon = document.getElementById("india-banner-icon");
    const btnDistricts = document.getElementById("btn-banner-view-districts");
    const btnMap = document.getElementById("btn-banner-view-map");

    if (!banner || !bannerText) return;

    if (f.district) {
        const dist = indiaState.districtsData.find(d => d.district_name === f.district);
        const stateName = dist ? dist.state_ut : f.state;
        if (bannerIcon) bannerIcon.textContent = "🏛️";
        bannerText.innerHTML = `Active Filter: <strong>${f.district} District</strong> (${stateName}) &bull; <span class="font-mono text-sky">Rate: ${dist ? dist.crime_rate_per_lakh : '--'}/1L</span> &bull; <span class="font-mono text-emerald">Chargesheet: ${dist ? dist.chargesheet_rate : '--'}%</span>`;
        if (btnDistricts) btnDistricts.style.display = "none";
        if (btnMap) btnMap.style.display = "inline-flex";
        banner.style.display = "flex";
    } else if (f.state) {
        if (bannerIcon) bannerIcon.textContent = "🇮🇳";
        bannerText.innerHTML = `Active Filter: <strong>State of ${f.state}</strong> &bull; <span class="font-mono text-sky">${filteredDistricts.length} Police Districts cataloged</span> &bull; <span class="font-mono text-amber">Total IPC: ${filteredStates[0]?.ipc_crimes?.toLocaleString() || '--'}</span>`;
        if (btnDistricts) {
            btnDistricts.style.display = "inline-flex";
            btnDistricts.textContent = `🏛️ View ${filteredDistricts.length} Districts`;
        }
        if (btnMap) btnMap.style.display = "inline-flex";
        banner.style.display = "flex";
    } else if (f.search) {
        if (bannerIcon) bannerIcon.textContent = "🔍";
        bannerText.innerHTML = `Search Filter: "<strong>${escapeHtml(f.search)}</strong>" &bull; Matched ${filteredStates.length} States & ${filteredDistricts.length} Districts`;
        if (btnDistricts) btnDistricts.style.display = filteredDistricts.length > 0 ? "inline-flex" : "none";
        if (btnDistricts && filteredDistricts.length > 0) btnDistricts.textContent = `🏛️ View ${filteredDistricts.length} Districts`;
        if (btnMap) btnMap.style.display = "none";
        banner.style.display = "flex";
    } else {
        banner.style.display = "none";
    }
}

/**
 * Dynamically Update Charts for Filtered State & Districts
 */
function updateDynamicCharts(filteredStates, filteredDistricts) {
    const f = indiaState.filters;

    const titleRate = document.getElementById("title-india-rate");
    const subtitleRate = document.getElementById("subtitle-india-rate");
    const titleCats = document.getElementById("title-india-categories");
    const subtitleCats = document.getElementById("subtitle-india-categories");

    if (f.state && filteredStates.length === 1) {
        const stateName = f.state;
        const stateObj = filteredStates[0];

        // 1. Rate Chart: Show top districts in this state
        if (titleRate) titleRate.textContent = `Top Districts by Crime Rate in ${stateName}`;
        if (subtitleRate) subtitleRate.textContent = `Police Districts within ${stateName} ranked by IPC crime rate per 1 Lakh population`;
        renderRateChartForDistricts(filteredDistricts, stateName);

        // 2. Categories Donut for this state
        if (titleCats) titleCats.textContent = `${stateName} Crime Category Distribution`;
        if (subtitleCats) subtitleCats.textContent = `Offense distribution breakdown for ${stateName}`;
        renderCategoriesDonutForState(stateObj);

        // 3. Chargesheet Chart in Analytics: Show districts chargesheet rate in this state
        renderChargesheetChartForDistricts(filteredDistricts, stateName);

    } else if (f.district) {
        const dist = indiaState.districtsData.find(d => d.district_name === f.district);
        if (dist) {
            const stateDistricts = indiaState.districtsData.filter(d => d.state_ut === dist.state_ut);
            if (titleRate) titleRate.textContent = `District Crime Rate Comparison (${dist.state_ut})`;
            if (subtitleRate) subtitleRate.textContent = `${dist.district_name} highlighted among ${dist.state_ut} districts`;
            renderRateChartForDistricts(stateDistricts, dist.state_ut, dist.district_name);

            if (titleCats) titleCats.textContent = `${dist.district_name} Offense Breakdown`;
            if (subtitleCats) subtitleCats.textContent = `Violent, Cyber, and Property incidents in ${dist.district_name}`;
            renderCategoriesDonutForDistrict(dist);
        }
    } else {
        // Revert to all India charts
        if (titleRate) titleRate.textContent = "Crime Rate per 1 Lakh Population by State / UT";
        if (subtitleRate) subtitleRate.textContent = "Normalizes incident volume by resident population density (NCRB Standard)";
        if (titleCats) titleCats.textContent = "National Crime Categorization";
        if (subtitleCats) subtitleCats.textContent = "Distribution of IPC crime categories in India";

        renderRateChart(filteredStates.length > 0 ? filteredStates : indiaState.statesData);
        if (indiaState.categoriesData) renderCategoriesDonut(indiaState.categoriesData);
        renderChargesheetChart(filteredStates.length > 0 ? filteredStates : indiaState.statesData);
    }
}

/**
 * Setup GIS Layer Toggles and State Dropdown Jump
 */
function setupGisControls() {
    const btnStatesLayer = document.getElementById("btn-gis-layer-states");
    const btnDistrictsLayer = document.getElementById("btn-gis-layer-districts");
    const stateFilter = document.getElementById("gis-state-filter");

    if (btnStatesLayer && btnDistrictsLayer) {
        btnStatesLayer.addEventListener("click", () => {
            btnStatesLayer.classList.add("active");
            btnDistrictsLayer.classList.remove("active");
            setGisLayer("states");
        });

        btnDistrictsLayer.addEventListener("click", () => {
            btnDistrictsLayer.classList.add("active");
            btnStatesLayer.classList.remove("active");
            setGisLayer("districts");
        });
    }

    if (stateFilter) {
        stateFilter.addEventListener("change", (e) => {
            const val = e.target.value;
            indiaState.selectedGisState = val;
            indiaState.filters.state = val === "all" ? "" : val;
            indiaState.filters.district = "";

            const mainStateFilter = document.getElementById("filter-state");
            if (mainStateFilter) mainStateFilter.value = val === "all" ? "" : val;

            const explorerStateFilter = document.getElementById("filter-district-state");
            if (explorerStateFilter) explorerStateFilter.value = val;

            populateDistrictDropdown(val === "all" ? "" : val);

            if (val === "all") {
                if (indiaState.map) indiaState.map.flyTo([22.8, 80.0], 5, { duration: 1.2 });
                renderGisChips(indiaState.currentGisLayer === "districts" ? indiaState.districtsData : indiaState.statesData);
            } else {
                const stateObj = indiaState.statesData.find(s => s.state_ut === val);
                if (stateObj && indiaState.map) {
                    indiaState.map.flyTo([stateObj.lat, stateObj.lng], 7, { duration: 1.2 });
                }
                const filteredDistricts = indiaState.districtsData.filter(d => d.state_ut === val);
                renderGisChips(filteredDistricts, true);
            }
            applyAllFilters();
        });
    }
}

/**
 * Switch Active GIS Layer (States vs Districts)
 */
function setGisLayer(layer) {
    indiaState.currentGisLayer = layer;
    if (!indiaState.map) return;

    const overlayText = document.getElementById("gis-overlay-text");
    const btnStatesLayer = document.getElementById("btn-gis-layer-states");
    const btnDistrictsLayer = document.getElementById("btn-gis-layer-districts");

    if (layer === "states") {
        if (btnStatesLayer) btnStatesLayer.classList.add("active");
        if (btnDistrictsLayer) btnDistrictsLayer.classList.remove("active");

        if (indiaState.districtsLayer) indiaState.map.removeLayer(indiaState.districtsLayer);
        if (indiaState.statesLayer) indiaState.statesLayer.addTo(indiaState.map);

        if (overlayText) overlayText.textContent = "REPUBLIC OF INDIA // NCRB STATE-LEVEL GIS GEO-POINTS (36 STATES & UTs)";
        renderGisChips(indiaState.statesData, false);
    } else {
        if (btnDistrictsLayer) btnDistrictsLayer.classList.add("active");
        if (btnStatesLayer) btnStatesLayer.classList.remove("active");

        if (indiaState.statesLayer) indiaState.map.removeLayer(indiaState.statesLayer);
        if (indiaState.districtsLayer) indiaState.districtsLayer.addTo(indiaState.map);

        if (overlayText) overlayText.textContent = "REPUBLIC OF INDIA // POLICE DISTRICTS & COMMISSIONERATES (780+ JURISDICTIONS)";
        
        const currentSelectedState = indiaState.filters.state || indiaState.selectedGisState;
        if (currentSelectedState && currentSelectedState !== "all") {
            const filtered = indiaState.districtsData.filter(d => d.state_ut === currentSelectedState);
            renderGisChips(filtered, true);
        } else {
            renderGisChips(indiaState.districtsData, true);
        }
    }
}

/**
 * Render Sidebar Jump Chips for GIS Map
 */
function renderGisChips(items, isDistrict = false) {
    const chipsContainer = document.getElementById("india-state-chips");
    const labelEl = document.getElementById("gis-pins-label");
    if (!chipsContainer) return;

    chipsContainer.innerHTML = "";
    if (labelEl) labelEl.textContent = isDistrict ? `District Jump Points (${items.length})` : `Quick State / UT Jump (${items.length})`;

    items.slice(0, 30).forEach(item => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "district-chip";
        chip.textContent = isDistrict ? item.district_name : item.state_ut;
        chip.addEventListener("click", () => {
            if (!indiaState.map) return;
            const zoom = isDistrict ? 10 : 7;
            indiaState.map.flyTo([item.lat, item.lng], zoom, { duration: 1.0 });
            showEntityModal(item, isDistrict ? "district" : "state");
        });
        chipsContainer.appendChild(chip);
    });
}

function switchToExplorerDistrictsView() {
    const btnStates = document.getElementById("btn-toggle-states");
    const btnDistricts = document.getElementById("btn-toggle-districts");
    const btnIncidents = document.getElementById("btn-toggle-incidents");
    const containerStates = document.getElementById("container-table-states");
    const containerDistricts = document.getElementById("container-table-districts");
    const containerIncidents = document.getElementById("container-table-incidents");
    const districtControls = document.getElementById("district-filter-controls");
    const explorerHeading = document.getElementById("explorer-heading");

    if (btnDistricts) btnDistricts.classList.add("active");
    if (btnStates) btnStates.classList.remove("active");
    if (btnIncidents) btnIncidents.classList.remove("active");
    indiaState.currentExplorerView = "districts";

    if (containerStates) containerStates.style.display = "none";
    if (containerDistricts) containerDistricts.style.display = "block";
    if (containerIncidents) containerIncidents.style.display = "none";
    if (districtControls) districtControls.style.display = "flex";
    if (explorerHeading) {
        explorerHeading.textContent = indiaState.filters.state 
            ? `Police Districts & Commissionerates in ${indiaState.filters.state}`
            : "Official Indian Police District & Commissionerate Intelligence Dossier";
    }

    const filterDistrictState = document.getElementById("filter-district-state");
    if (filterDistrictState) {
        filterDistrictState.value = indiaState.filters.state || "all";
    }
}

function switchToExplorerStatesView() {
    const btnStates = document.getElementById("btn-toggle-states");
    const btnDistricts = document.getElementById("btn-toggle-districts");
    const btnIncidents = document.getElementById("btn-toggle-incidents");
    const containerStates = document.getElementById("container-table-states");
    const containerDistricts = document.getElementById("container-table-districts");
    const containerIncidents = document.getElementById("container-table-incidents");
    const districtControls = document.getElementById("district-filter-controls");
    const explorerHeading = document.getElementById("explorer-heading");

    if (btnStates) btnStates.classList.add("active");
    if (btnDistricts) btnDistricts.classList.remove("active");
    if (btnIncidents) btnIncidents.classList.remove("active");
    indiaState.currentExplorerView = "states";

    if (containerStates) containerStates.style.display = "block";
    if (containerDistricts) containerDistricts.style.display = "none";
    if (containerIncidents) containerIncidents.style.display = "none";
    if (districtControls) districtControls.style.display = "none";
    if (explorerHeading) explorerHeading.textContent = "Official NCRB State & Union Territory Intelligence Dossier";
}

function switchToExplorerIncidentsView() {
    const btnStates = document.getElementById("btn-toggle-states");
    const btnDistricts = document.getElementById("btn-toggle-districts");
    const btnIncidents = document.getElementById("btn-toggle-incidents");
    const containerStates = document.getElementById("container-table-states");
    const containerDistricts = document.getElementById("container-table-districts");
    const containerIncidents = document.getElementById("container-table-incidents");
    const districtControls = document.getElementById("district-filter-controls");
    const explorerHeading = document.getElementById("explorer-heading");

    if (btnStates) btnStates.classList.remove("active");
    if (btnDistricts) btnDistricts.classList.remove("active");
    if (btnIncidents) btnIncidents.classList.add("active");
    indiaState.currentExplorerView = "incidents";

    if (containerStates) containerStates.style.display = "none";
    if (containerDistricts) containerDistricts.style.display = "none";
    if (containerIncidents) containerIncidents.style.display = "block";
    if (districtControls) districtControls.style.display = "none";
    if (explorerHeading) {
        explorerHeading.textContent = indiaState.filters.state
            ? `Live First Information Reports (FIRs) - ${indiaState.filters.state}`
            : "Live CCTNS & NCRB First Information Reports (Incident Telemetry)";
    }

    loadIndiaIncidents(1);
}

/**
 * Setup Explorer Sub-Tabs & Filtering Controls
 */
function setupExplorerToggles() {
    const btnStates = document.getElementById("btn-toggle-states");
    const btnDistricts = document.getElementById("btn-toggle-districts");
    const btnIncidents = document.getElementById("btn-toggle-incidents");
    const searchInput = document.getElementById("search-india-input");

    if (btnStates) {
        btnStates.addEventListener("click", () => {
            switchToExplorerStatesView();
            applyAllFilters();
        });
    }

    if (btnDistricts) {
        btnDistricts.addEventListener("click", () => {
            switchToExplorerDistrictsView();
            applyAllFilters();
        });
    }

    if (btnIncidents) {
        btnIncidents.addEventListener("click", () => {
            switchToExplorerIncidentsView();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            applyExplorerFilter();
        });
    }

    // Incident filters listeners
    const filterCat = document.getElementById("filter-incident-cat");
    const filterArrest = document.getElementById("filter-incident-arrest");
    const filterCs = document.getElementById("filter-incident-chargesheet");

    [filterCat, filterArrest, filterCs].forEach(el => {
        if (el) el.addEventListener("change", () => {
            if (indiaState.currentExplorerView === "incidents") {
                loadIndiaIncidents(1);
            }
        });
    });

    // Incident pagination listeners
    const btnPrev = document.getElementById("btn-incidents-prev");
    const btnNext = document.getElementById("btn-incidents-next");

    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            if (indiaState.incidentsPage > 1) {
                loadIndiaIncidents(indiaState.incidentsPage - 1);
            }
        });
    }
    if (btnNext) {
        btnNext.addEventListener("click", () => {
            if (indiaState.incidentsPage < indiaState.incidentsTotalPages) {
                loadIndiaIncidents(indiaState.incidentsPage + 1);
            }
        });
    }

    // District filters listeners
    const filterState = document.getElementById("filter-district-state");
    const filterRisk = document.getElementById("filter-district-risk");
    const filterComm = document.getElementById("filter-district-comm");
    const filterSort = document.getElementById("filter-district-sort");

    if (filterState) {
        filterState.addEventListener("change", (e) => {
            const val = e.target.value === "all" ? "" : e.target.value;
            indiaState.filters.state = val;
            indiaState.filters.district = "";

            const mainStateFilter = document.getElementById("filter-state");
            if (mainStateFilter) mainStateFilter.value = val;

            const gisFilter = document.getElementById("gis-state-filter");
            if (gisFilter) gisFilter.value = val || "all";

            populateDistrictDropdown(val);
            applyAllFilters();
            if (indiaState.currentExplorerView === "incidents") {
                loadIndiaIncidents(1);
            }
        });
    }

    [filterRisk, filterComm, filterSort].forEach(el => {
        if (el) el.addEventListener("change", applyExplorerFilter);
    });
}

/**
 * Setup Safety View Toggles
 */
function setupSafetyToggles() {
    const btnSafetyStates = document.getElementById("btn-safety-states");
    const btnSafetyDistricts = document.getElementById("btn-safety-districts");
    const containerStates = document.getElementById("container-safety-states");
    const containerDistricts = document.getElementById("container-safety-districts");

    if (!btnSafetyStates || !btnSafetyDistricts) return;

    btnSafetyStates.addEventListener("click", () => {
        btnSafetyStates.classList.add("active");
        btnSafetyDistricts.classList.remove("active");
        indiaState.currentSafetyView = "states";
        if (containerStates) containerStates.style.display = "block";
        if (containerDistricts) containerDistricts.style.display = "none";
    });

    btnSafetyDistricts.addEventListener("click", () => {
        btnSafetyDistricts.classList.add("active");
        btnSafetyStates.classList.remove("active");
        indiaState.currentSafetyView = "districts";
        if (containerStates) containerStates.style.display = "none";
        if (containerDistricts) containerDistricts.style.display = "block";
        
        let distList = indiaState.districtsData;
        if (indiaState.filters.state) {
            distList = distList.filter(d => d.state_ut === indiaState.filters.state);
        }
        renderDistrictSafetyTable(distList);
    });
}

/**
 * Filter & Search Explorer Table
 */
function applyExplorerFilter() {
    const searchInput = document.getElementById("search-india-input");
    const term = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const countEl = document.getElementById("india-explorer-count");

    if (indiaState.currentExplorerView === "incidents") {
        loadIndiaIncidents(1);
        return;
    }

    if (indiaState.currentExplorerView === "states") {
        let filteredStates = indiaState.statesData;
        if (indiaState.filters.state) {
            filteredStates = filteredStates.filter(s => s.state_ut === indiaState.filters.state);
        }
        if (term) {
            filteredStates = filteredStates.filter(s =>
                s.state_ut.toLowerCase().includes(term) ||
                s.capital.toLowerCase().includes(term) ||
                s.zone.toLowerCase().includes(term)
            );
        }
        if (countEl) countEl.textContent = `${filteredStates.length} States & UTs cataloged`;
        renderExplorerTable(filteredStates);
    } else {
        const filterState = document.getElementById("filter-district-state");
        const filterRisk = document.getElementById("filter-district-risk");
        const filterComm = document.getElementById("filter-district-comm");
        const filterSort = document.getElementById("filter-district-sort");

        const selectedState = (filterState && filterState.value !== "all") ? filterState.value : indiaState.filters.state;
        const selectedRisk = filterRisk ? filterRisk.value : "all";
        const selectedComm = filterComm ? filterComm.value : "all";
        const selectedSort = filterSort ? filterSort.value : "ipc_crimes";

        let list = indiaState.districtsData.filter(d => {
            const matchesSearch = !term || 
                d.district_name.toLowerCase().includes(term) ||
                d.headquarters.toLowerCase().includes(term) ||
                d.state_ut.toLowerCase().includes(term);

            const matchesState = !selectedState || d.state_ut === selectedState;
            const matchesDistrict = !indiaState.filters.district || d.district_name === indiaState.filters.district;
            const matchesRisk = selectedRisk === "all" || d.risk_tier === selectedRisk;
            const matchesComm = selectedComm === "all" || (selectedComm === "1" ? d.is_commissionerate === 1 : d.is_commissionerate === 0);

            return matchesSearch && matchesState && matchesDistrict && matchesRisk && matchesComm;
        });

        // Sort
        list.sort((a, b) => {
            if (selectedSort === "district_name") {
                return a.district_name.localeCompare(b.district_name);
            }
            if (selectedSort === "safety_index" || selectedSort === "chargesheet_rate") {
                return b[selectedSort] - a[selectedSort];
            }
            return b[selectedSort] - a[selectedSort];
        });

        if (countEl) countEl.textContent = `${list.length} Districts cataloged ${selectedState ? 'in ' + selectedState : ''}`;
        renderExplorerDistrictsTable(list);
    }
}

/**
 * Load All Data from API
 */
async function loadAllIndiaData() {
    try {
        const qParams = new URLSearchParams();
        if (indiaState.filters.date) qParams.set("date", indiaState.filters.date);
        if (indiaState.filters.year) qParams.set("year", indiaState.filters.year);
        const qs = qParams.toString() ? `?${qParams.toString()}` : "";
        const distQs = qParams.toString() ? `?limit=1000&${qParams.toString()}` : "?limit=1000";

        const [sumRes, statesRes, distRes, catRes, citiesRes, incRes] = await Promise.all([
            fetch(`/api/india/summary${qs}`),
            fetch(`/api/india/states${qs}`),
            fetch(`/api/india/districts${distQs}`),
            fetch(`/api/india/categories${qs}`),
            fetch("/api/india/cities"),
            fetch("/api/india/incidents?page=1&page_size=1")
        ]);

        const summary = await sumRes.json();
        const states = await statesRes.json();
        const districtsObj = await distRes.json();
        const categories = await catRes.json();
        const cities = await citiesRes.json();
        const incData = await incRes.json();

        indiaState.summaryData = summary;
        indiaState.statesData = states;
        indiaState.districtsData = districtsObj.districts || [];
        indiaState.categoriesData = categories.categories;
        indiaState.citiesData = cities;

        // Update Topbar Active Dataset Beacon
        const headerCountEl = document.getElementById("india-header-total-count");
        if (headerCountEl && incData && incData.total) {
            headerCountEl.textContent = Number(incData.total).toLocaleString();
        }

        // Update Date Context Status Banner
        const bannerMode = document.getElementById("banner-date-mode");
        const bannerLabel = document.getElementById("banner-mode-label");
        const bannerText = document.getElementById("banner-context-text");
        const bannerDaily = document.getElementById("val-banner-daily");
        const bannerCalls = document.getElementById("val-banner-calls");
        const bannerLastSync = document.getElementById("banner-last-sync");

        if (bannerMode) {
            if (summary.is_realtime) {
                bannerMode.className = "date-mode-pill live";
                if (bannerLabel) bannerLabel.textContent = "LIVE REAL-TIME TELEMETRY";
            } else {
                bannerMode.className = "date-mode-pill historical";
                if (bannerLabel) bannerLabel.textContent = `NCRB HISTORICAL ARCHIVE (${summary.year || summary.selected_date})`;
            }
        }

        if (bannerText) {
            if (summary.is_realtime) {
                bannerText.innerHTML = `Ingesting active CCTNS police bulletins & ERSS 112 dispatches for <strong>${summary.selected_date || 'Today'}</strong> (${summary.day_name})`;
            } else {
                bannerText.innerHTML = `Viewing calibrated NCRB crime archives for <strong>${summary.selected_date || summary.year}</strong> (${summary.day_name || 'Annual Data'})`;
            }
        }

        if (bannerDaily) bannerDaily.textContent = (summary.estimated_daily_crimes || 14747).toLocaleString();
        if (bannerCalls) bannerCalls.textContent = (summary.active_erss_calls || 16731).toLocaleString();
        if (bannerLastSync) bannerLastSync.textContent = `Synced: ${new Date().toLocaleTimeString()}`;

        // Populate State Dropdowns for Filters
        populateStateDropdowns(districtsObj.states_list || []);

        // 1. Populate KPI Cards
        const csCount = summary.national_chargesheets_filed || Math.round((summary.national_ipc_crimes || 0) * (summary.national_avg_chargesheet_rate || 0) / 100);
        const womenCases = summary.national_crimes_against_women || 0;
        const totalIpc = summary.national_ipc_crimes || 1;
        const domRate = ((womenCases / totalIpc) * 100).toFixed(1);

        setKpiText("kpi-india-total", summary.national_ipc_crimes.toLocaleString());
        setKpiText("kpi-india-violent", summary.national_violent_crimes.toLocaleString());
        setKpiText("kpi-india-violent-rate", `${summary.violent_crime_percentage}%`);
        setKpiText("kpi-india-arrest-rate", `${summary.national_avg_chargesheet_rate}%`);
        const elCsCountInit = document.getElementById("kpi-india-cs-count");
        if (elCsCountInit) elCsCountInit.textContent = `${csCount.toLocaleString()} arrests`;
        setKpiText("kpi-india-cs", `${summary.national_avg_chargesheet_rate}% Rate`);
        setKpiText("kpi-india-domestic-rate", `${domRate}%`);
        setKpiText("kpi-india-domestic-count", `${womenCases.toLocaleString()} cases`);
        setKpiText("kpi-india-cyber", (summary.national_cyber_crimes || 0).toLocaleString());
        setKpiText("kpi-india-women", womenCases.toLocaleString());

        const elDateSpan = document.getElementById("kpi-india-date-span");
        if (elDateSpan) {
            if (summary.selected_date) {
                elDateSpan.textContent = `Active Range: ${summary.selected_date} (${summary.day_name || 'Live'})`;
            } else {
                elDateSpan.textContent = `Active Range: ${summary.year || 2026} Calibrated`;
            }
        }

        updateHotspotDistrictKpi(indiaState.districtsData);
        updateKpiActiveFilterStates();
        
        const mapRateEl = document.getElementById("map-india-rate");
        if (mapRateEl) mapRateEl.textContent = `${summary.national_avg_crime_rate} / 1L`;

        // 2. Render Charts
        renderRateChart(states);
        renderCategoriesDonut(categories.categories);
        renderChargesheetChart(states);
        renderCitiesChart(cities);
        renderZonesChart(states);
        renderCyberRankingChart(states);

        // 3. Render Tables
        renderOverviewDistrictsTable(indiaState.districtsData);
        renderExplorerTable(states);
        renderExplorerDistrictsTable(indiaState.districtsData);
        renderSafetyTable(states);
        renderDistrictSafetyTable(indiaState.districtsData);

        // 4. Populate Briefing View
        populateBriefing(summary, states);

        // 5. Update Map if open
        if (indiaState.map) {
            renderMapMarkers();
        }

        // 6. Ingest & Render Real-Time Incident Stream
        await loadRealtimeData(false);

        // 7. Apply any active filters across components
        applyAllFilters();

        // 8. Pre-render India Cities Roster
        loadIndiaCitiesRoster();

    } catch (e) {
        console.error("Failed to load India data:", e);
    }
}

/**
 * Fetch and Render Real-Time Police Telemetry & Incident Feed
 */
async function loadRealtimeData(isManual = false) {
    try {
        const q = new URLSearchParams();
        if (indiaState.filters.date) q.set("date", indiaState.filters.date);
        if (indiaState.filters.state) q.set("state", indiaState.filters.state);
        if (indiaState.filters.district) q.set("district", indiaState.filters.district);
        if (indiaState.filters.search) q.set("search", indiaState.filters.search);

        const res = await fetch(`/api/india/realtime?${q.toString()}`);
        const data = await res.json();
        indiaState.realtimeData = data;

        // Update realtime mini KPI boxes
        const statCalls = document.getElementById("rt-stat-calls");
        const statFraud = document.getElementById("rt-stat-fraud");
        const statPatrols = document.getElementById("rt-stat-patrols");
        const statResp = document.getElementById("rt-stat-response");

        if (statCalls) statCalls.textContent = (data.total_active_erss_calls || 16731).toLocaleString();
        if (statFraud) statFraud.textContent = `₹${data.cyber_fraud_frozen_lakhs || 412.5} Lakhs`;
        if (statPatrols) statPatrols.textContent = `${(data.active_patrol_units || 5470).toLocaleString()} Units`;
        if (statResp) statResp.textContent = `${data.avg_response_time_mins || 7.6} mins`;

        // Update stream header title & subtitle dynamically
        const streamTitle = document.getElementById("realtime-stream-title");
        const streamSub = document.getElementById("realtime-stream-subtitle");
        if (streamTitle) {
            if (indiaState.filters.search) {
                streamTitle.textContent = `${indiaState.filters.search} — Live Police Dispatch & Incident Stream`;
            } else if (indiaState.filters.district) {
                streamTitle.textContent = `${indiaState.filters.district} District Police Dispatch Stream`;
            } else if (indiaState.filters.state) {
                streamTitle.textContent = `${indiaState.filters.state} State Police Dispatch Stream`;
            } else {
                streamTitle.textContent = "National Police Dispatch & Incident Stream";
            }
        }
        if (streamSub) {
            if (indiaState.filters.search) {
                streamSub.textContent = `Real-time CCTNS & ERSS 112 dispatches, active patrol units, and station logs for "${indiaState.filters.search}"`;
            } else if (indiaState.filters.district) {
                streamSub.textContent = `Live CCTNS & ERSS 112 dispatches, 1930 cyber lien freezes & station logs for ${indiaState.filters.district}, ${indiaState.filters.state || 'India'}`;
            } else if (indiaState.filters.state) {
                streamSub.textContent = `Live ERSS 112 calls, police commissionerate feeds & active patrols in ${indiaState.filters.state}`;
            } else {
                streamSub.textContent = "CCTNS & ERSS 112 incident feeds across Indian Police Commissionerates and District HQs";
            }
        }

        // Update All Feeds count badge in category toggle
        const allToggle = document.querySelector("#realtime-category-toggles [data-rt-cat='all']");
        if (allToggle && data.incidents) {
            allToggle.textContent = `All Feeds (${data.incidents.length})`;
        }

        renderRealtimeIncidentList(data.incidents || []);

        // Update Live Synced badge in header
        const badge = document.getElementById("badge-last-sync");
        if (badge && data.is_realtime !== false) {
            badge.textContent = `LIVE SYNCED: ${new Date().toLocaleTimeString()}`;
        }

        if (isManual) {
            const scopeLabel = indiaState.filters.district || indiaState.filters.state || "National";
            showSafetyToast(`⚡ Real-Time Telemetry: ${data.incidents?.length || 0} live police dispatches updated for ${scopeLabel}!`);
        }
    } catch (e) {
        console.error("Failed to load real-time telemetry:", e);
    }
}

/**
 * Render Incident Cards in the Real-Time Dispatch Stream
 */
function renderRealtimeIncidentList(incidents) {
    const container = document.getElementById("realtime-incident-list");
    if (!container) return;

    let list = incidents || [];
    const catFilter = indiaState.currentRealtimeFilter || "all";
    if (catFilter !== "all") {
        list = list.filter(i => i.category === catFilter);
    }

    if (list.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.85rem;">
                No real-time incidents reported under selected category for this query.
            </div>
        `;
        return;
    }

    container.innerHTML = list.map(inc => `
        <div class="realtime-incident-item severity-${inc.severity || 'moderate'}">
            <div class="rt-item-top">
                <div class="rt-item-meta">
                    <span class="rt-time-badge ${inc.minutes_ago > 45 ? 'older' : ''}">
                        ${inc.is_realtime !== false ? inc.timestamp_relative : inc.time + ', ' + inc.timestamp_relative}
                    </span>
                    <span class="rt-location-badge">📍 ${inc.district}, ${inc.state_ut}</span>
                    <span class="rt-category-badge">${inc.category_label || inc.category}</span>
                </div>
                <span class="rt-severity-badge ${inc.severity || 'moderate'}">${inc.severity || 'MODERATE'}</span>
            </div>
            <div class="rt-item-title">${inc.title}</div>
            <div class="rt-item-desc">${inc.description}</div>
            <div class="rt-item-bottom">
                <span class="rt-station-info">
                    <strong>PS:</strong> ${inc.police_station} &bull; <strong>Lead:</strong> ${inc.officer}
                </span>
                <div class="rt-actions-wrap">
                    <span class="rt-status-pill">${inc.status}</span>
                    <button type="button" class="btn-rt-map" data-lat="${inc.lat}" data-lng="${inc.lng}" data-district="${inc.district}" data-title="${encodeURIComponent(inc.title)}" data-station="${encodeURIComponent(inc.police_station)}">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
                        Map
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    // Wire up map locator buttons on incident cards
    container.querySelectorAll(".btn-rt-map").forEach(btn => {
        btn.addEventListener("click", () => {
            const lat = parseFloat(btn.getAttribute("data-lat"));
            const lng = parseFloat(btn.getAttribute("data-lng"));
            const district = btn.getAttribute("data-district");
            const title = decodeURIComponent(btn.getAttribute("data-title") || "");
            const station = decodeURIComponent(btn.getAttribute("data-station") || "");

            // Switch to Map tab
            const tabMap = document.getElementById("tab-map");
            if (tabMap) tabMap.click();

            if (indiaState.map && !isNaN(lat) && !isNaN(lng)) {
                setGisLayer("districts");
                indiaState.map.flyTo([lat, lng], 9, { duration: 1.2 });
                setTimeout(() => {
                    L.popup()
                        .setLatLng([lat, lng])
                        .setContent(`
                            <div class="gis-popup">
                                <div class="gis-popup-header">
                                    <span class="badge-pill badge-warning">Police Dispatch Record</span>
                                    <h4>${district}</h4>
                                </div>
                                <div style="margin: 8px 0; font-weight: 600; font-size: 0.85rem; color: #fff;">${title}</div>
                                <div style="font-size: 0.76rem; color: #94a3b8;">${station}</div>
                            </div>
                        `)
                        .openOn(indiaState.map);
                }, 1300);
            }
        });
    });
}

/**
 * Populate Dropdown Filters for States
 */
function populateStateDropdowns(statesList) {
    if (!statesList || statesList.length === 0) return;

    const gisFilter = document.getElementById("gis-state-filter");
    const districtFilter = document.getElementById("filter-district-state");
    const mainStateFilter = document.getElementById("filter-state");

    const currentSelectedState = indiaState.filters.state || (mainStateFilter ? mainStateFilter.value : "");

    if (mainStateFilter) {
        if (mainStateFilter.options.length <= 1) {
            mainStateFilter.innerHTML = `<option value="">All 36 States & UTs</option>`;
            statesList.forEach(st => {
                const opt = document.createElement("option");
                opt.value = st;
                opt.textContent = st;
                mainStateFilter.appendChild(opt);
            });
        }
        if (currentSelectedState) {
            mainStateFilter.value = currentSelectedState;
        }
    }

    if (gisFilter) {
        if (gisFilter.options.length <= 1) {
            gisFilter.innerHTML = `<option value="all">🇮🇳 All India (National View)</option>`;
            statesList.forEach(st => {
                const opt = document.createElement("option");
                opt.value = st;
                opt.textContent = st;
                gisFilter.appendChild(opt);
            });
        }
        if (currentSelectedState) {
            gisFilter.value = currentSelectedState;
        }
    }

    if (districtFilter) {
        if (districtFilter.options.length <= 1) {
            districtFilter.innerHTML = `<option value="all">All States & UTs (${statesList.length})</option>`;
            statesList.forEach(st => {
                const opt = document.createElement("option");
                opt.value = st;
                opt.textContent = st;
                districtFilter.appendChild(opt);
            });
        }
        if (currentSelectedState) {
            districtFilter.value = currentSelectedState;
        }
    }

    populateDistrictDropdown(currentSelectedState);
}

/**
 * Initialize Leaflet Map for India
 */
function initIndiaMap() {
    const container = document.getElementById("leaflet-india-map");
    if (!container || indiaState.map) return;

    indiaState.map = L.map("leaflet-india-map", {
        center: [22.8, 80.0],
        zoom: 5,
        zoomControl: false,
        attributionControl: false
    });

    L.control.zoom({ position: "topright" }).addTo(indiaState.map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
        subdomains: "abcd"
    }).addTo(indiaState.map);

    indiaState.statesLayer = L.layerGroup().addTo(indiaState.map);
    indiaState.districtsLayer = L.layerGroup();

    renderMapMarkers();
}

/**
 * Render Map Markers for both States and Districts
 */
function renderMapMarkers(customStates, customDistricts) {
    if (!indiaState.map || !indiaState.statesLayer) return;

    indiaState.statesLayer.clearLayers();
    indiaState.districtsLayer.clearLayers();

    const statesList = customStates || indiaState.statesData;
    const districtsList = customDistricts || indiaState.districtsData;

    // 1. Render States Layer
    statesList.forEach(st => {
        let markerColor = CHART_COLORS.emerald;
        if (st.threat_score >= 60) markerColor = CHART_COLORS.crimson;
        else if (st.threat_score >= 42) markerColor = CHART_COLORS.amber;
        else if (st.threat_score >= 25) markerColor = CHART_COLORS.sky;

        const marker = L.circleMarker([st.lat, st.lng], {
            radius: Math.min(18, Math.max(6, Math.sqrt(st.ipc_crimes / 2200))),
            fillColor: markerColor,
            color: "#ffffff",
            weight: 1.5,
            opacity: 0.95,
            fillOpacity: 0.8
        });

        const popupHtml = `
            <div class="popup-crime-header">
                <span class="popup-type">${st.state_ut} (${st.capital})</span>
                <span class="popup-badge badge-${st.badge_class}">${st.risk_tier}</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Total IPC Crimes:</span>
                <span class="popup-item-val font-mono">${st.ipc_crimes.toLocaleString()}</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Crime Rate (per 1L):</span>
                <span class="popup-item-val font-mono text-sky">${st.crime_rate_per_lakh}</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Chargesheet Rate:</span>
                <span class="popup-item-val font-mono text-emerald">${st.chargesheet_rate}%</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Violent Incidents:</span>
                <span class="popup-item-val font-mono text-danger">${st.violent_crimes.toLocaleString()}</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Crimes vs Women:</span>
                <span class="popup-item-val font-mono text-amber">${st.crimes_against_women.toLocaleString()}</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Safety Index Score:</span>
                <span class="popup-item-val font-mono text-emerald">${st.safety_index} / 100</span>
            </div>
            <div style="margin-top: 8px;">
                <button type="button" class="btn btn-primary btn-sm btn-popup-inspect" style="width: 100%;">Inspect State Dossier</button>
            </div>
        `;
        marker.bindPopup(popupHtml);
        marker.on("popupopen", () => {
            const btn = document.querySelector(".btn-popup-inspect");
            if (btn) btn.onclick = () => showEntityModal(st, "state");
        });

        indiaState.statesLayer.addLayer(marker);
    });

    // 2. Render Districts Layer
    districtsList.forEach(d => {
        let markerColor = CHART_COLORS.emerald;
        if (d.threat_score >= 60) markerColor = CHART_COLORS.crimson;
        else if (d.threat_score >= 42) markerColor = CHART_COLORS.amber;
        else if (d.threat_score >= 25) markerColor = CHART_COLORS.sky;

        const commTag = d.is_commissionerate ? "★ Police Comm." : "District Police";

        const marker = L.circleMarker([d.lat, d.lng], {
            radius: Math.min(14, Math.max(5, Math.sqrt(d.ipc_crimes / 500))),
            fillColor: markerColor,
            color: d.is_commissionerate ? "#c084fc" : "#ffffff",
            weight: d.is_commissionerate ? 2.5 : 1.2,
            opacity: 0.95,
            fillOpacity: 0.8
        });

        const popupHtml = `
            <div class="popup-crime-header">
                <span class="popup-type">🏛️ ${d.district_name}</span>
                <span class="popup-badge badge-${d.badge_class}">${d.risk_tier}</span>
            </div>
            <div style="font-size: 0.76rem; color: #c084fc; margin-bottom: 6px; font-weight: 600;">${commTag} // ${d.state_ut}</div>
            <div class="popup-item">
                <span class="popup-item-label">Total IPC Crimes:</span>
                <span class="popup-item-val font-mono">${d.ipc_crimes.toLocaleString()}</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Crime Rate (per 1L):</span>
                <span class="popup-item-val font-mono text-sky">${d.crime_rate_per_lakh}</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Chargesheet Rate:</span>
                <span class="popup-item-val font-mono text-emerald">${d.chargesheet_rate}%</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Violent Offenses:</span>
                <span class="popup-item-val font-mono text-danger">${d.violent_crimes.toLocaleString()}</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Reported Cybercrimes:</span>
                <span class="popup-item-val font-mono text-warning">${d.cyber_crimes.toLocaleString()}</span>
            </div>
            <div class="popup-item">
                <span class="popup-item-label">Safety Score:</span>
                <span class="popup-item-val font-mono text-emerald">${d.safety_index} / 100</span>
            </div>
            <div style="margin-top: 8px;">
                <button type="button" class="btn btn-primary btn-sm btn-popup-inspect-dist" style="width: 100%;">Inspect District Dossier</button>
            </div>
        `;
        marker.bindPopup(popupHtml);
        marker.on("popupopen", () => {
            const btn = document.querySelector(".btn-popup-inspect-dist");
            if (btn) btn.onclick = () => showEntityModal(d, "district");
        });

        indiaState.districtsLayer.addLayer(marker);
    });

    // Populate Sidebar chips
    renderGisChips(indiaState.statesData, false);

    // Populate Metro City chips
    const cityChipsContainer = document.getElementById("india-city-chips");
    if (cityChipsContainer) {
        cityChipsContainer.innerHTML = "";
        indiaState.citiesData.forEach(c => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "district-chip";
            chip.textContent = c.city;
            chip.addEventListener("click", () => {
                if (indiaState.map) indiaState.map.flyTo([c.lat, c.lng], 10, { duration: 1.0 });
            });
            cityChipsContainer.appendChild(chip);
        });
    }
}

/**
 * Locate Entity (State or District) on Leaflet Map
 */
function locateEntityOnMap(entity, type = "state") {
    const tabGis = document.getElementById("tab-gis");
    if (tabGis) tabGis.click();

    setTimeout(() => {
        if (!indiaState.map) initIndiaMap();

        if (type === "district") {
            setGisLayer("districts");
            indiaState.map.flyTo([entity.lat, entity.lng], 10, { duration: 1.2 });

            // Automatically find and open marker popup
            setTimeout(() => {
                if (indiaState.districtsLayer) {
                    indiaState.districtsLayer.eachLayer(layer => {
                        const latLng = layer.getLatLng ? layer.getLatLng() : null;
                        if (latLng && Math.abs(latLng.lat - entity.lat) < 0.02 && Math.abs(latLng.lng - entity.lng) < 0.02) {
                            layer.openPopup();
                        }
                    });
                }
            }, 1300);
        } else {
            setGisLayer("states");
            indiaState.map.flyTo([entity.lat, entity.lng], 7, { duration: 1.2 });

            setTimeout(() => {
                if (indiaState.statesLayer) {
                    indiaState.statesLayer.eachLayer(layer => {
                        const latLng = layer.getLatLng ? layer.getLatLng() : null;
                        if (latLng && Math.abs(latLng.lat - entity.lat) < 0.05 && Math.abs(latLng.lng - entity.lng) < 0.05) {
                            layer.openPopup();
                        }
                    });
                }
            }, 1300);
        }
    }, 200);
}

/**
 * Render State Explorer Table
 */
function renderExplorerTable(states) {
    const tbody = document.getElementById("tbody-india-states");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (states.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--text-muted); padding: 20px;">No matching Indian States or UTs found. Try clearing your filters or search terms.</td></tr>`;
        return;
    }

    states.forEach(st => {
        const distCount = indiaState.districtsData ? indiaState.districtsData.filter(d => d.state_ut === st.state_ut).length : 0;
        const isSelected = indiaState.filters.state === st.state_ut;

        const tr = document.createElement("tr");
        if (isSelected) tr.className = "row-highlight";

        tr.innerHTML = `
            <td><strong>${st.state_ut}</strong> ${isSelected ? '<span class="badge-pill badge-primary" style="font-size: 0.65rem; margin-left: 4px;">FILTERED</span>' : ''}</td>
            <td><span class="text-secondary">${st.capital}</span></td>
            <td><span class="badge-pill badge-info">${st.zone}</span></td>
            <td class="font-mono">${st.population_lakhs}L</td>
            <td class="font-mono">${st.ipc_crimes.toLocaleString()}</td>
            <td class="font-mono text-danger">${st.violent_crimes.toLocaleString()}</td>
            <td class="font-mono text-warning">${st.cyber_crimes.toLocaleString()}</td>
            <td class="font-mono text-amber">${st.crimes_against_women.toLocaleString()}</td>
            <td class="font-mono text-emerald"><strong>${(st.chargesheets_filed || Math.round((st.ipc_crimes || 0) * (st.chargesheet_rate || 0) / 100)).toLocaleString()}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${st.chargesheet_rate}%)</span></td>
            <td class="font-mono text-sky">${st.crime_rate_per_lakh}</td>
            <td style="white-space: nowrap;">
                <button type="button" class="btn btn-outline btn-sm btn-inspect-state" data-state="${st.state_ut}" style="padding: 4px 8px; font-size: 0.75rem;">
                    Inspect
                </button>
                <button type="button" class="btn btn-secondary btn-sm btn-view-state-districts" data-state="${st.state_ut}" style="padding: 4px 8px; font-size: 0.75rem; margin-left: 4px;" title="View all ${distCount} districts in ${st.state_ut}">
                    🏛️ Districts (${distCount})
                </button>
            </td>
        `;

        tr.querySelector(".btn-inspect-state").addEventListener("click", () => {
            showEntityModal(st, "state");
        });

        tr.querySelector(".btn-view-state-districts").addEventListener("click", () => {
            indiaState.filters.state = st.state_ut;
            indiaState.filters.district = "";

            const stateSelect = document.getElementById("filter-state");
            if (stateSelect) stateSelect.value = st.state_ut;

            const filterDistrictState = document.getElementById("filter-district-state");
            if (filterDistrictState) filterDistrictState.value = st.state_ut;

            const gisFilter = document.getElementById("gis-state-filter");
            if (gisFilter) gisFilter.value = st.state_ut;

            populateDistrictDropdown(st.state_ut);
            switchToExplorerDistrictsView();
            applyAllFilters();
        });

        tbody.appendChild(tr);
    });
}

/**
 * Render Districts Explorer Table
 */
function renderExplorerDistrictsTable(districts) {
    const tbody = document.getElementById("tbody-india-districts");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (districts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="13" style="text-align: center; color: var(--text-muted); padding: 20px;">No matching Indian Districts found. Try adjusting your filters or search terms.</td></tr>`;
        return;
    }

    districts.forEach(d => {
        const isSelected = indiaState.filters.district === d.district_name;
        const commBadge = d.is_commissionerate ? `<span class="badge-comm">COMMISSIONERATE</span>` : `<span class="text-muted" style="font-size: 0.75rem;">District Police</span>`;

        const tr = document.createElement("tr");
        if (isSelected) tr.className = "row-highlight";

        tr.innerHTML = `
            <td><strong>${d.district_name}</strong> ${isSelected ? '<span class="badge-pill badge-primary" style="font-size: 0.65rem; margin-left: 4px;">ACTIVE</span>' : ''}</td>
            <td><span class="text-secondary">${d.state_ut}</span></td>
            <td><span class="text-secondary">${d.headquarters}</span></td>
            <td>${commBadge}</td>
            <td class="font-mono">${d.population_lakhs}L</td>
            <td class="font-mono">${d.ipc_crimes.toLocaleString()}</td>
            <td class="font-mono text-danger">${d.violent_crimes.toLocaleString()}</td>
            <td class="font-mono text-warning">${d.cyber_crimes.toLocaleString()}</td>
            <td class="font-mono text-emerald"><strong>${(d.chargesheets_filed || Math.round((d.ipc_crimes || 0) * (d.chargesheet_rate || 0) / 100)).toLocaleString()}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${d.chargesheet_rate}%)</span></td>
            <td class="font-mono text-sky">${d.crime_rate_per_lakh}</td>
            <td><strong class="text-emerald font-mono">${d.safety_index}</strong></td>
            <td><span class="badge-pill badge-${d.badge_class}">${d.risk_tier}</span></td>
            <td style="white-space: nowrap;">
                <button type="button" class="btn btn-outline btn-sm btn-inspect-dist" style="padding: 4px 8px; font-size: 0.75rem;">
                    Inspect
                </button>
                <button type="button" class="btn btn-secondary btn-sm btn-locate-dist" style="padding: 4px 8px; font-size: 0.75rem; margin-left: 4px;" title="View on GIS Map">
                    📍 Map
                </button>
            </td>
        `;

        tr.querySelector(".btn-inspect-dist").addEventListener("click", () => {
            showEntityModal(d, "district");
        });

        tr.querySelector(".btn-locate-dist").addEventListener("click", () => {
            locateEntityOnMap(d, "district");
        });

        tbody.appendChild(tr);
    });
}

/**
 * Fetch and Render Live CCTNS & NCRB Incident FIR Dispatches
 */
async function loadIndiaIncidents(page = 1) {
    indiaState.incidentsPage = page;
    const tbody = document.getElementById("tbody-india-incidents");
    const countEl = document.getElementById("india-explorer-count");
    const pageInfo = document.getElementById("incidents-page-info");
    const btnPrev = document.getElementById("btn-incidents-prev");
    const btnNext = document.getElementById("btn-incidents-next");

    const searchInput = document.getElementById("search-india-input");
    const term = searchInput ? searchInput.value.trim() : "";

    const catSelect = document.getElementById("filter-incident-cat");
    const arrestSelect = document.getElementById("filter-incident-arrest");
    const csSelect = document.getElementById("filter-incident-chargesheet");

    const params = new URLSearchParams();
    params.set("page", page);
    params.set("page_size", "50");

    if (indiaState.filters.state && indiaState.filters.state !== "all") {
        params.set("state", indiaState.filters.state);
    }
    if (indiaState.filters.district) {
        params.set("district", indiaState.filters.district);
    }
    if (term) {
        params.set("search", term);
    }
    if (catSelect && catSelect.value) {
        params.set("category", catSelect.value);
    }
    if (arrestSelect && arrestSelect.value !== "") {
        params.set("arrest", arrestSelect.value);
    }
    if (csSelect && csSelect.value !== "") {
        params.set("chargesheet", csSelect.value);
    }

    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--text-muted); padding: 30px;"><div class="spinner" style="margin: 0 auto 10px;"></div>Loading authentic CCTNS & NCRB live incidents...</td></tr>`;
    }

    try {
        const res = await fetch(`/api/india/incidents?${params.toString()}`);
        const data = await res.json();

        indiaState.incidentsTotalPages = data.total_pages || 1;
        indiaState.incidentsTotalCount = data.total || 0;

        // Update Topbar status badge with true incident count
        const headerCountEl = document.getElementById("india-header-total-count");
        if (headerCountEl) {
            headerCountEl.textContent = Number(data.total || 0).toLocaleString();
        }

        if (countEl) {
            countEl.textContent = `${(data.total || 0).toLocaleString()} Verified Incidents Documented ${indiaState.filters.state ? 'in ' + indiaState.filters.state : 'Nationwide'}`;
        }

        if (pageInfo) {
            pageInfo.textContent = `Showing page ${data.page} of ${data.total_pages} (${(data.total || 0).toLocaleString()} total incidents)`;
        }

        if (btnPrev) btnPrev.disabled = data.page <= 1;
        if (btnNext) btnNext.disabled = data.page >= data.total_pages;

        renderExplorerIncidentsTable(data.incidents || []);
    } catch (err) {
        console.error("Error loading India incidents:", err);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--accent-crimson); padding: 20px;">Failed to load incidents: ${err.message}</td></tr>`;
        }
    }
}

/**
 * Render Incident Rows in the Incidents Explorer Table
 */
function renderExplorerIncidentsTable(incidents) {
    const tbody = document.getElementById("tbody-india-incidents");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (!incidents || incidents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align: center; color: var(--text-muted); padding: 25px;">No incidents matching the current search & filters. Click "Sync Live Data" to ingest fresh dispatches.</td></tr>`;
        return;
    }

    incidents.forEach(inc => {
        const tr = document.createElement("tr");

        const violentBadge = inc.is_violent 
            ? `<span class="badge-pill badge-danger">VIOLENT</span>`
            : `<span class="badge-pill badge-secondary" style="opacity: 0.7;">NON-VIOLENT</span>`;

        const arrestBadge = inc.arrest
            ? `<span class="badge-pill badge-success" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);">IN CUSTODY</span>`
            : `<span class="badge-pill badge-warning" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);">AT LARGE</span>`;

        const csBadge = inc.chargesheet_filed
            ? `<span class="badge-pill badge-info" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4; border: 1px solid rgba(6, 182, 212, 0.3);">FILED</span>`
            : `<span class="badge-pill badge-secondary" style="opacity: 0.7;">PENDING</span>`;

        tr.innerHTML = `
            <td><strong style="font-family: var(--font-mono); color: var(--accent-saffron); font-size: 0.8rem;">${inc.fir_number || inc.id}</strong></td>
            <td style="white-space: nowrap; font-size: 0.8rem;" class="font-mono text-secondary">${inc.date || '--'}</td>
            <td><strong>${inc.state_ut || '--'}</strong></td>
            <td>${inc.district || '--'}</td>
            <td><span class="text-secondary" style="font-size: 0.82rem;">${inc.police_station || '--'}</span></td>
            <td>
                <div><strong style="font-size: 0.82rem;">${inc.offense_category || '--'}</strong></div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${inc.ipc_section || ''}</div>
            </td>
            <td>${violentBadge}</td>
            <td>${arrestBadge}</td>
            <td>${csBadge}</td>
            <td style="font-size: 0.8rem; color: var(--text-secondary);">${inc.investigating_officer || '--'}</td>
            <td><span class="badge-pill badge-primary" style="font-size: 0.72rem;">${inc.status || 'Active'}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Render Police District Intelligence & Crime Roster on the Overview View
 */
function renderOverviewDistrictsTable(districts) {
    const tbody = document.getElementById("tbody-overview-districts");
    const heading = document.getElementById("overview-district-heading");
    const subtitle = document.getElementById("overview-district-subtitle");
    if (!tbody) return;

    tbody.innerHTML = "";

    const f = indiaState.filters;
    if (f.state) {
        if (heading) heading.textContent = `Police District Intelligence & Crime Roster // State of ${f.state}`;
        if (subtitle) subtitle.textContent = `${districts.length} Police Districts & Commissionerates cataloged in ${f.state}`;
    } else if (f.district) {
        if (heading) heading.textContent = `Police District Intelligence & Crime Roster // ${f.district} Highlighted`;
        if (subtitle) subtitle.textContent = `Jurisdiction dossier profile in ${districts[0]?.state_ut || 'India'}`;
    } else if (f.search) {
        if (heading) heading.textContent = `Police District Intelligence & Crime Roster // Search: "${escapeHtml(f.search)}"`;
        if (subtitle) subtitle.textContent = `Matched ${districts.length} Districts across India`;
    } else {
        if (heading) heading.textContent = "Police District Intelligence & Crime Roster";
        if (subtitle) subtitle.textContent = `All 36 States & UTs (${districts.length} Districts cataloged) • Select a State or District to filter`;
    }

    if (!districts || districts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; color: var(--text-muted); padding: 24px;">No districts found matching current filter criteria.</td></tr>`;
        return;
    }

    districts.forEach(d => {
        const isSelected = f.district === d.district_name;
        const commBadge = d.is_commissionerate 
            ? `<span class="badge-comm">COMMISSIONERATE</span>` 
            : `<span class="text-muted" style="font-size: 0.75rem;">District Police</span>`;

        const tr = document.createElement("tr");
        if (isSelected) tr.className = "row-highlight";

        tr.innerHTML = `
            <td>
                <strong>${escapeHtml(d.district_name)}</strong>
                ${isSelected ? '<span class="badge-pill badge-primary" style="font-size: 0.65rem; margin-left: 4px;">ACTIVE</span>' : ''}
            </td>
            <td><span class="text-sky">${escapeHtml(d.state_ut)}</span></td>
            <td><span class="text-secondary">${escapeHtml(d.headquarters)}</span></td>
            <td>${commBadge}</td>
            <td class="font-mono">${(d.population_lakhs || 0)}L</td>
            <td class="font-mono">${(d.ipc_crimes || 0).toLocaleString()}</td>
            <td class="font-mono text-danger">${(d.violent_crimes || 0).toLocaleString()}</td>
            <td class="font-mono text-emerald"><strong>${(d.chargesheets_filed || Math.round((d.ipc_crimes || 0) * (d.chargesheet_rate || 0) / 100)).toLocaleString()}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${d.chargesheet_rate || 0}%)</span></td>
            <td class="font-mono text-sky">${d.crime_rate_per_lakh || 0}</td>
            <td class="font-mono text-emerald">${d.safety_index || 0}</td>
            <td><span class="badge-pill badge-${d.badge_class || 'info'}">${d.risk_tier || 'Normal'}</span></td>
            <td style="white-space: nowrap;">
                <button type="button" class="btn btn-outline btn-sm btn-ovw-inspect-dist" style="padding: 3px 8px; font-size: 0.75rem;">
                    Inspect
                </button>
                <button type="button" class="btn btn-secondary btn-sm btn-ovw-locate-dist" style="padding: 3px 8px; font-size: 0.75rem; margin-left: 4px;" title="View on GIS Map">
                    📍 GIS
                </button>
            </td>
        `;

        tr.querySelector(".btn-ovw-inspect-dist").addEventListener("click", () => {
            showEntityModal(d, "district");
        });

        tr.querySelector(".btn-ovw-locate-dist").addEventListener("click", () => {
            locateEntityOnMap(d, "district");
        });

        tbody.appendChild(tr);
    });
}

/**
 * Render Safety Index Table for States
 */
function renderSafetyTable(states) {
    const tbody = document.getElementById("tbody-india-safety");
    if (!tbody) return;

    tbody.innerHTML = "";
    const sorted = [...states].sort((a, b) => b.threat_score - a.threat_score);

    sorted.forEach(st => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${st.state_ut}</strong> <small class="text-secondary">(${st.capital})</small></td>
            <td><span class="badge-pill badge-info">${st.zone}</span></td>
            <td class="font-mono">${st.ipc_crimes.toLocaleString()}</td>
            <td class="font-mono text-danger">${round((st.violent_crimes / st.ipc_crimes) * 100, 1)}%</td>
            <td class="font-mono text-emerald"><strong>${(st.chargesheets_filed || Math.round((st.ipc_crimes || 0) * (st.chargesheet_rate || 0) / 100)).toLocaleString()}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${st.chargesheet_rate}%)</span></td>
            <td class="font-mono text-sky">${st.crime_rate_per_lakh}</td>
            <td><strong class="text-danger">${st.threat_score}</strong></td>
            <td><strong class="text-emerald">${st.safety_index} / 100</strong></td>
            <td><span class="badge-pill badge-${st.badge_class}">${st.risk_tier}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Render Safety Index Table for Districts
 */
function renderDistrictSafetyTable(districts) {
    const tbody = document.getElementById("tbody-india-district-safety");
    if (!tbody) return;

    tbody.innerHTML = "";
    const sorted = [...districts].sort((a, b) => b.threat_score - a.threat_score);

    sorted.forEach(d => {
        const commPill = d.is_commissionerate ? `<span class="badge-comm">COMM</span>` : "";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${d.district_name}</strong> ${commPill}</td>
            <td><span class="text-secondary">${d.state_ut}</span></td>
            <td><span class="badge-pill badge-info">${d.zone}</span></td>
            <td class="font-mono">${d.ipc_crimes.toLocaleString()}</td>
            <td class="font-mono text-emerald"><strong>${(d.chargesheets_filed || Math.round((d.ipc_crimes || 0) * (d.chargesheet_rate || 0) / 100)).toLocaleString()}</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(${d.chargesheet_rate}%)</span></td>
            <td class="font-mono text-sky">${d.crime_rate_per_lakh}</td>
            <td><strong class="text-danger">${d.threat_score}</strong></td>
            <td><strong class="text-emerald">${d.safety_index} / 100</strong></td>
            <td><span class="badge-pill badge-${d.badge_class}">${d.risk_tier}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Universal Dossier Inspector Modal (States & Districts)
 */
function showEntityModal(entity, type = "state") {
    indiaState.activeEntity = entity;
    indiaState.activeEntityType = type;

    const modal = document.getElementById("modal-state-detail");
    const titleEl = document.getElementById("modal-state-title");
    const badgeEl = document.getElementById("modal-state-badge");
    const body = document.getElementById("modal-state-body");

    if (type === "district") {
        const commTag = entity.is_commissionerate ? "POLICE COMMISSIONERATE" : "DISTRICT POLICE";
        titleEl.textContent = `🏛️ ${entity.district_name} (${entity.state_ut})`;
        badgeEl.textContent = `${commTag} // ${entity.zone.toUpperCase()} ZONE`;

        body.innerHTML = `
            <div class="modal-grid">
                <div class="modal-field">
                    <span class="modal-field-label">District & State</span>
                    <span class="modal-field-value">${entity.district_name}, ${entity.state_ut}</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Administrative Headquarters</span>
                    <span class="modal-field-value">${entity.headquarters}</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Jurisdiction Type</span>
                    <span class="modal-field-value">${entity.is_commissionerate ? '<span class="badge-comm">POLICE COMMISSIONERATE</span>' : 'Standard SP District'}</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Estimated Population</span>
                    <span class="modal-field-value font-mono">${entity.population_lakhs} Lakhs</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Total Registered IPC Crimes</span>
                    <span class="modal-field-value font-mono">${entity.ipc_crimes.toLocaleString()} Incidents</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Crime Rate per 1 Lakh</span>
                    <span class="modal-field-value font-mono text-sky">${entity.crime_rate_per_lakh}</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Chargesheets Filed (Sec 173 CrPC)</span>
                    <span class="modal-field-value font-mono text-emerald">${(entity.chargesheets_filed || Math.round((entity.ipc_crimes || 0) * (entity.chargesheet_rate || 0) / 100)).toLocaleString()} Cases (${entity.chargesheet_rate}% Rate)</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Violent Crime Volume</span>
                    <span class="modal-field-value font-mono text-danger">${entity.violent_crimes.toLocaleString()} Cases</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Cybercrime Offenses</span>
                    <span class="modal-field-value font-mono text-warning">${entity.cyber_crimes.toLocaleString()} Cases</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Crimes Against Women</span>
                    <span class="modal-field-value font-mono text-amber">${entity.crimes_against_women ? entity.crimes_against_women.toLocaleString() : 'N/A'} Cases</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Composite Safety Score</span>
                    <span class="modal-field-value font-mono text-emerald" style="font-size: 1.1rem;">${entity.safety_index} / 100</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Threat Classification</span>
                    <span class="modal-field-value"><span class="badge-pill badge-${entity.badge_class}">${entity.risk_tier} (Threat Index: ${entity.threat_score})</span></span>
                </div>
                <div class="modal-field" style="grid-column: span 2;">
                    <span class="modal-field-label">District Centroid GIS Coordinates</span>
                    <span class="modal-field-value text-sky font-mono">${entity.lat}° N, ${entity.lng}° E</span>
                </div>
            </div>
        `;
    } else {
        titleEl.textContent = `🇮🇳 ${entity.state_ut} (${entity.capital})`;
        badgeEl.textContent = `${entity.category.toUpperCase()} // ${entity.zone.toUpperCase()} ZONE`;

        // Find districts belonging to this state
        const stateDistricts = indiaState.districtsData ? indiaState.districtsData.filter(d => d.state_ut === entity.state_ut) : [];
        let districtChipsHtml = "";
        stateDistricts.forEach(d => {
            districtChipsHtml += `<button type="button" class="btn btn-outline btn-sm btn-modal-dist-chip" data-name="${d.district_name}" style="padding: 3px 8px; font-size: 0.72rem; margin: 2px;">🏛️ ${d.district_name}</button>`;
        });

        body.innerHTML = `
            <div class="modal-grid">
                <div class="modal-field">
                    <span class="modal-field-label">Jurisdiction & Category</span>
                    <span class="modal-field-value">${entity.state_ut} (${entity.category})</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Capital & Regional Zone</span>
                    <span class="modal-field-value">${entity.capital} // ${entity.zone} Zone</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Resident Population</span>
                    <span class="modal-field-value font-mono">${entity.population_lakhs} Lakhs (${round(entity.population_lakhs / 100, 2)} Cr)</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Total Registered IPC Crimes</span>
                    <span class="modal-field-value font-mono">${entity.ipc_crimes.toLocaleString()} Incidents</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Crime Rate per 1 Lakh</span>
                    <span class="modal-field-value font-mono text-sky">${entity.crime_rate_per_lakh}</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Chargesheets Filed (Sec 173 CrPC)</span>
                    <span class="modal-field-value font-mono text-emerald">${(entity.chargesheets_filed || Math.round((entity.ipc_crimes || 0) * (entity.chargesheet_rate || 0) / 100)).toLocaleString()} Cases (${entity.chargesheet_rate}% Rate)</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Violent Crime Volume</span>
                    <span class="modal-field-value font-mono text-danger">${entity.violent_crimes.toLocaleString()} Cases</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Reported Cybercrimes</span>
                    <span class="modal-field-value font-mono text-warning">${entity.cyber_crimes.toLocaleString()} Incidents</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Crimes Against Women</span>
                    <span class="modal-field-value font-mono text-amber">${entity.crimes_against_women.toLocaleString()} Cases</span>
                </div>
                <div class="modal-field">
                    <span class="modal-field-label">Threat Classification</span>
                    <span class="modal-field-value"><span class="badge-pill badge-${entity.badge_class}">${entity.risk_tier} (Threat Index: ${entity.threat_score})</span></span>
                </div>
                <div class="modal-field" style="grid-column: span 2;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span class="modal-field-label">Tracked Police Districts & Commissionerates (${stateDistricts.length})</span>
                        <button type="button" class="btn btn-primary btn-sm" id="btn-modal-explore-districts" style="padding: 2px 10px; font-size: 0.72rem;">
                            🏛️ Explore Districts in ${entity.state_ut} &rarr;
                        </button>
                    </div>
                    <div style="max-height: 120px; overflow-y: auto; display: flex; flex-wrap: wrap; gap: 4px; padding: 6px; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                        ${districtChipsHtml || '<span class="text-muted" style="font-size: 0.8rem; padding: 4px;">No individual districts cataloged</span>'}
                    </div>
                </div>
                <div class="modal-field" style="grid-column: span 2;">
                    <span class="modal-field-label">State Centroid GIS Coordinates</span>
                    <span class="modal-field-value text-sky font-mono">${entity.lat}° N, ${entity.lng}° E</span>
                </div>
            </div>
        `;

        // Wire district chip clicks in modal
        body.querySelectorAll(".btn-modal-dist-chip").forEach(chip => {
            chip.addEventListener("click", () => {
                const distName = chip.getAttribute("data-name");
                const distObj = indiaState.districtsData.find(d => d.district_name === distName);
                if (distObj) {
                    showEntityModal(distObj, "district");
                }
            });
        });

        const btnExplore = body.querySelector("#btn-modal-explore-districts");
        if (btnExplore) {
            btnExplore.addEventListener("click", () => {
                modal.classList.remove("active");
                modal.setAttribute("aria-hidden", "true");

                indiaState.filters.state = entity.state_ut;
                indiaState.filters.district = "";

                const stateSelect = document.getElementById("filter-state");
                if (stateSelect) stateSelect.value = entity.state_ut;

                const explorerStateFilter = document.getElementById("filter-district-state");
                if (explorerStateFilter) explorerStateFilter.value = entity.state_ut;

                const gisFilter = document.getElementById("gis-state-filter");
                if (gisFilter) gisFilter.value = entity.state_ut;

                populateDistrictDropdown(entity.state_ut);

                const tabExplorer = document.getElementById("tab-explorer");
                if (tabExplorer) tabExplorer.click();

                switchToExplorerDistrictsView();
                applyAllFilters();
            });
        }
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

/**
 * Populate National Security Briefing
 */
function populateBriefing(summary, states) {
    document.getElementById("india-briefing-time").textContent = new Date().toLocaleString();

    document.getElementById("india-briefing-summary").innerHTML = `
        Across all <strong>${summary.total_states_tracked} States & Union Territories</strong> representing 
        <strong>${summary.total_population_represented_crores} Crore citizens</strong> and over <strong>${summary.total_districts_tracked || 780} Police Districts</strong>, a national total of 
        <strong>${summary.national_ipc_crimes.toLocaleString()} cognizable IPC crimes</strong> are cataloged. 
        Violent offenses comprise <strong>${summary.violent_crime_percentage}%</strong> (${summary.national_violent_crimes.toLocaleString()} cases), 
        while police prosecution clearance (chargesheeting) maintains a healthy national average of 
        <strong>${summary.national_avg_chargesheet_rate}%</strong>. The highest reporting density occurs in 
        <strong>${summary.top_crime_rate_jurisdiction.state}</strong> (${summary.top_crime_rate_jurisdiction.rate} per 1L).
    `;

    const hotspotContainer = document.getElementById("india-briefing-hotspots");
    if (hotspotContainer) {
        hotspotContainer.innerHTML = "";
        const top3 = [...states].sort((a, b) => b.threat_score - a.threat_score).slice(0, 3);
        top3.forEach(h => {
            const card = document.createElement("div");
            card.className = "hotspot-card";
            card.innerHTML = `
                <div class="h-name">${h.state_ut} (${h.capital})</div>
                <div class="h-sub">${h.ipc_crimes.toLocaleString()} crimes // Rate: ${h.crime_rate_per_lakh}/1L</div>
                <div class="h-score">Threat Score: ${h.threat_score} / 100 (${h.risk_tier})</div>
            `;
            hotspotContainer.appendChild(card);
        });
    }
}

/* ==========================================================================
   Chart Rendering Functions
   ========================================================================== */

function renderRateChart(states) {
    const ctx = document.getElementById("chart-india-rate");
    if (!ctx) return;

    if (indiaState.charts.rate) indiaState.charts.rate.destroy();

    const sorted = [...states].sort((a, b) => b.crime_rate_per_lakh - a.crime_rate_per_lakh).slice(0, 14);
    const labels = sorted.map(s => s.state_ut);
    const rates = sorted.map(s => s.crime_rate_per_lakh);

    indiaState.charts.rate = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Crime Rate per 1 Lakh Population",
                data: rates,
                backgroundColor: rates.map(r => r > 600 ? "rgba(239, 68, 68, 0.8)" : "rgba(251, 146, 60, 0.75)"),
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, maxRotation: 45 } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } }
            }
        }
    });
}

function renderCategoriesDonut(categories) {
    const ctx = document.getElementById("chart-india-categories");
    if (!ctx) return;

    if (indiaState.charts.categories) indiaState.charts.categories.destroy();

    const palette = [CHART_COLORS.saffron, CHART_COLORS.crimson, CHART_COLORS.amber, CHART_COLORS.sky, CHART_COLORS.purple, "#64748b"];

    indiaState.charts.categories = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: categories.map(c => c.name),
            datasets: [{
                data: categories.map(c => c.count),
                backgroundColor: palette,
                borderColor: "#0f172a",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: { color: CHART_COLORS.text, boxWidth: 12, font: { size: 10 } }
                }
            },
            cutout: "68%"
        }
    });
}

function renderChargesheetChart(states) {
    const ctx = document.getElementById("chart-india-chargesheet");
    if (!ctx) return;

    if (indiaState.charts.chargesheet) indiaState.charts.chargesheet.destroy();

    const sorted = [...states].sort((a, b) => b.chargesheet_rate - a.chargesheet_rate).slice(0, 12);
    const labels = sorted.map(s => s.state_ut);
    const rates = sorted.map(s => s.chargesheet_rate);

    indiaState.charts.chargesheet = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Police Chargesheet Clearance Rate (%)",
                data: rates,
                backgroundColor: "rgba(16, 185, 129, 0.75)",
                borderColor: CHART_COLORS.emerald,
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, maxRotation: 45 } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text }, max: 100 }
            }
        }
    });
}

function renderRateChartForDistricts(districts, stateName, highlightDistrict = "") {
    const ctx = document.getElementById("chart-india-rate");
    if (!ctx) return;

    if (indiaState.charts.rate) indiaState.charts.rate.destroy();

    const sorted = [...districts].sort((a, b) => b.crime_rate_per_lakh - a.crime_rate_per_lakh).slice(0, 14);
    const labels = sorted.map(d => d.district_name);
    const rates = sorted.map(d => d.crime_rate_per_lakh);

    const backgroundColors = sorted.map(d => {
        if (highlightDistrict && d.district_name === highlightDistrict) {
            return "rgba(56, 189, 248, 0.95)";
        }
        return d.crime_rate_per_lakh > 500 ? "rgba(239, 68, 68, 0.8)" : "rgba(251, 146, 60, 0.75)";
    });

    indiaState.charts.rate = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: `Crime Rate per 1L (${stateName})`,
                data: rates,
                backgroundColor: backgroundColors,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, maxRotation: 45 } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } }
            }
        }
    });
}

function renderCategoriesDonutForState(st) {
    const ctx = document.getElementById("chart-india-categories");
    if (!ctx) return;

    if (indiaState.charts.categories) indiaState.charts.categories.destroy();

    const violent = st.violent_crimes || 0;
    const cyber = st.cyber_crimes || 0;
    const women = st.crimes_against_women || 0;
    const propertyAndOther = Math.max(0, (st.ipc_crimes || 0) - violent - cyber - women);

    const dataValues = [violent, cyber, women, propertyAndOther];
    const dataLabels = ["Violent Offenses", "Cybercrime Offenses", "Crimes vs Women", "Property & Other"];
    const colors = [CHART_COLORS.crimson, CHART_COLORS.amber, CHART_COLORS.saffron, CHART_COLORS.sky];

    indiaState.charts.categories = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: dataLabels,
            datasets: [{
                data: dataValues,
                backgroundColor: colors,
                borderColor: "#0f172a",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: { color: CHART_COLORS.text, boxWidth: 12, font: { size: 10 } }
                }
            },
            cutout: "68%"
        }
    });
}

function renderCategoriesDonutForDistrict(dist) {
    const ctx = document.getElementById("chart-india-categories");
    if (!ctx) return;

    if (indiaState.charts.categories) indiaState.charts.categories.destroy();

    const violent = dist.violent_crimes || 0;
    const cyber = dist.cyber_crimes || 0;
    const women = dist.crimes_against_women || 0;
    const propertyAndOther = Math.max(0, (dist.ipc_crimes || 0) - violent - cyber - women);

    const dataValues = [violent, cyber, women, propertyAndOther];
    const dataLabels = ["Violent Offenses", "Cybercrime Offenses", "Crimes vs Women", "Property & Other"];
    const colors = [CHART_COLORS.crimson, CHART_COLORS.amber, CHART_COLORS.saffron, CHART_COLORS.sky];

    indiaState.charts.categories = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: dataLabels,
            datasets: [{
                data: dataValues,
                backgroundColor: colors,
                borderColor: "#0f172a",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: { color: CHART_COLORS.text, boxWidth: 12, font: { size: 10 } }
                }
            },
            cutout: "68%"
        }
    });
}

function renderChargesheetChartForDistricts(districts, stateName) {
    const ctx = document.getElementById("chart-india-chargesheet");
    if (!ctx) return;

    if (indiaState.charts.chargesheet) indiaState.charts.chargesheet.destroy();

    const sorted = [...districts].sort((a, b) => b.chargesheet_rate - a.chargesheet_rate).slice(0, 14);
    const labels = sorted.map(d => d.district_name);
    const rates = sorted.map(d => d.chargesheet_rate);

    indiaState.charts.chargesheet = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: `Chargesheet Rate % (${stateName})`,
                data: rates,
                backgroundColor: "rgba(16, 185, 129, 0.75)",
                borderColor: CHART_COLORS.emerald,
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, maxRotation: 45 } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text }, min: 0, max: 100 }
            }
        }
    });
}

function renderCitiesChart(cities) {
    const ctx = document.getElementById("chart-india-cities");
    if (!ctx) return;

    if (indiaState.charts.cities) indiaState.charts.cities.destroy();

    // Select top 12 mega-cities sorted by IPC crime volume for clean presentation
    const topCities = [...cities].sort((a, b) => (b.ipc_crimes || 0) - (a.ipc_crimes || 0)).slice(0, 12);

    indiaState.charts.cities = new Chart(ctx, {
        type: "bar",
        data: {
            labels: topCities.map(c => c.city),
            datasets: [{
                label: "Total IPC Crimes",
                data: topCities.map(c => c.ipc_crimes),
                backgroundColor: "rgba(56, 189, 248, 0.75)",
                borderColor: CHART_COLORS.sky,
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 10 }, maxRotation: 45 } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } }
            }
        }
    });
}

function renderZonesChart(states) {
    const ctx = document.getElementById("chart-india-zones");
    if (!ctx) return;

    if (indiaState.charts.zones) indiaState.charts.zones.destroy();

    const zoneMap = {};
    states.forEach(s => {
        zoneMap[s.zone] = (zoneMap[s.zone] || 0) + s.ipc_crimes;
    });

    const labels = Object.keys(zoneMap);
    const data = Object.values(zoneMap);

    indiaState.charts.zones = new Chart(ctx, {
        type: "polarArea",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    "rgba(251, 146, 60, 0.65)",
                    "rgba(56, 189, 248, 0.65)",
                    "rgba(16, 185, 129, 0.65)",
                    "rgba(239, 68, 68, 0.65)",
                    "rgba(168, 85, 247, 0.65)",
                    "rgba(245, 158, 11, 0.65)",
                    "rgba(6, 182, 212, 0.65)"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "right", labels: { color: CHART_COLORS.text, boxWidth: 10, font: { size: 10 } } }
            },
            scales: {
                r: { grid: { color: CHART_COLORS.grid }, ticks: { display: false } }
            }
        }
    });
}

function renderCyberRankingChart(states) {
    const ctx = document.getElementById("chart-india-cyber-ranking");
    if (!ctx) return;

    if (indiaState.charts.cyber) indiaState.charts.cyber.destroy();

    const sorted = [...states].sort((a, b) => b.cyber_crimes - a.cyber_crimes).slice(0, 10);
    const labels = sorted.map(s => s.state_ut);
    const cyberCounts = sorted.map(s => s.cyber_crimes);

    indiaState.charts.cyber = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Annual Reported Cybercrimes",
                data: cyberCounts,
                backgroundColor: "rgba(168, 85, 247, 0.75)",
                borderColor: CHART_COLORS.purple,
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text, font: { size: 9 }, maxRotation: 45 } },
                y: { grid: { color: CHART_COLORS.grid }, ticks: { color: CHART_COLORS.text } }
            }
        }
    });
}

function round(val, decimals = 1) {
    return Number(Math.round(val + 'e' + decimals) + 'e-' + decimals);
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================================
   WOMEN SAFETY & LONGITUDINAL CRIME TRENDS (2001-2014) CONTROLLER
   ========================================================================= */

const womenState = {
    year: "",
    state: "",
    search: "",
    offense: "total_crimes",
    statesSort: "total_crimes",
    tableSort: "total_crimes",
    tableSortOrder: "desc",
    page: 1,
    limit: 25,
    totalRecords: 0,
    searchTimeout: null,
    loaded: false
};

function setupWomenControls() {
    const yearSelect = document.getElementById("women-filter-year");
    const stateSelect = document.getElementById("women-filter-state");
    const searchInput = document.getElementById("women-filter-search");
    const offenseSelect = document.getElementById("women-filter-offense");
    const resetBtn = document.getElementById("btn-women-filter-reset");
    const statesSortSelect = document.getElementById("women-states-sort");
    const tableSortSelect = document.getElementById("women-table-sort");
    const prevPageBtn = document.getElementById("btn-women-prev-page");
    const nextPageBtn = document.getElementById("btn-women-next-page");

    if (yearSelect) {
        yearSelect.addEventListener("change", () => {
            womenState.year = yearSelect.value;
            womenState.page = 1;
            loadWomenData();
        });
    }

    if (stateSelect) {
        stateSelect.addEventListener("change", () => {
            womenState.state = stateSelect.value;
            womenState.page = 1;
            loadWomenData();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            clearTimeout(womenState.searchTimeout);
            womenState.searchTimeout = setTimeout(() => {
                womenState.search = searchInput.value.trim();
                womenState.page = 1;
                fetchWomenDistricts();
            }, 250);
        });
    }

    if (offenseSelect) {
        offenseSelect.addEventListener("change", () => {
            womenState.offense = offenseSelect.value;
            womenState.tableSort = offenseSelect.value;
            if (tableSortSelect) tableSortSelect.value = offenseSelect.value;
            if (statesSortSelect && ["total_crimes", "cruelty_by_husband", "assault_on_women", "rape", "dowry_deaths", "kidnapping_abduction"].includes(offenseSelect.value)) {
                statesSortSelect.value = offenseSelect.value;
                womenState.statesSort = offenseSelect.value;
                fetchWomenStates();
            }
            womenState.page = 1;
            fetchWomenDistricts();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            womenState.year = "";
            womenState.state = "";
            womenState.search = "";
            womenState.offense = "total_crimes";
            womenState.statesSort = "total_crimes";
            womenState.tableSort = "total_crimes";
            womenState.page = 1;

            if (yearSelect) yearSelect.value = "";
            if (stateSelect) stateSelect.value = "";
            if (searchInput) searchInput.value = "";
            if (offenseSelect) offenseSelect.value = "total_crimes";
            if (statesSortSelect) statesSortSelect.value = "total_crimes";
            if (tableSortSelect) tableSortSelect.value = "total_crimes";

            loadWomenData();
        });
    }

    if (statesSortSelect) {
        statesSortSelect.addEventListener("change", () => {
            womenState.statesSort = statesSortSelect.value;
            fetchWomenStates();
        });
    }

    if (tableSortSelect) {
        tableSortSelect.addEventListener("change", () => {
            womenState.tableSort = tableSortSelect.value;
            womenState.page = 1;
            fetchWomenDistricts();
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => {
            if (womenState.page > 1) {
                womenState.page--;
                fetchWomenDistricts();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => {
            const maxPage = Math.ceil(womenState.totalRecords / womenState.limit);
            if (womenState.page < maxPage) {
                womenState.page++;
                fetchWomenDistricts();
            }
        });
    }
}

async function loadWomenData() {
    womenState.loaded = true;
    updateWomenExportLink();
    await Promise.all([
        fetchWomenSummary(),
        fetchWomenTemporalTrend(),
        fetchWomenCategories(),
        fetchWomenStates(),
        fetchWomenDistricts()
    ]);
}

function updateWomenExportLink() {
    const exportBtn = document.getElementById("btn-women-export-view");
    const topExportBtn = document.getElementById("btn-export-women");
    const params = new URLSearchParams();
    if (womenState.state) params.append("state", womenState.state);
    if (womenState.year) params.append("year", womenState.year);
    const url = `/api/india/women/export?${params.toString()}`;
    if (exportBtn) exportBtn.href = url;
    if (topExportBtn) topExportBtn.href = url;
}

async function fetchWomenSummary() {
    try {
        const params = new URLSearchParams();
        if (womenState.state) params.append("state", womenState.state);
        if (womenState.year) params.append("year", womenState.year);

        const res = await fetch(`/api/india/women/summary?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch summary");
        const data = await res.json();
        renderWomenKPIs(data);
    } catch (err) {
        console.error("fetchWomenSummary error:", err);
    }
}

function renderWomenKPIs(data) {
    const totalEl = document.getElementById("kpi-women-total");
    const growthEl = document.getElementById("kpi-women-growth");
    const scopeEl = document.getElementById("kpi-women-scope");
    const crueltyEl = document.getElementById("kpi-women-cruelty");
    const crueltyShareEl = document.getElementById("kpi-women-cruelty-share");
    const assaultEl = document.getElementById("kpi-women-assault");
    const assaultShareEl = document.getElementById("kpi-women-assault-share");
    const dowryEl = document.getElementById("kpi-women-dowry");
    const dowryShareEl = document.getElementById("kpi-women-dowry-share");

    if (totalEl) totalEl.textContent = (data.total_crimes || 0).toLocaleString();
    if (growthEl) {
        if (data.longitudinal_growth_pct) {
            growthEl.textContent = `+${data.longitudinal_growth_pct}%`;
        }
    }
    if (scopeEl) {
        scopeEl.textContent = `${data.selected_state} • ${data.selected_year}`;
    }
    if (crueltyEl) crueltyEl.textContent = (data.cruelty_by_husband || 0).toLocaleString();
    if (crueltyShareEl) crueltyShareEl.textContent = `${data.cruelty_pct || 0}% share`;
    if (assaultEl) assaultEl.textContent = (data.assault_on_women || 0).toLocaleString();
    if (assaultShareEl) assaultShareEl.textContent = `${data.assault_pct || 0}% share`;
    if (dowryEl) dowryEl.textContent = (data.dowry_deaths || 0).toLocaleString();
    if (dowryShareEl) dowryShareEl.textContent = `${data.dowry_pct || 0}% share`;
}

async function fetchWomenTemporalTrend() {
    try {
        const params = new URLSearchParams();
        if (womenState.state) params.append("state", womenState.state);

        const res = await fetch(`/api/india/women/temporal?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch temporal data");
        const data = await res.json();
        renderWomenTemporalChart(data);
    } catch (err) {
        console.error("fetchWomenTemporalTrend error:", err);
    }
}

function renderWomenTemporalChart(data) {
    const ctx = document.getElementById("chart-women-temporal");
    if (!ctx) return;

    if (indiaState.charts.womenTemporal) {
        indiaState.charts.womenTemporal.destroy();
    }

    const years = data.map(d => d.year);
    const totalCrimes = data.map(d => d.total_crimes);
    const cruelty = data.map(d => d.cruelty_by_husband);
    const assault = data.map(d => d.assault_on_women);
    const kidnap = data.map(d => d.kidnapping_abduction);
    const rape = data.map(d => d.rape);
    const dowry = data.map(d => d.dowry_deaths);

    indiaState.charts.womenTemporal = new Chart(ctx, {
        type: "line",
        data: {
            labels: years,
            datasets: [
                {
                    label: "Total Crimes",
                    data: totalCrimes,
                    borderColor: "#f43f5e",
                    backgroundColor: "rgba(244, 63, 94, 0.08)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#f43f5e"
                },
                {
                    label: "Cruelty (498A)",
                    data: cruelty,
                    borderColor: "#fb7185",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.3,
                    pointRadius: 3,
                    pointBackgroundColor: "#fb7185"
                },
                {
                    label: "Assault on Modesty (354)",
                    data: assault,
                    borderColor: "#fb923c",
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 3,
                    pointBackgroundColor: "#fb923c"
                },
                {
                    label: "Kidnapping & Abduction",
                    data: kidnap,
                    borderColor: "#f59e0b",
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 2,
                    pointBackgroundColor: "#f59e0b"
                },
                {
                    label: "Rape (376)",
                    data: rape,
                    borderColor: "#ef4444",
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 2,
                    pointBackgroundColor: "#ef4444"
                },
                {
                    label: "Dowry Deaths (304B)",
                    data: dowry,
                    borderColor: "#8b5cf6",
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 2,
                    pointBackgroundColor: "#8b5cf6"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        color: CHART_COLORS.text,
                        boxWidth: 12,
                        font: { size: 11, family: "Inter" }
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    titleColor: "#ffffff",
                    bodyColor: "#cbd5e1",
                    borderColor: "rgba(244, 63, 94, 0.4)",
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: CHART_COLORS.grid },
                    ticks: { color: CHART_COLORS.text, font: { size: 11 } }
                },
                y: {
                    grid: { color: CHART_COLORS.grid },
                    ticks: {
                        color: CHART_COLORS.text,
                        font: { size: 11 },
                        callback: function(val) {
                            return val >= 1000 ? (val / 1000).toFixed(0) + "k" : val;
                        }
                    }
                }
            }
        }
    });
}

async function fetchWomenCategories() {
    try {
        const params = new URLSearchParams();
        if (womenState.state) params.append("state", womenState.state);
        if (womenState.year) params.append("year", womenState.year);

        const res = await fetch(`/api/india/women/categories?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        renderWomenDonut(data);
    } catch (err) {
        console.error("fetchWomenCategories error:", err);
    }
}

function renderWomenDonut(data) {
    const ctx = document.getElementById("chart-women-donut");
    const legendList = document.getElementById("women-category-legend-list");
    if (!ctx) return;

    if (indiaState.charts.womenDonut) {
        indiaState.charts.womenDonut.destroy();
    }

    const categories = data.categories || [];
    const labels = categories.map(c => c.name);
    const counts = categories.map(c => c.count);
    const colors = categories.map(c => c.color);

    indiaState.charts.womenDonut = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: colors,
                borderColor: "rgba(15, 23, 42, 0.8)",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const cat = categories[context.dataIndex];
                            return ` ${cat.name}: ${cat.count.toLocaleString()} (${cat.pct}%)`;
                        }
                    }
                }
            }
        }
    });

    if (legendList) {
        legendList.innerHTML = categories.map(cat => `
            <div class="women-legend-item">
                <div style="display: flex; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">
                    <span class="women-legend-color-dot" style="background-color: ${cat.color};"></span>
                    <span style="color: var(--text-primary);">${escapeHtml(cat.name)}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="color: var(--text-muted);">${cat.count.toLocaleString()}</span>
                    <span class="women-num-badge" style="background: rgba(255,255,255,0.05); color: #fff;">${cat.pct}%</span>
                </div>
            </div>
        `).join("");
    }
}

async function fetchWomenStates() {
    try {
        const params = new URLSearchParams();
        if (womenState.year) params.append("year", womenState.year);
        params.append("sort_by", womenState.statesSort || "total_crimes");

        const res = await fetch(`/api/india/women/states?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch states comparison");
        const states = await res.json();
        renderWomenStatesBar(states);
    } catch (err) {
        console.error("fetchWomenStates error:", err);
    }
}

function renderWomenStatesBar(states) {
    const ctx = document.getElementById("chart-women-states");
    const subtitle = document.getElementById("women-states-chart-subtitle");
    if (!ctx) return;

    if (indiaState.charts.womenStates) {
        indiaState.charts.womenStates.destroy();
    }

    const sortCol = womenState.statesSort || "total_crimes";
    const topStates = states.slice(0, 15);
    const labels = topStates.map(s => s.state_ut);
    const values = topStates.map(s => s[sortCol] || 0);

    const metricNameMap = {
        total_crimes: "Total Crimes Against Women",
        cruelty_by_husband: "Cruelty by Husband (Sec 498A)",
        assault_on_women: "Assault on Modesty (Sec 354)",
        rape: "Rape (Sec 376)",
        dowry_deaths: "Dowry Deaths (Sec 304B)",
        kidnapping_abduction: "Kidnapping & Abduction"
    };

    if (subtitle) {
        const currentYearStr = womenState.year ? `in ${womenState.year}` : `Across 14 Years (2001–2014)`;
        subtitle.textContent = `Top 15 States & UTs ranked by ${metricNameMap[sortCol] || sortCol} ${currentYearStr}`;
    }

    indiaState.charts.womenStates = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: metricNameMap[sortCol] || "Incidents",
                data: values,
                backgroundColor: "rgba(244, 63, 94, 0.75)",
                borderColor: "#f43f5e",
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: CHART_COLORS.grid },
                    ticks: {
                        color: CHART_COLORS.text,
                        font: { size: 10 },
                        maxRotation: 45
                    }
                },
                y: {
                    grid: { color: CHART_COLORS.grid },
                    ticks: {
                        color: CHART_COLORS.text,
                        font: { size: 10 },
                        callback: function(val) {
                            return val >= 1000 ? (val / 1000).toFixed(0) + "k" : val;
                        }
                    }
                }
            }
        }
    });
}

async function fetchWomenDistricts() {
    try {
        const params = new URLSearchParams();
        if (womenState.state) params.append("state", womenState.state);
        if (womenState.year) params.append("year", womenState.year);
        if (womenState.search) params.append("search", womenState.search);
        params.append("sort_by", womenState.tableSort || "total_crimes");
        params.append("sort_order", womenState.tableSortOrder || "desc");
        params.append("limit", womenState.limit.toString());
        const offset = (womenState.page - 1) * womenState.limit;
        params.append("offset", offset.toString());

        const res = await fetch(`/api/india/women/districts?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch districts");
        const data = await res.json();
        womenState.totalRecords = data.total;
        renderWomenDistrictsTable(data);
    } catch (err) {
        console.error("fetchWomenDistricts error:", err);
    }
}

function renderWomenDistrictsTable(data) {
    const tbody = document.getElementById("tbody-women-districts");
    const counter = document.getElementById("women-table-counter");
    const paginationInfo = document.getElementById("women-pagination-info");
    const prevBtn = document.getElementById("btn-women-prev-page");
    const nextBtn = document.getElementById("btn-women-next-page");

    if (!tbody) return;

    const startIdx = data.total === 0 ? 0 : data.offset + 1;
    const endIdx = Math.min(data.offset + data.limit, data.total);
    const totalPages = Math.ceil(data.total / data.limit) || 1;

    if (counter) {
        counter.textContent = `Showing ${startIdx}-${endIdx} of ${data.total.toLocaleString()} authentic district records`;
    }

    if (paginationInfo) {
        paginationInfo.textContent = `Page ${womenState.page} of ${totalPages} (${data.total.toLocaleString()} total records)`;
    }

    if (prevBtn) prevBtn.disabled = womenState.page <= 1;
    if (nextBtn) nextBtn.disabled = womenState.page >= totalPages;

    if (!data.records || data.records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 30px; color: var(--text-muted);">
                    No district records match the selected filter criteria.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.records.map(r => `
        <tr>
            <td><strong style="color: #cbd5e1;">${r.year}</strong></td>
            <td><span style="font-weight: 600; color: #ffffff;">${escapeHtml(r.district)}</span></td>
            <td><span class="badge" style="background: rgba(255,255,255,0.06); color: #94a3b8; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px;">${escapeHtml(r.state_ut)}</span></td>
            <td><span class="women-num-badge high">${(r.cruelty_by_husband || 0).toLocaleString()}</span></td>
            <td><span class="women-num-badge medium">${(r.assault_on_women || 0).toLocaleString()}</span></td>
            <td>${(r.kidnapping_abduction || 0).toLocaleString()}</td>
            <td><span class="women-num-badge high" style="background: rgba(239, 68, 68, 0.15); color: #f87171;">${(r.rape || 0).toLocaleString()}</span></td>
            <td><span class="women-num-badge" style="background: rgba(139, 92, 246, 0.15); color: #c084fc;">${(r.dowry_deaths || 0).toLocaleString()}</span></td>
            <td>${(r.insult_to_modesty || 0).toLocaleString()}</td>
            <td><strong style="color: #ffffff;">${(r.total_crimes || 0).toLocaleString()}</strong></td>
        </tr>
    `).join("");
}

/**
 * ==========================================================================
 * Citizen Safety & Cyber Cell Emergency Helplines Controller
 * ==========================================================================
 */

const CYBER_CELL_OFFICES = [
    {
        city: "Delhi (NCT)",
        jurisdiction: "National Capital Region",
        ps_name: "Special Cell / IFSO Cyber Police Station",
        nodal: "DCP Cyber Crime (IFSO)",
        address: "Special Cell, Sector 16-C, Dwarka, New Delhi - 110078",
        phones: ["011-20892633", "011-20892634", "1930"],
        email: "dcp-cybercell-dl@nic.in",
        primary_phone: "01120892633"
    },
    {
        city: "Mumbai, Maharashtra",
        jurisdiction: "Western Zone / MMR",
        ps_name: "Cyber Police Station (Bandra-Kurla Complex)",
        nodal: "DCP Cyber Crime Wing",
        address: "Bandra Kurla Complex (BKC), Behind MTNL Bldg, Bandra (E), Mumbai - 400051",
        phones: ["022-26504008", "022-26504009", "1930"],
        email: "cp.mumbai.cyber@mahapolice.gov.in",
        primary_phone: "02226504008"
    },
    {
        city: "Bengaluru, Karnataka",
        jurisdiction: "CID Karnataka",
        ps_name: "Cyber Crime Police Station (CID HQ)",
        nodal: "SP Cyber Crime Division (CID)",
        address: "CID Head Quarters, Carlton House, Palace Road, Bengaluru - 560001",
        phones: ["080-22094496", "080-22201026", "1930"],
        email: "cybercrimeps@ksp.gov.in",
        primary_phone: "08022094496"
    },
    {
        city: "Hyderabad, Telangana",
        jurisdiction: "Hyderabad City Commissionerate",
        ps_name: "Cyber Crime Police Station (CCPS)",
        nodal: "ACP / Inspector Cyber Crimes",
        address: "Hyderabad Police Commissionerate, Basheerbagh, Hyderabad - 500029",
        phones: ["040-27852412", "040-27852408", "1930"],
        email: "cybercrime-hyd@tspolice.gov.in",
        primary_phone: "04027852412"
    },
    {
        city: "Kolkata, West Bengal",
        jurisdiction: "Kolkata Police HQ",
        ps_name: "Cyber Crime Police Station (Lalbazar)",
        nodal: "OC Cyber Crime PS Lalbazar",
        address: "18, Lalbazar Street, Police HQ, Kolkata - 700001",
        phones: ["033-22143000", "033-22505054", "1930"],
        email: "cyberps@kolkatapolice.gov.in",
        primary_phone: "03322143000"
    },
    {
        city: "Chennai, Tamil Nadu",
        jurisdiction: "Tamil Nadu State Cyber Wing",
        ps_name: "Cyber Crime Wing Police Station (State HQ)",
        nodal: "SP Cyber Crime Division",
        address: "DGP Office Complex, Dr. Radhakrishnan Salai, Mylapore, Chennai - 600004",
        phones: ["044-28447701", "044-28447703", "1930"],
        email: "cybercrime@tn.gov.in",
        primary_phone: "04428447701"
    },
    {
        city: "Lucknow, Uttar Pradesh",
        jurisdiction: "UP State Cyber HQ",
        ps_name: "State Cyber Crime Police Station (Gomti Nagar)",
        nodal: "SP Cyber Crime UP Police",
        address: "Cyber Crime Police Station, Vibhuti Khand, Gomti Nagar, Lucknow - 226010",
        phones: ["0522-2287238", "1090", "1930"],
        email: "cybercell-up@nic.in",
        primary_phone: "05222287238"
    },
    {
        city: "Gandhinagar, Gujarat",
        jurisdiction: "CID Crime Gujarat",
        ps_name: "CID Cyber Crime Cell (Police Bhavan)",
        nodal: "DySP Cyber Crime Branch",
        address: "Police Bhavan, Sector 18, Gandhinagar - 382018",
        phones: ["079-23250798", "079-23254384", "1930"],
        email: "cc-cid@gujarat.gov.in",
        primary_phone: "07923250798"
    },
    {
        city: "Thiruvananthapuram, Kerala",
        jurisdiction: "Kerala Police HQ",
        ps_name: "Cyber Crime Police Station (Vazhuthacaud)",
        nodal: "DySP Cyber Crime Enquiry",
        address: "Police Headquarters, Vazhuthacaud, Thiruvananthapuram - 695014",
        phones: ["0471-2313780", "0471-2722215", "1930"],
        email: "cyberps.pol@kerala.gov.in",
        primary_phone: "04712313780"
    },
    {
        city: "Jaipur, Rajasthan",
        jurisdiction: "Rajasthan SCRB / Cyber Cell",
        ps_name: "Special Cyber Crime Police Station",
        nodal: "SP Cyber Cell Jaipur",
        address: "State Crime Records Bureau Complex, Ghat Gate, Jaipur - 302003",
        phones: ["0141-2609000", "0141-2605555", "1930"],
        email: "cyberps-raj@gov.in",
        primary_phone: "01412609000"
    },
    {
        city: "Chandigarh, Punjab & Haryana",
        jurisdiction: "State Cyber Crime Cell",
        ps_name: "Cyber Crime Division (Mohali / Sector 9)",
        nodal: "AIG Cyber Crime Punjab",
        address: "State Cyber Crime Cell, Phase 7, SAS Nagar (Mohali) / Police HQ Sector 9, Chandigarh",
        phones: ["0172-2740046", "0172-2298700", "1930"],
        email: "cybercrime@punjabpolice.gov.in",
        primary_phone: "01722740046"
    },
    {
        city: "Patna, Bihar",
        jurisdiction: "Economic Offences Unit (EOU)",
        ps_name: "Cyber Crime Police Station (Bailey Road)",
        nodal: "SP Cyber Cell / EOU Bihar",
        address: "Economic Offences Unit, 1 Sardar Patel Bhawan, Bailey Road, Patna - 800023",
        phones: ["0612-2215142", "0612-2215143", "1930"],
        email: "sp-cyber-bih@nic.in",
        primary_phone: "06122215142"
    },
    {
        city: "Bhopal, Madhya Pradesh",
        jurisdiction: "State Cyber Police HQ",
        ps_name: "State Cyber Crime Police Station (Bhadbhada Rd)",
        nodal: "SP State Cyber Police Bhopal",
        address: "Police Radio Headquarters Complex, Bhadbhada Road, Bhopal - 462003",
        phones: ["0755-2770248", "0755-2770249", "1930"],
        email: "mpcyberpolice@mp.gov.in",
        primary_phone: "07552770248"
    },
    {
        city: "Dehradun, Uttarakhand",
        jurisdiction: "Special Task Force / Cyber Cell",
        ps_name: "Cyber Crime Police Station (Gandhi Road)",
        nodal: "CO Cyber Crime STF",
        address: "Near Doon Hospital, Old Police Lines, Dehradun - 248001",
        phones: ["0135-2655900", "0135-2712563", "1930"],
        email: "ccps.dehradun@uttarakhandpolice.uk.gov.in",
        primary_phone: "01352655900"
    }
];

function setupSafetyFooter() {
    // 1. Modals setup
    const modalCybercell = document.getElementById("modal-cybercell");
    const btnOpenCybercell = document.getElementById("btn-open-cybercell-dir");
    const btnCloseCybercell = document.getElementById("btn-close-cybercell-modal");
    const btnDismissCybercell = document.getElementById("btn-modal-cybercell-dismiss");

    const openCybercellModal = () => {
        if (!modalCybercell) return;
        renderCyberCellDirectory("");
        const searchInput = document.getElementById("cybercell-search");
        if (searchInput) searchInput.value = "";
        modalCybercell.classList.add("active");
        modalCybercell.setAttribute("aria-hidden", "false");
    };

    const closeCybercellModal = () => {
        if (!modalCybercell) return;
        modalCybercell.classList.remove("active");
        modalCybercell.setAttribute("aria-hidden", "true");
    };

    if (btnOpenCybercell) btnOpenCybercell.addEventListener("click", openCybercellModal);
    if (btnCloseCybercell) btnCloseCybercell.addEventListener("click", closeCybercellModal);
    if (btnDismissCybercell) btnDismissCybercell.addEventListener("click", closeCybercellModal);

    // Search filter for Cyber Cell offices
    const searchInput = document.getElementById("cybercell-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderCyberCellDirectory(e.target.value.trim().toLowerCase());
        });
    }

    // 2. Safety First-Aid Checklist Modal
    const modalFirstAid = document.getElementById("modal-safety-guide");
    const btnOpenFirstAid = document.getElementById("btn-open-firstaid");
    const btnCloseFirstAid = document.getElementById("btn-close-firstaid-modal");
    const btnDismissFirstAid = document.getElementById("btn-modal-firstaid-dismiss");

    const openFirstAidModal = () => {
        if (!modalFirstAid) return;
        modalFirstAid.classList.add("active");
        modalFirstAid.setAttribute("aria-hidden", "false");
    };

    const closeFirstAidModal = () => {
        if (!modalFirstAid) return;
        modalFirstAid.classList.remove("active");
        modalFirstAid.setAttribute("aria-hidden", "true");
    };

    if (btnOpenFirstAid) btnOpenFirstAid.addEventListener("click", openFirstAidModal);
    if (btnCloseFirstAid) btnCloseFirstAid.addEventListener("click", closeFirstAidModal);
    if (btnDismissFirstAid) btnDismissFirstAid.addEventListener("click", closeFirstAidModal);

    // Close on backdrop click or Escape key
    [modalCybercell, modalFirstAid].forEach(modal => {
        if (!modal) return;
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
                modal.setAttribute("aria-hidden", "true");
            }
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (modalCybercell && modalCybercell.classList.contains("active")) closeCybercellModal();
            if (modalFirstAid && modalFirstAid.classList.contains("active")) closeFirstAidModal();
        }
    });

    // 3. Delegate Copy Buttons
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

function renderCyberCellDirectory(query = "") {
    const grid = document.getElementById("cybercell-directory-grid");
    if (!grid) return;

    const filtered = CYBER_CELL_OFFICES.filter(item => {
        if (!query) return true;
        return item.city.toLowerCase().includes(query) ||
               item.ps_name.toLowerCase().includes(query) ||
               item.jurisdiction.toLowerCase().includes(query) ||
               item.address.toLowerCase().includes(query) ||
               item.phones.some(p => p.toLowerCase().includes(query)) ||
               item.nodal.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--text-muted);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 36px; height: 36px; margin-bottom: 10px; opacity: 0.5;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <p style="font-size: 0.9rem; font-weight: 500;">No Cyber Cell police stations match "${escapeHtml(query)}"</p>
                <p style="font-size: 0.76rem; margin-top: 6px;">For immediate nationwide reporting, call <strong>1930</strong> (24x7 National Cyber Crime Helpline).</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <div class="cybercell-office-card">
            <div class="office-city-badge">
                <span class="office-city-name">${escapeHtml(item.city)}</span>
                <span class="office-jurisdiction-tag">${escapeHtml(item.jurisdiction)}</span>
            </div>

            <div class="office-ps-name">${escapeHtml(item.ps_name)}</div>

            <div class="office-detail-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>${escapeHtml(item.nodal)}</span>
            </div>

            <div class="office-detail-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${escapeHtml(item.address)}</span>
            </div>

            <div class="office-detail-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <a href="mailto:${escapeHtml(item.email)}" style="color: var(--accent-sky); text-decoration: none;">${escapeHtml(item.email)}</a>
            </div>

            <div class="office-phones-list">
                ${item.phones.map(p => `
                    <span class="office-phone-badge">
                        📞 ${escapeHtml(p)}
                    </span>
                `).join("")}
            </div>

            <div class="office-actions-row">
                <a href="tel:${escapeHtml(item.primary_phone)}" class="btn-office-action call" title="Call ${escapeHtml(item.city)} Cyber Cell">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>Direct Call</span>
                </a>
                <button type="button" class="btn-office-action copy" data-copy="${escapeHtml(item.phones[0])}" data-copy-label="${escapeHtml(item.city)} Cyber Cell">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <span>Copy No.</span>
                </button>
            </div>
        </div>
    `).join("");
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
 * 8. INDIA CITIES CRIME & SAFETY INTELLIGENCE ROSTER MODULE
 * =========================================================================
 */
function loadIndiaCitiesRoster() {
    const grid = document.getElementById("grid-india-cities");
    if (!grid) return;

    const searchInput = document.getElementById("input-search-india-cities");
    const zoneSelect = document.getElementById("select-india-city-zone");
    const sortSelect = document.getElementById("select-india-city-sort");
    const riskSelect = document.getElementById("select-india-city-risk-tier");

    const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const zoneVal = zoneSelect ? zoneSelect.value : "all";
    const sortVal = sortSelect ? sortSelect.value : "safety_index_desc";
    const riskVal = riskSelect ? riskSelect.value : "all";

    let cities = Array.isArray(indiaState.citiesData) ? [...indiaState.citiesData] : [];

    // If cities data isn't loaded yet, try fetching
    if (cities.length === 0) {
        fetch("/api/india/cities")
            .then(res => res.json())
            .then(data => {
                indiaState.citiesData = data;
                loadIndiaCitiesRoster();
            })
            .catch(err => console.error("Error loading India cities roster:", err));
        return;
    }

    // Filter by Zone
    if (zoneVal !== "all") {
        cities = cities.filter(c => (c.zone || "").toLowerCase() === zoneVal.toLowerCase());
    }

    // Filter by Risk Tier
    if (riskVal !== "all") {
        cities = cities.filter(c => (c.risk_tier || "").toLowerCase() === riskVal.toLowerCase());
    }

    // Filter by Search text
    if (searchVal) {
        cities = cities.filter(c => 
            (c.city || "").toLowerCase().includes(searchVal) ||
            (c.state || "").toLowerCase().includes(searchVal) ||
            (c.police_agency || "").toLowerCase().includes(searchVal) ||
            (c.zone || "").toLowerCase().includes(searchVal)
        );
    }

    // Sorting
    if (sortVal === "safety_index_desc") {
        cities.sort((a, b) => (b.safety_index || 0) - (a.safety_index || 0));
    } else if (sortVal === "crime_rate_desc") {
        cities.sort((a, b) => (b.crime_rate || 0) - (a.crime_rate || 0));
    } else if (sortVal === "ipc_crimes_desc") {
        cities.sort((a, b) => (b.ipc_crimes || 0) - (a.ipc_crimes || 0));
    } else if (sortVal === "population_desc") {
        cities.sort((a, b) => (b.population_millions || 0) - (a.population_millions || 0));
    } else if (sortVal === "city_asc") {
        cities.sort((a, b) => (a.city || "").localeCompare(b.city || ""));
    } else if (sortVal === "state_asc") {
        cities.sort((a, b) => (a.state || "").localeCompare(b.state || ""));
    }

    // Update match count badge
    const badge = document.getElementById("india-cities-match-count");
    if (badge) {
        badge.textContent = `Displaying ${cities.length} of ${indiaState.citiesData.length} Indian Metros`;
    }

    // Update KPI strip summary cards
    const totalMetrosEl = document.getElementById("india-total-cities-count");
    if (totalMetrosEl) totalMetrosEl.textContent = `${indiaState.citiesData.length}+`;

    // Safest metropolis from all cities
    if (indiaState.citiesData.length > 0) {
        const sortedBySafety = [...indiaState.citiesData].sort((a, b) => b.safety_index - a.safety_index);
        const safest = sortedBySafety[0];
        const safestNameEl = document.getElementById("india-safest-city-name");
        const safestSubEl = document.getElementById("india-safest-city-sub");
        if (safestNameEl && safest) safestNameEl.textContent = safest.city;
        if (safestSubEl && safest) safestSubEl.textContent = `Safety Index: ${safest.safety_index} / 100`;

        const avgSafety = (indiaState.citiesData.reduce((acc, cur) => acc + (cur.safety_index || 0), 0) / indiaState.citiesData.length).toFixed(1);
        const avgScoreEl = document.getElementById("india-avg-safety-score");
        if (avgScoreEl) avgScoreEl.textContent = avgSafety;
    }

    // Active surveillance city
    const activeCityProfile = indiaState.activeCity 
        ? indiaState.citiesData.find(c => c.city.toLowerCase() === indiaState.activeCity.toLowerCase())
        : null;

    const activeNameEl = document.getElementById("active-surveillance-india-city-name");
    const activeAgencyEl = document.getElementById("active-surveillance-india-agency");
    if (activeCityProfile) {
        if (activeNameEl) activeNameEl.textContent = `${activeCityProfile.city}, ${activeCityProfile.state}`;
        if (activeAgencyEl) activeAgencyEl.textContent = activeCityProfile.police_agency || `${activeCityProfile.city} Police`;
        renderActiveAreaDossier(activeCityProfile);
    } else {
        if (activeNameEl) activeNameEl.textContent = "National Grid";
        if (activeAgencyEl) activeAgencyEl.textContent = "Click any metropolitan card below to lock area surveillance";
        renderActiveAreaDossier(null);
    }

    grid.innerHTML = "";

    if (cities.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
                <p style="font-size: 1.1rem; margin-bottom: 8px;">No Indian metropolitan commissionerates matched your filter criteria.</p>
                <button type="button" class="btn btn-outline btn-sm" id="btn-reset-india-roster-filters">Reset Roster Filters</button>
            </div>
        `;
        document.getElementById("btn-reset-india-roster-filters")?.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (zoneSelect) zoneSelect.value = "all";
            if (riskSelect) riskSelect.value = "all";
            if (sortSelect) sortSelect.value = "safety_index_desc";
            loadIndiaCitiesRoster();
        });
        return;
    }

    cities.forEach(city => {
        const isCurrent = (indiaState.activeCity || "").toLowerCase() === city.city.toLowerCase();
        const card = document.createElement("div");
        card.className = `world-city-card ${isCurrent ? 'active-surveillance' : ''}`;
        card.setAttribute("data-city", city.city);
        card.setAttribute("title", `Click to activate surveillance on ${city.city} (${city.police_agency || city.state})`);

        // Safety badge color class
        let safetyPillClass = "pill-safe";
        if (city.safety_index < 45) {
            safetyPillClass = "pill-danger";
        } else if (city.safety_index < 65) {
            safetyPillClass = "pill-warning";
        }

        card.innerHTML = `
            <div class="world-city-top-bar">
                <h3 class="world-city-title" title="${city.city}, ${city.state}">${city.city}, ${city.state}</h3>
                ${isCurrent ? `
                <div class="world-city-active-badge">
                    <span class="badge-dot"></span>
                    <span>Surveillance Active</span>
                </div>` : ''}
            </div>
            <div class="world-city-pills">
                <span class="world-city-pill ${safetyPillClass}">🛡️ ${city.safety_index} Safety</span>
                <span class="world-city-pill">🏛️ ${city.zone}</span>
                <span class="world-city-pill">👥 ${city.population_millions}M</span>
                <span class="world-city-pill">🚨 ${city.crime_rate}/1L</span>
                <span class="world-city-pill">⚖️ ${city.chargesheet_rate}% CS</span>
                ${isCurrent ? `<span class="world-city-pill pill-active">✓ Active</span>` : ''}
            </div>
            <div class="world-city-card-footer">
                <button type="button" class="card-quick-btn btn-card-map" title="Inspect ${city.city} on GIS Map">🗺️ Map</button>
                <button type="button" class="card-quick-btn btn-card-explorer" title="Open District Explorer for ${city.city}">📋 Explorer</button>
            </div>
        `;

        // Clicking the card activates full surveillance on that area
        card.addEventListener("click", () => {
            activateCitySurveillance(city.city);
        });

        // Quick GIS Map button on card
        const btnMap = card.querySelector(".btn-card-map");
        if (btnMap) {
            btnMap.addEventListener("click", (e) => {
                e.stopPropagation();
                activateCitySurveillance(city.city);
                locateEntityOnMap({ lat: city.lat, lng: city.lng, district_name: city.city }, "district");
            });
        }

        // Quick District Explorer button on card
        const btnExp = card.querySelector(".btn-card-explorer");
        if (btnExp) {
            btnExp.addEventListener("click", (e) => {
                e.stopPropagation();
                activateCitySurveillance(city.city);
                const tabExplorer = document.getElementById("tab-explorer");
                if (tabExplorer) tabExplorer.click();
                switchToExplorerDistrictsView();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

        grid.appendChild(card);
    });
}

/**
 * Activate Surveillance on a Specific Indian City / Metropolitan Area
 * Connects Roster selection with whole-dashboard calibration & live area results
 */
function activateCitySurveillance(cityName) {
    if (!cityName) return;
    const city = indiaState.citiesData.find(c => c.city.toLowerCase() === cityName.toLowerCase());
    if (!city) return;

    indiaState.activeCity = city.city;

    // 1. Match district in districtsData
    let matchDistrict = indiaState.districtsData.find(d => 
        d.district_name.toLowerCase() === city.city.toLowerCase() &&
        (d.state_ut.toLowerCase() === city.state.toLowerCase())
    );
    if (!matchDistrict) {
        // Try loose matching (e.g. "Bengaluru Urban", "Mumbai City", "Delhi", etc.)
        matchDistrict = indiaState.districtsData.find(d => 
            (d.district_name.toLowerCase().includes(city.city.toLowerCase()) || city.city.toLowerCase().includes(d.district_name.toLowerCase())) &&
            (d.state_ut.toLowerCase() === city.state.toLowerCase())
        );
    }
    if (!matchDistrict) {
        matchDistrict = indiaState.districtsData.find(d => 
            d.headquarters && d.headquarters.toLowerCase() === city.city.toLowerCase()
        );
    }

    // 2. Set filters across India portal
    indiaState.filters.state = city.state;
    indiaState.filters.district = matchDistrict ? matchDistrict.district_name : "";

    // 3. Sync Filter Strip Dropdowns
    const stateSelect = document.getElementById("filter-state");
    if (stateSelect) {
        stateSelect.value = city.state;
        populateDistrictDropdown(city.state);
        const distSelect = document.getElementById("filter-district");
        if (distSelect && matchDistrict) {
            distSelect.value = matchDistrict.district_name;
        }
    }

    // Sync Explorer State filter & GIS State filter
    const explorerStateFilter = document.getElementById("filter-district-state");
    if (explorerStateFilter) explorerStateFilter.value = city.state;
    const gisFilter = document.getElementById("gis-state-filter");
    if (gisFilter) gisFilter.value = city.state;

    // 4. Update KPI strip in Roster View
    const activeNameEl = document.getElementById("active-surveillance-india-city-name");
    const activeAgencyEl = document.getElementById("active-surveillance-india-agency");
    if (activeNameEl) activeNameEl.textContent = `${city.city}, ${city.state}`;
    if (activeAgencyEl) activeAgencyEl.textContent = city.police_agency || `${city.city} Police`;

    // 5. Update active card highlight
    updateActiveIndiaCityCardHighlight();

    // 6. Pre-position Leaflet Map to city center
    if (indiaState.map && city.lat && city.lng) {
        indiaState.map.flyTo([city.lat, city.lng], 10, { duration: 1.0 });
    }

    // 7. Render Active Metropolitan Surveillance Dossier right on the Roster page
    renderActiveAreaDossier(city);

    // 8. Calibrate the entire dashboard across Overview, Explorer, GIS, Analytics, and Telemetry
    applyAllFilters();

    showSafetyToast(`🎯 Surveillance Locked: ${city.city} (${city.police_agency || city.state})`);
}

/**
 * Render the Active Area Intelligence Dossier Banner
 */
function renderActiveAreaDossier(city) {
    const container = document.getElementById("area-surveillance-dossier");
    if (!container) return;

    if (!city) {
        container.style.display = "none";
        return;
    }

    container.style.display = "block";

    let riskClass = "safe";
    let riskIcon = "🛡️";
    if (city.safety_index < 45) {
        riskClass = "danger";
        riskIcon = "⚠️";
    } else if (city.safety_index < 65) {
        riskClass = "warning";
        riskIcon = "⚡";
    }

    const crimeRatePct = Math.min(100, Math.max(10, ((city.crime_rate || 0) / 500) * 100));
    const chargesheetPct = Math.min(100, Math.max(5, city.chargesheet_rate || 0));
    const popText = city.population_millions ? `${city.population_millions}M Citizens` : 'Metro Jurisdiction';
    const agencyText = city.police_agency || `${city.city} Police Department`;

    container.innerHTML = `
        <div class="dossier-header-console">
            <div class="dossier-header-main">
                <div class="dossier-status-beacon">
                    <span class="beacon-radar">
                        <span class="beacon-pulse"></span>
                        <span class="beacon-dot"></span>
                    </span>
                    <span>SURVEILLANCE RADAR LOCKED // JURISDICTION ACTIVE</span>
                    <span class="beacon-tag">NCRB-CCTNS LINKED</span>
                </div>
                <div class="dossier-title-row">
                    <h2 class="dossier-city-title">${escapeHtml(city.city)}, <span class="dossier-state-name">${escapeHtml(city.state)}</span></h2>
                    <span class="dossier-risk-pill ${riskClass}">${riskIcon} ${city.safety_index} Safety (${escapeHtml(city.risk_tier)})</span>
                </div>
                <div class="dossier-meta-strip">
                    <div class="dossier-meta-item">
                        <span class="meta-icon">🏛️</span>
                        <span class="meta-label">Law Enforcement:</span>
                        <strong class="meta-value text-cyan">${escapeHtml(agencyText)}</strong>
                    </div>
                    <div class="dossier-meta-item">
                        <span class="meta-icon">🌐</span>
                        <span class="meta-label">Zone:</span>
                        <strong class="meta-value">${escapeHtml(city.zone)} Zone</strong>
                    </div>
                    <div class="dossier-meta-item">
                        <span class="meta-icon">👥</span>
                        <span class="meta-label">Metropolitan Pop:</span>
                        <strong class="meta-value">${popText}</strong>
                    </div>
                    <div class="dossier-meta-item">
                        <span class="meta-icon">🚨</span>
                        <span class="meta-label">Emergency SOS:</span>
                        <strong class="meta-value text-rose">${city.emergency_number || '112 / 100'}</strong>
                    </div>
                </div>
            </div>
            <div class="dossier-header-actions">
                <button type="button" class="btn-dossier-reset" id="btn-clear-area-lock" title="Reset to All-India Overview">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    <span>Reset Area Filter</span>
                </button>
            </div>
        </div>

        <div class="dossier-grid">
            <!-- 1. Crime Rate -->
            <div class="dossier-card card-cyan">
                <div class="card-header-mini">
                    <div class="card-title-mini">
                        <span class="card-icon">🚨</span>
                        <span>CRIME DENSITY</span>
                    </div>
                    <span class="card-badge">Per 100K</span>
                </div>
                <div class="card-stat-wrap">
                    <span class="card-huge-val text-cyan">${city.crime_rate}</span>
                    <span class="card-stat-unit">rate</span>
                </div>
                <div class="card-sub-desc">Reported crimes per 100,000 citizens</div>
                <div class="card-progress-track">
                    <div class="card-progress-bar bg-cyan" style="width: ${crimeRatePct}%;"></div>
                </div>
                <div class="card-footer-mini">
                    <span>National Benchmark: 358.2</span>
                    <span class="${city.crime_rate < 300 ? 'text-emerald' : 'text-amber'}">${city.crime_rate < 300 ? '✓ Favorable' : '⚠️ Elevated'}</span>
                </div>
            </div>

            <!-- 2. IPC Volume -->
            <div class="dossier-card card-blue">
                <div class="card-header-mini">
                    <div class="card-title-mini">
                        <span class="card-icon">📁</span>
                        <span>COGNIZABLE IPC CASLOAD</span>
                    </div>
                    <span class="card-badge">NCRB 2024</span>
                </div>
                <div class="card-stat-wrap">
                    <span class="card-huge-val text-primary">${Number(city.ipc_crimes || 0).toLocaleString()}</span>
                    <span class="card-stat-unit">cases</span>
                </div>
                <div class="card-sub-desc">Total cognizable offenses recorded in police ledger</div>
                <div class="card-progress-track">
                    <div class="card-progress-bar bg-primary" style="width: 70%;"></div>
                </div>
                <div class="card-footer-mini">
                    <span>Active Station FIRs</span>
                    <span class="text-primary">Formal Registry</span>
                </div>
            </div>

            <!-- 3. Chargesheet Rate -->
            <div class="dossier-card card-emerald">
                <div class="card-header-mini">
                    <div class="card-title-mini">
                        <span class="card-icon">⚖️</span>
                        <span>CHARGESHEET FILING</span>
                    </div>
                    <span class="card-badge badge-emerald">Efficiency</span>
                </div>
                <div class="card-stat-wrap">
                    <span class="card-huge-val text-emerald">${city.chargesheet_rate}%</span>
                    <span class="card-stat-unit">court</span>
                </div>
                <div class="card-sub-desc">Cases charge-sheeted in Magistrate Courts</div>
                <div class="card-progress-track">
                    <div class="card-progress-bar bg-emerald" style="width: ${chargesheetPct}%;"></div>
                </div>
                <div class="card-footer-mini">
                    <span>Judicial Processing</span>
                    <span class="text-emerald">High Prosecution</span>
                </div>
            </div>

            <!-- 4. Violent Crime Volume -->
            <div class="dossier-card card-rose">
                <div class="card-header-mini">
                    <div class="card-title-mini">
                        <span class="card-icon">⚔️</span>
                        <span>VIOLENT CRIMES</span>
                    </div>
                    <span class="card-badge badge-rose">Priority 1</span>
                </div>
                <div class="card-stat-wrap">
                    <span class="card-huge-val text-rose">${Number(city.violent_crimes || 0).toLocaleString()}</span>
                    <span class="card-stat-unit">offenses</span>
                </div>
                <div class="card-sub-desc">Homicide, armed robbery & assault incidents</div>
                <div class="card-progress-track">
                    <div class="card-progress-bar bg-rose" style="width: 32%;"></div>
                </div>
                <div class="card-footer-mini">
                    <span>Armed & Severe</span>
                    <span class="text-rose">Rapid Response</span>
                </div>
            </div>

            <!-- 5. Women Safety -->
            <div class="dossier-card card-amber">
                <div class="card-header-mini">
                    <div class="card-title-mini">
                        <span class="card-icon">🌸</span>
                        <span>CRIMES AGAINST WOMEN</span>
                    </div>
                    <span class="card-badge badge-amber">SOS 1090</span>
                </div>
                <div class="card-stat-wrap">
                    <span class="card-huge-val text-amber">${Number(city.crimes_against_women || 0).toLocaleString()}</span>
                    <span class="card-stat-unit">registered</span>
                </div>
                <div class="card-sub-desc">Domestic, harassment & physical offenses</div>
                <div class="card-progress-track">
                    <div class="card-progress-bar bg-amber" style="width: 38%;"></div>
                </div>
                <div class="card-footer-mini">
                    <span>Direct Helpline: 1090</span>
                    <span class="text-amber">Special Cell Active</span>
                </div>
            </div>

            <!-- 6. Cybercrime -->
            <div class="dossier-card card-purple">
                <div class="card-header-mini">
                    <div class="card-title-mini">
                        <span class="card-icon">💻</span>
                        <span>CYBER FRAUD & IT CRIMES</span>
                    </div>
                    <span class="card-badge badge-purple">Cyber 1930</span>
                </div>
                <div class="card-stat-wrap">
                    <span class="card-huge-val text-purple">${Number(city.cyber_crimes || 0).toLocaleString()}</span>
                    <span class="card-stat-unit">cases</span>
                </div>
                <div class="card-sub-desc">Financial phishing, hacking & extortion</div>
                <div class="card-progress-track">
                    <div class="card-progress-bar bg-purple" style="width: 25%;"></div>
                </div>
                <div class="card-footer-mini">
                    <span>I4C Portal Sync</span>
                    <span class="text-purple">Golden Hour Liens</span>
                </div>
            </div>
        </div>

        <div class="dossier-directives-bar">
            <div class="directives-label-group">
                <span class="directives-icon">⚡</span>
                <span class="directives-title">TACTICAL AREA DIRECTIVES:</span>
                <span class="directives-sub">Calibrate dashboard modules & inspect metropolitan jurisdiction</span>
            </div>
            <div class="directives-btn-group">
                <button type="button" class="directive-btn btn-action-gis" id="btn-dossier-gis">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                    <span>Inspect on GIS Map</span>
                </button>
                <button type="button" class="directive-btn btn-action-explorer" id="btn-dossier-explorer">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>
                    <span>District Explorer</span>
                </button>
                <button type="button" class="directive-btn btn-action-analytics" id="btn-dossier-analytics">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    <span>Metropolitan Analytics</span>
                </button>
                <button type="button" class="directive-btn btn-action-firs" id="btn-dossier-firs">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>Live CCTNS Telemetry &amp; FIRs</span>
                </button>
            </div>
        </div>
    `;

    // Wire Dossier Action Buttons
    document.getElementById("btn-dossier-gis")?.addEventListener("click", () => {
        locateEntityOnMap({ lat: city.lat, lng: city.lng, district_name: city.city }, "district");
    });

    document.getElementById("btn-dossier-explorer")?.addEventListener("click", () => {
        const tabExplorer = document.getElementById("tab-explorer");
        if (tabExplorer) tabExplorer.click();
        switchToExplorerDistrictsView();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("btn-dossier-analytics")?.addEventListener("click", () => {
        const tabAnalytics = document.getElementById("tab-analytics");
        if (tabAnalytics) tabAnalytics.click();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("btn-dossier-firs")?.addEventListener("click", () => {
        const tabExplorer = document.getElementById("tab-explorer");
        if (tabExplorer) tabExplorer.click();
        switchToExplorerIncidentsView();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("btn-clear-area-lock")?.addEventListener("click", () => {
        clearStateAndDistrictFilters();
        indiaState.activeCity = null;
        loadIndiaCitiesRoster();
        showSafetyToast("Cleared area lock. Restored National View.");
    });
}

function updateActiveIndiaCityCardHighlight() {
    const cards = document.querySelectorAll("#grid-india-cities .world-city-card");
    cards.forEach(card => {
        const cityName = card.getAttribute("data-city");
        const isCurrent = cityName && cityName.toLowerCase() === (indiaState.activeCity || "").toLowerCase();
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

function setupIndiaCitiesListeners() {
    const searchInput = document.getElementById("input-search-india-cities");
    let deb;
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            clearTimeout(deb);
            deb = setTimeout(loadIndiaCitiesRoster, 250);
        });
    }

    const zoneSelect = document.getElementById("select-india-city-zone");
    if (zoneSelect) zoneSelect.addEventListener("change", loadIndiaCitiesRoster);

    const sortSelect = document.getElementById("select-india-city-sort");
    if (sortSelect) sortSelect.addEventListener("change", loadIndiaCitiesRoster);

    const riskSelect = document.getElementById("select-india-city-risk-tier");
    if (riskSelect) riskSelect.addEventListener("change", loadIndiaCitiesRoster);

    const btnExport = document.getElementById("btn-export-india-cities");
    if (btnExport) {
        btnExport.addEventListener("click", () => {
            window.open("/api/india/cities/export", "_blank");
        });
    }
}


