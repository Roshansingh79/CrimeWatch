/**
 * CrimeTrack // AI Tactical Intelligence Copilot
 * Autonomous, edge-speed intelligence assistant for crime pattern analysis,
 * city safety comparisons, tactical briefings, and proactive dashboard control.
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'crimewatch_ai_chat_history';
    let chatHistory = [];
    let isWaitingForResponse = false;

    // Detect environment
    function isIndiaPage() {
        return window.location.pathname.includes('/india') || !!document.getElementById('view-india-overview');
    }

    function getCurrentCity() {
        if (isIndiaPage()) {
            const stateSel = document.getElementById('filter-state');
            return stateSel && stateSel.value ? stateSel.value : 'India (National)';
        }
        const citySel = document.getElementById('filter-city');
        if (citySel && citySel.value) return citySel.value;
        const activeCityEl = document.getElementById('active-surveillance-city-name');
        if (activeCityEl && activeCityEl.textContent) {
            return activeCityEl.textContent.replace(/^[^\w]+/, '').split(',')[0].trim();
        }
        return 'Chicago';
    }

    function getCurrentView() {
        const activeTab = document.querySelector('.nav-tab.active');
        if (activeTab && activeTab.getAttribute('data-view')) {
            return activeTab.getAttribute('data-view');
        }
        const activePanel = document.querySelector('.view-panel.active');
        return activePanel ? activePanel.id : 'view-dashboard';
    }

    // Escape HTML to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Markdown Formatter tailored for cyber-tactical layout
    function formatMarkdown(text) {
        if (!text) return '';
        let escaped = escapeHtml(text);

        // Headers: #### Title -> <h6 class="ai-msg-h6">Title</h6>, ### -> <h5 class="ai-msg-h5">, etc.
        escaped = escaped.replace(/^#### (.*$)/gim, '<h6 class="ai-msg-h6">$1</h6>');
        escaped = escaped.replace(/^### (.*$)/gim, '<h5 class="ai-msg-h5">$1</h5>');
        escaped = escaped.replace(/^## (.*$)/gim, '<h4 class="ai-msg-h4">$1</h4>');
        escaped = escaped.replace(/^# (.*$)/gim, '<h3 class="ai-msg-h3">$1</h3>');

        // Bold: **text** -> <strong>text</strong>
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Italic: *text* -> <em>text</em>
        escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Inline code: `text` -> <code class="ai-msg-code">$1</code>
        escaped = escaped.replace(/`([^`]+)`/g, '<code class="ai-msg-code">$1</code>');

        const lines = escaped.split('\n');
        let inUl = false;
        let inOl = false;
        let inTable = false;
        let tableHeaders = [];
        let tableRows = [];
        let formattedLines = [];

        function flushTable() {
            if (!inTable) return;
            let html = '<div class="ai-table-scroll"><table class="ai-msg-table">';
            if (tableHeaders.length > 0) {
                html += '<thead><tr>';
                tableHeaders.forEach(th => {
                    html += `<th>${th.trim()}</th>`;
                });
                html += '</tr></thead>';
            }
            if (tableRows.length > 0) {
                html += '<tbody>';
                tableRows.forEach(row => {
                    html += '<tr>';
                    row.forEach(cell => {
                        html += `<td>${cell.trim()}</td>`;
                    });
                    html += '</tr>';
                });
                html += '</tbody>';
            }
            html += '</table></div>';
            formattedLines.push(html);
            inTable = false;
            tableHeaders = [];
            tableRows = [];
        }

        function flushLists() {
            if (inUl) {
                formattedLines.push('</ul>');
                inUl = false;
            }
            if (inOl) {
                formattedLines.push('</ol>');
                inOl = false;
            }
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Table row detection: lines starting and ending with |
            if (line.startsWith('|') && line.endsWith('|')) {
                flushLists();
                // Check if it's separator row |---|---|
                if (/^\|[\s\-:|]+\|$/.test(line)) {
                    continue;
                }
                const cells = line.slice(1, -1).split('|');
                if (!inTable) {
                    inTable = true;
                    tableHeaders = cells;
                } else {
                    tableRows.push(cells);
                }
                continue;
            } else if (inTable) {
                flushTable();
            }

            // Headings already replaced with tags
            if (/^<h[3-6] class="ai-msg-h[3-6]">/.test(line)) {
                flushLists();
                formattedLines.push(line);
                continue;
            }

            // Unordered list: - or *
            if (/^[-*]\s+(.*)$/.test(line)) {
                if (inOl) {
                    formattedLines.push('</ol>');
                    inOl = false;
                }
                if (!inUl) {
                    formattedLines.push('<ul class="ai-msg-list">');
                    inUl = true;
                }
                const content = line.replace(/^[-*]\s+/, '');
                formattedLines.push(`<li>${content}</li>`);
                continue;
            }

            // Ordered list: 1. 2. etc.
            if (/^\d+\.\s+(.*)$/.test(line)) {
                if (inUl) {
                    formattedLines.push('</ul>');
                    inUl = false;
                }
                if (!inOl) {
                    formattedLines.push('<ol class="ai-msg-list ai-msg-ol">');
                    inOl = true;
                }
                const content = line.replace(/^\d+\.\s+/, '');
                formattedLines.push(`<li>${content}</li>`);
                continue;
            }

            // Regular paragraph or threat callout
            flushLists();
            if (line) {
                if (/DEFCON [1-5]/i.test(line) || /HIGH ALERT|ELEVATED|MODERATE|LOW \/ SAFE/i.test(line)) {
                    formattedLines.push(`<p class="ai-msg-p ai-threat-callout">${line}</p>`);
                } else {
                    formattedLines.push(`<p class="ai-msg-p">${line}</p>`);
                }
            }
        }

        flushLists();
        flushTable();

        return formattedLines.join('');
    }

    // Build DOM structure
    function injectCopilotDOM() {
        if (document.getElementById('ai-copilot-panel')) return;

        // Trigger Button
        const trigger = document.createElement('button');
        trigger.id = 'ai-copilot-trigger';
        trigger.className = 'ai-copilot-trigger';
        trigger.type = 'button';
        trigger.setAttribute('aria-label', 'Open CrimeWatch Tactical AI Copilot');
        trigger.setAttribute('title', 'CrimeWatch AI // Tactical Intelligence Assistant');
        trigger.innerHTML = `
            <div class="ai-trigger-pulse"></div>
            <div class="ai-trigger-icon-wrap">
                <svg class="ai-trigger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                </svg>
            </div>
            <div class="ai-trigger-text">
                <span class="ai-trigger-label">AI COPILOT</span>
                <span class="ai-trigger-sub">INTEL 2.9</span>
            </div>
            <span class="ai-trigger-beacon" aria-hidden="true"></span>
        `;

        // Panel Container
        const panel = document.createElement('div');
        panel.id = 'ai-copilot-panel';
        panel.className = 'ai-copilot-panel hidden';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'false');
        panel.innerHTML = `
            <!-- Panel Header -->
            <div class="ai-panel-header">
                <div class="ai-header-brand">
                    <div class="ai-header-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="9"></circle>
                            <path d="M9 9h.01M15 9h.01M9 15c1.5 1.5 4.5 1.5 6 0"></path>
                        </svg>
                    </div>
                    <div class="ai-header-info">
                        <div class="ai-header-title">CRIMEWATCH AI // TACTICAL COPILOT</div>
                        <div class="ai-header-status">
                            <span class="ai-status-pulse"></span>
                            <span id="ai-status-text">Live Intelligence Engine • Online</span>
                        </div>
                    </div>
                </div>
                <div class="ai-header-actions">
                    <button type="button" class="ai-btn-icon" id="ai-btn-clear" title="Clear Chat History">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                    <button type="button" class="ai-btn-icon" id="ai-btn-minimize" title="Minimize Copilot">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Active Context Indicator -->
            <div class="ai-context-strip">
                <div class="ai-context-meta">
                    <span class="ai-context-tag">RADAR CONTEXT:</span>
                    <span class="ai-context-val" id="ai-active-context-tag">Chicago, USA</span>
                </div>
                <button type="button" class="ai-refresh-suggestions-btn" id="ai-refresh-suggestions" title="Refresh smart query chips">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6M1 20v-6h6"></path>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <span>Suggestions</span>
                </button>
            </div>

            <!-- Quick Suggestion Chips -->
            <div class="ai-suggestions-container" id="ai-suggestions-container">
                <!-- Populated dynamically -->
            </div>

            <!-- Chat Stream Scroll Area -->
            <div class="ai-chat-messages" id="ai-chat-messages">
                <!-- Messages appended here -->
            </div>

            <!-- Input Control Bar -->
            <form class="ai-input-form" id="ai-input-form">
                <div class="ai-input-wrapper">
                    <textarea id="ai-user-input" class="ai-textarea" rows="1" placeholder="Ask AI Copilot (e.g. 'Peak crime hours', 'Tokyo vs Chicago')..." maxlength="600"></textarea>
                    <button type="submit" class="ai-send-btn" id="ai-send-btn" title="Send Intelligence Query (Enter)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
                <div class="ai-input-hint">
                    <span>Press <strong>Enter</strong> to transmit • <strong>Shift+Enter</strong> for newline</span>
                    <span class="ai-model-tag">Edge Fast-Inference</span>
                </div>
            </form>
        `;

        document.body.appendChild(trigger);
        document.body.appendChild(panel);

        bindCopilotEvents(trigger, panel);
        updateContextLabel();
        loadSuggestions();
        loadSavedHistoryOrGreeting();
    }

    // Bind all user events
    function bindCopilotEvents(triggerEl, panelEl) {
        const trigger = triggerEl || document.getElementById('ai-copilot-trigger');
        const panel = panelEl || document.getElementById('ai-copilot-panel');
        const btnMinimize = document.getElementById('ai-btn-minimize');
        const btnClear = document.getElementById('ai-btn-clear');
        const btnRefresh = document.getElementById('ai-refresh-suggestions');
        const form = document.getElementById('ai-input-form');
        const textarea = document.getElementById('ai-user-input');

        // Toggle panel open / close
        if (trigger && panel) {
            trigger.addEventListener('click', () => {
                const isHidden = panel.classList.contains('hidden');
                if (isHidden) {
                    openCopilot();
                } else {
                    closeCopilot();
                }
            });
        }

        if (btnMinimize) {
            btnMinimize.addEventListener('click', closeCopilot);
        }

        // Escape key closes panel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel && !panel.classList.contains('hidden')) {
                closeCopilot();
            }
        });

        // Clear history
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                chatHistory = [];
                sessionStorage.removeItem(STORAGE_KEY);
                const msgBox = document.getElementById('ai-chat-messages');
                if (msgBox) msgBox.innerHTML = '';
                renderGreeting();
            });
        }

        // Refresh suggestions
        if (btnRefresh) {
            btnRefresh.addEventListener('click', () => {
                loadSuggestions(true);
            });
        }

        // Textarea auto-resize and Enter to submit
        if (form && textarea) {
            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    form.dispatchEvent(new Event('submit', { cancelable: true }));
                }
            });

            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 110) + 'px';
            });

            // Form submit
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const text = textarea.value.trim();
                if (!text || isWaitingForResponse) return;

                textarea.value = '';
                textarea.style.height = 'auto';
                await handleUserMessage(text);
            });
        }
    }

    function openCopilot() {
        const panel = document.getElementById('ai-copilot-panel');
        const trigger = document.getElementById('ai-copilot-trigger');
        if (!panel) return;
        panel.classList.remove('hidden');
        trigger.classList.add('active');
        updateContextLabel();
        loadSuggestions();
        
        // Focus textarea
        const textarea = document.getElementById('ai-user-input');
        if (textarea) setTimeout(() => textarea.focus(), 150);
        scrollToBottom();
    }

    function closeCopilot() {
        const panel = document.getElementById('ai-copilot-panel');
        const trigger = document.getElementById('ai-copilot-trigger');
        if (!panel) return;
        panel.classList.add('hidden');
        trigger.classList.remove('active');
    }

    function updateContextLabel() {
        const tag = document.getElementById('ai-active-context-tag');
        if (!tag) return;
        const city = getCurrentCity();
        const view = getCurrentView();
        const viewClean = view.replace('view-', '').replace('india-', '').toUpperCase();
        tag.textContent = `${city} [${viewClean}]`;
    }

    // Load smart suggestion chips
    async function loadSuggestions(force = false) {
        const container = document.getElementById('ai-suggestions-container');
        if (!container) return;

        const city = getCurrentCity();
        const isIndia = isIndiaPage();

        try {
            const url = `/api/ai/suggestions?city=${encodeURIComponent(city)}&is_india=${isIndia ? 'true' : 'false'}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                renderSuggestions(data.suggestions || []);
            } else {
                renderDefaultSuggestions();
            }
        } catch (err) {
            renderDefaultSuggestions();
        }
    }

    function renderDefaultSuggestions() {
        const defaults = isIndiaPage() 
            ? [
                { label: '📊 State Safety Rankings', query: 'Show state rankings and chargesheet rates' },
                { label: '⏰ Peak Incident Hours', query: 'What are the peak incident hours?' },
                { label: '🛡️ Women Safety Trends', query: 'Analyze crimes against women 2001-2014 trends' },
                { label: '🚨 National ERSS 112', query: 'How does emergency ERSS 112 dispatch work?' }
              ]
            : [
                { label: '⏰ Peak Crime Hours', query: 'What are the peak crime hours?' },
                { label: '🛡️ Shift Briefing', query: 'Give me a tactical shift patrol briefing' },
                { label: '📍 District Hotspots', query: 'Rank the most critical district hotspots' },
                { label: '🌐 Compare Tokyo vs Chicago', query: 'Compare Chicago vs Tokyo safety' },
                { label: '🔍 Violent Crime Filter', query: 'Filter violent crimes' }
              ];
        renderSuggestions(defaults);
    }

    function renderSuggestions(suggestions) {
        const container = document.getElementById('ai-suggestions-container');
        if (!container) return;
        container.innerHTML = '';

        (suggestions || []).forEach(item => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'ai-suggestion-chip';
            const labelText = typeof item === 'string' ? item : (item.label || item.query || '');
            const queryText = typeof item === 'string' ? item : (item.query || item.label || '');
            chip.innerHTML = `<span>${escapeHtml(labelText)}</span>`;
            chip.addEventListener('click', () => {
                handleUserMessage(queryText);
            });
            container.appendChild(chip);
        });
    }

    // Message Streaming & Rendering
    function renderGreeting() {
        const isIndia = isIndiaPage();
        const city = getCurrentCity();
        const greetingText = isIndia
            ? `### 🇮🇳 CrimeWatch AI // National Intelligence Copilot
Welcome, Officer. I am your synchronized tactical assistant monitoring **36 States & UTs** and **780+ Police Districts** across the Republic of India.

Ask me about:
- **State & District Risk Dossiers** (Chargesheet rates, IPC volume, violent crime ratio)
- **Crimes Against Women Longitudinal Analysis** (2001–2014 legal inflection & Sec 354/498A/304B)
- **Peak Incident Windows** & patrol resource allocation
- **Cyber Crime (1930) & ERSS 112 Dispatch Protocols**`
            : `### 🛡️ CrimeWatch AI // Tactical Intelligence Copilot
Welcome to the Tactical Command Center. I monitor real-time crime incidents for **${escapeHtml(city)}** and over **150+ monitored world metropolitan areas**.

You can ask me to:
- **Analyze 24-Hour Diurnal Peak Windows** and vulnerability zones
- **Compare City Safety Indices** (e.g. *Chicago vs Tokyo* or *London vs NYC*)
- **Generate Immediate Tactical Patrol Shift Briefings**
- **Execute Dashboard Directives** like filtering violent offenses or switching geospatial views`;

        const defaultActions = isIndia
            ? [
                { label: '🇮🇳 National Briefing', action: 'switch_view', payload: 'view-india-briefing' },
                { label: '🗺️ Open GIS Heatmap', action: 'switch_view', payload: 'view-india-gis' },
                { label: '🏛️ Explorer', action: 'switch_view', payload: 'view-india-explorer' }
              ]
            : [
                { label: '📊 Shift Patrol Briefing', action: 'query', payload: 'Give me a tactical shift patrol briefing' },
                { label: '⏰ Peak Crime Hours', action: 'query', payload: 'What are the peak crime hours?' },
                { label: '🗺️ GIS Heatmap', action: 'switch_view', payload: 'view-map' }
              ];

        appendBotMessage(greetingText, defaultActions, false);
    }

    function loadSavedHistoryOrGreeting() {
        try {
            const saved = sessionStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                chatHistory = (Array.isArray(parsed) ? parsed : []).filter(item => 
                    item && item.content && !item.content.includes('Intelligence Service') && !item.content.includes('Tactical Telemetry Error')
                );
                if (chatHistory.length > 0) {
                    const msgBox = document.getElementById('ai-chat-messages');
                    if (msgBox) msgBox.innerHTML = '';
                    
                    chatHistory.forEach(item => {
                        if (item.role === 'user') {
                            appendUserMessage(item.content, false);
                        } else if (item.role === 'assistant') {
                            appendBotMessage(item.content, item.suggested_actions || [], false);
                        }
                    });
                    return;
                }
            }
        } catch (e) {
            console.warn('Could not restore AI history:', e);
        }
        chatHistory = [];
        renderGreeting();
    }

    function saveHistory() {
        try {
            // Keep last 16 turns to avoid memory growth
            const trimmed = chatHistory.slice(-16);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        } catch (e) {
            // ignore storage full
        }
    }

    function appendUserMessage(text, record = true) {
        const msgBox = document.getElementById('ai-chat-messages');
        if (!msgBox) return;

        const row = document.createElement('div');
        row.className = 'ai-msg-row ai-msg-user';
        row.innerHTML = `
            <div class="ai-msg-bubble">
                <div class="ai-msg-content">${escapeHtml(text)}</div>
                <div class="ai-msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;
        msgBox.appendChild(row);
        scrollToBottom();

        if (record) {
            chatHistory.push({ role: 'user', content: text });
            saveHistory();
        }
    }

    function appendBotMessage(markdownText, actions = [], record = true) {
        const msgBox = document.getElementById('ai-chat-messages');
        if (!msgBox) return;

        const row = document.createElement('div');
        row.className = 'ai-msg-row ai-msg-bot';

        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-bubble';

        const content = document.createElement('div');
        content.className = 'ai-msg-content';
        content.innerHTML = formatMarkdown(markdownText);
        bubble.appendChild(content);

        // Action Buttons Row if any
        if (actions && actions.length > 0) {
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'ai-actions-wrap';

            actions.forEach(act => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'ai-action-btn';
                btn.innerHTML = `
                    <span class="ai-action-label">${escapeHtml(act.label)}</span>
                `;
                btn.addEventListener('click', () => {
                    executeCopilotAction(act);
                });
                actionsContainer.appendChild(btn);
            });

            bubble.appendChild(actionsContainer);
        }

        // Timestamp & Badge
        const timeEl = document.createElement('div');
        timeEl.className = 'ai-msg-meta';
        timeEl.innerHTML = `
            <span class="ai-meta-tag">AI TACTICAL</span>
            <span class="ai-msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        `;
        bubble.appendChild(timeEl);

        row.appendChild(bubble);
        msgBox.appendChild(row);
        scrollToBottom();

        if (record) {
            chatHistory.push({ role: 'assistant', content: markdownText, suggested_actions: actions });
            saveHistory();
        }
    }

    // Typing / Thinking Indicator
    function showTypingIndicator() {
        const msgBox = document.getElementById('ai-chat-messages');
        if (!msgBox) return;

        const row = document.createElement('div');
        row.id = 'ai-typing-indicator';
        row.className = 'ai-msg-row ai-msg-bot ai-typing-row';
        row.innerHTML = `
            <div class="ai-msg-bubble ai-typing-bubble">
                <div class="ai-typing-dots">
                    <span class="ai-dot"></span>
                    <span class="ai-dot"></span>
                    <span class="ai-dot"></span>
                </div>
                <span class="ai-typing-status">Analyzing spatial patterns & database vectors...</span>
            </div>
        `;
        msgBox.appendChild(row);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const ind = document.getElementById('ai-typing-indicator');
        if (ind) ind.remove();
    }

    function scrollToBottom() {
        const msgBox = document.getElementById('ai-chat-messages');
        if (msgBox) {
            msgBox.scrollTop = msgBox.scrollHeight;
        }
    }

    // Execute actions requested by Copilot replies
    async function executeCopilotAction(actionObj) {
        if (!actionObj) return;
        const action = actionObj.action;
        const payload = actionObj.payload || actionObj.param || '';

        switch (action) {
            case 'switch_city':
                if (window.switchCity) {
                    await window.switchCity(payload);
                    showToastNotification(`Active surveillance switched to ${payload}`);
                } else if (!isIndiaPage()) {
                    const citySelect = document.getElementById('filter-city');
                    if (citySelect) {
                        citySelect.value = payload;
                        citySelect.dispatchEvent(new Event('change'));
                        showToastNotification(`Switched city to ${payload}`);
                    }
                } else {
                    window.location.href = `/?city=${encodeURIComponent(payload)}`;
                }
                updateContextLabel();
                break;

            case 'switch_view':
                let targetView = payload;
                if (isIndiaPage()) {
                    if (targetView === 'view-spatial' || targetView === 'view-map') targetView = 'view-india-gis';
                    else if (targetView === 'view-trends') targetView = 'view-india-trends';
                    else if (targetView === 'view-predictive') targetView = 'view-india-predictive';
                    else if (targetView === 'view-explorer') targetView = 'view-india-explorer';
                    else if (targetView === 'view-report') targetView = 'view-india-briefing';
                } else {
                    if (targetView === 'view-spatial') targetView = 'view-map';
                }

                const tab = document.querySelector(`.nav-tab[data-view="${targetView}"]`) || document.querySelector(`[data-view="${targetView}"]`);
                if (tab) {
                    tab.click();
                    showToastNotification(`Navigated to view: ${targetView.replace('view-', '').replace('india-', '')}`);
                } else {
                    const panel = document.getElementById(targetView);
                    if (panel) {
                        document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
                        panel.classList.add('active');
                    }
                }
                updateContextLabel();
                break;

            case 'navigate_page':
                if (payload) {
                    window.location.href = payload;
                }
                break;

            case 'filter_violent':
                const violentBtn = document.querySelector('#toggle-violence button[data-val="1"]');
                if (violentBtn) {
                    violentBtn.click();
                    showToastNotification('Violent Crimes filter applied');
                } else {
                    const crimeSelect = document.getElementById('filter-crime-type');
                    if (crimeSelect) {
                        crimeSelect.value = 'HOMICIDE';
                        crimeSelect.dispatchEvent(new Event('change'));
                    }
                }
                break;

            case 'filter_district':
                const distSelect = document.getElementById('filter-district');
                if (distSelect) {
                    distSelect.value = payload;
                    distSelect.dispatchEvent(new Event('change'));
                    showToastNotification(`Focused on District ${payload}`);
                }
                break;

            case 'call_helpline':
                window.location.href = `tel:${payload}`;
                break;

            case 'copy_text':
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(payload);
                    showToastNotification(`Copied to clipboard: ${payload}`);
                }
                break;

            case 'export_csv':
                if (isIndiaPage()) {
                    window.open('/api/india/incidents/export', '_blank');
                } else {
                    window.open('/api/crimes/export', '_blank');
                }
                break;

            case 'query':
            case 'copilot_query':
                await handleUserMessage(payload);
                break;

            default:
                console.log('Unhandled Copilot Action:', actionObj);
        }
    }

    function showToastNotification(msg) {
        const toast = document.getElementById('safety-toast');
        const text = document.getElementById('safety-toast-message');
        if (toast && text) {
            text.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3200);
        }
    }

    // Handle user query execution
    async function handleUserMessage(queryText) {
        appendUserMessage(queryText, true);

        isWaitingForResponse = true;
        showTypingIndicator();

        const statusText = document.getElementById('ai-status-text');
        if (statusText) statusText.textContent = 'Processing Tactical Query...';

        const context = {
            city: getCurrentCity(),
            view: getCurrentView(),
            is_india: isIndiaPage()
        };

        // Send clean sanitized history to guarantee 100% schema compliance
        const cleanHistory = chatHistory.slice(-8).map(item => ({
            role: item.role || 'user',
            content: typeof item.content === 'string' ? item.content : ''
        }));

        try {
            const res = await fetch('/api/ai/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: queryText,
                    context: context,
                    history: cleanHistory
                })
            });

            hideTypingIndicator();
            isWaitingForResponse = false;
            if (statusText) statusText.textContent = 'Live Intelligence Engine • Ready';

            if (res.ok) {
                const data = await res.json();
                appendBotMessage(data.reply, data.suggested_actions || [], true);
            } else {
                let errDetail = 'Unable to complete tactical analysis. Please retry.';
                try {
                    const errJson = await res.json();
                    if (errJson && errJson.detail) {
                        errDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
                    }
                } catch (_) {}
                appendBotMessage(
                    `⚠️ **Intelligence Service Alert**\n${errDetail}`,
                    [{ label: '🔄 Retry Query', action: 'query', payload: queryText }],
                    true
                );
            }
        } catch (err) {
            console.error('Error communicating with AI Copilot:', err);
            hideTypingIndicator();
            isWaitingForResponse = false;
            if (statusText) statusText.textContent = 'Live Intelligence Engine • Ready';

            appendBotMessage(
                `⚠️ **Tactical Telemetry Error**\nCould not establish connection to local intelligence engine: \`${err.message}\`. Ensure the backend server is running.`,
                [{ label: '🔄 Retry', action: 'query', payload: queryText }],
                true
            );
        }
    }

    // Auto-init safely
    function safeInit() {
        if (document.body) {
            injectCopilotDOM();
        } else {
            document.addEventListener('DOMContentLoaded', injectCopilotDOM);
        }
    }
    safeInit();

    // Expose control API to window for testing / extensions
    window.CrimeWatchCopilot = {
        open: openCopilot,
        close: closeCopilot,
        ask: handleUserMessage,
        clear: () => {
            const btn = document.getElementById('ai-btn-clear');
            if (btn) btn.click();
        }
    };

})();
