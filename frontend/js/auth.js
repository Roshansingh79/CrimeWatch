/**
 * CrimeWatch Authentication Client Module
 * Manages user login, registration, persistent session tokens,
 * topbar user profile widget, and auth modal dialogs.
 */

const CrimeWatchAuth = {
    TOKEN_KEY: "crimewatch_auth_token",
    currentUser: null,

    /**
     * Initialize Auth Engine on Page Load
     */
    async init() {
        this.bindEvents();
        await this.checkSession();
    },

    /**
     * Get Stored Session Token
     */
    getToken() {
        try {
            return localStorage.getItem(this.TOKEN_KEY);
        } catch (e) {
            return null;
        }
    },

    /**
     * Store Session Token
     */
    setToken(token) {
        try {
            if (token) {
                localStorage.setItem(this.TOKEN_KEY, token);
            } else {
                localStorage.removeItem(this.TOKEN_KEY);
            }
        } catch (e) {
            console.warn("Storage access restricted:", e);
        }
    },

    /**
     * Check Active Session with Server
     */
    async checkSession() {
        const token = this.getToken();
        if (!token) {
            this.updateUiLoggedOut();
            return;
        }

        try {
            const res = await fetch("/api/auth/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data && data.authenticated && data.user) {
                this.currentUser = data.user;
                this.updateUiLoggedIn(data.user);
            } else {
                this.setToken(null);
                this.currentUser = null;
                this.updateUiLoggedOut();
            }
        } catch (e) {
            console.error("Auth session check error:", e);
            this.updateUiLoggedOut();
        }
    },

    /**
     * Handle Login Submission
     */
    async handleLogin(email, password, submitBtn) {
        this.clearAlert();
        if (!email || !password) {
            this.showAlert("Please enter both your email address and password.", "error");
            return;
        }

        this.setLoading(submitBtn, true, "Signing In...");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                this.showAlert(data.detail || "Invalid email or password.", "error");
                this.setLoading(submitBtn, false, "Sign In");
                return;
            }

            this.setToken(data.token);
            this.currentUser = data.user;
            this.updateUiLoggedIn(data.user);
            this.closeModal();
            this.showToast(`Welcome back, ${data.user.name}!`);

            // Reset login form
            const form = document.getElementById("form-auth-login");
            if (form) form.reset();
        } catch (e) {
            this.showAlert("Connection error. Please verify the server is running.", "error");
        } finally {
            this.setLoading(submitBtn, false, "Sign In");
        }
    },

    /**
     * Handle Sign Up Submission
     */
    async handleSignup(payload, submitBtn) {
        this.clearAlert();
        const { name, email, password, confirmPassword, role, organization, badgeNumber } = payload;

        if (!name || name.length < 2) {
            this.showAlert("Please provide your full name (at least 2 characters).", "error");
            return;
        }
        if (!email || !email.includes("@")) {
            this.showAlert("Please provide a valid official or personal email address.", "error");
            return;
        }
        if (!password || password.length < 6) {
            this.showAlert("Password must be at least 6 characters long.", "error");
            return;
        }
        if (password !== confirmPassword) {
            this.showAlert("Passwords do not match. Please re-enter.", "error");
            return;
        }

        this.setLoading(submitBtn, true, "Creating Account...");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    organization: organization || undefined,
                    badge_number: badgeNumber || undefined
                })
            });

            const data = await res.json();

            if (!res.ok) {
                this.showAlert(data.detail || "Registration failed.", "error");
                this.setLoading(submitBtn, false, "Create Account");
                return;
            }

            this.setToken(data.token);
            this.currentUser = data.user;
            this.updateUiLoggedIn(data.user);
            this.closeModal();
            this.showToast(`Account successfully created! Welcome, ${data.user.name}.`);

            // Reset signup form
            const form = document.getElementById("form-auth-signup");
            if (form) form.reset();
        } catch (e) {
            this.showAlert("Network failure while registering. Please try again.", "error");
        } finally {
            this.setLoading(submitBtn, false, "Create Account");
        }
    },

    /**
     * Handle User Logout
     */
    async logout() {
        const token = this.getToken();
        if (token) {
            try {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` }
                });
            } catch (e) {
                // Ignore failure
            }
        }
        this.setToken(null);
        this.currentUser = null;
        this.updateUiLoggedOut();
        this.closeProfileMenu();
        this.showToast("Signed out successfully.");
    },

    /**
     * Update Navigation UI for Logged Out State
     */
    updateUiLoggedOut() {
        const authBtn = document.getElementById("topbar-auth-btn");
        const profileWidget = document.getElementById("topbar-user-profile");
        if (authBtn) authBtn.style.display = "inline-flex";
        if (profileWidget) profileWidget.style.display = "none";
    },

    /**
     * Update Navigation UI for Logged In State
     */
    updateUiLoggedIn(user) {
        const authBtn = document.getElementById("topbar-auth-btn");
        const profileWidget = document.getElementById("topbar-user-profile");
        const avatarEl = document.getElementById("topbar-user-avatar");
        const nameEl = document.getElementById("topbar-user-name");
        const roleBadge = document.getElementById("topbar-user-role");

        // Profile Menu elements
        const menuName = document.getElementById("menu-user-name");
        const menuEmail = document.getElementById("menu-user-email");
        const menuRole = document.getElementById("menu-user-role");
        const menuOrg = document.getElementById("menu-user-org");

        if (authBtn) authBtn.style.display = "none";
        if (profileWidget) profileWidget.style.display = "inline-flex";

        const initials = (user.name || "U")
            .split(" ")
            .map(p => p[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        if (avatarEl) avatarEl.textContent = initials;
        if (nameEl) nameEl.textContent = user.name;
        if (roleBadge) {
            roleBadge.textContent = user.role.toUpperCase();
            roleBadge.className = `user-role-badge role-${user.role}`;
        }

        if (menuName) menuName.textContent = user.name;
        if (menuEmail) menuEmail.textContent = user.email;
        if (menuRole) menuRole.textContent = user.role.toUpperCase();
        if (menuOrg) {
            const orgText = [user.organization, user.badge_number ? `Badge #${user.badge_number}` : null].filter(Boolean).join(" • ");
            menuOrg.textContent = orgText || "Verified Citizen / Analyst";
        }
    },

    /**
     * Open Auth Modal (defaults to 'login' or 'signup' tab)
     */
    openModal(initialTab = "login") {
        const modal = document.getElementById("modal-auth");
        if (!modal) return;
        this.clearAlert();
        this.switchTab(initialTab);
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        // Autofocus first input
        setTimeout(() => {
            const activeInput = modal.querySelector(initialTab === "login" ? "#auth-login-email" : "#auth-signup-name");
            if (activeInput) activeInput.focus();
        }, 120);
    },

    /**
     * Close Auth Modal
     */
    closeModal() {
        const modal = document.getElementById("modal-auth");
        if (!modal) return;
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        this.clearAlert();
    },

    /**
     * Switch between Sign In and Create Account tabs
     */
    switchTab(tab) {
        const tabLoginBtn = document.getElementById("auth-tab-login");
        const tabSignupBtn = document.getElementById("auth-tab-signup");
        const formLogin = document.getElementById("form-auth-login");
        const formSignup = document.getElementById("form-auth-signup");

        this.clearAlert();

        if (tab === "signup") {
            if (tabLoginBtn) tabLoginBtn.classList.remove("active");
            if (tabSignupBtn) tabSignupBtn.classList.add("active");
            if (formLogin) formLogin.style.display = "none";
            if (formSignup) formSignup.style.display = "block";
        } else {
            if (tabLoginBtn) tabLoginBtn.classList.add("active");
            if (tabSignupBtn) tabSignupBtn.classList.remove("active");
            if (formLogin) formLogin.style.display = "block";
            if (formSignup) formSignup.style.display = "none";
        }
    },

    /**
     * Toggle User Profile Dropdown Menu
     */
    toggleProfileMenu() {
        const menu = document.getElementById("user-profile-dropdown");
        if (menu) {
            menu.classList.toggle("active");
        }
    },

    closeProfileMenu() {
        const menu = document.getElementById("user-profile-dropdown");
        if (menu) menu.classList.remove("active");
    },

    /**
     * Alert Box Handling inside Modal
     */
    showAlert(msg, type = "error") {
        const alertBox = document.getElementById("auth-alert-box");
        if (!alertBox) return;
        alertBox.textContent = msg;
        alertBox.className = `auth-alert-box alert-${type}`;
        alertBox.style.display = "block";
    },

    clearAlert() {
        const alertBox = document.getElementById("auth-alert-box");
        if (alertBox) {
            alertBox.textContent = "";
            alertBox.style.display = "none";
        }
    },

    /**
     * Button Loading State Helper
     */
    setLoading(btn, isLoading, text) {
        if (!btn) return;
        btn.disabled = isLoading;
        if (isLoading) {
            btn.innerHTML = `<span class="auth-spinner"></span> <span>${text}</span>`;
        } else {
            btn.innerHTML = text;
        }
    },

    /**
     * Universal Toast Notification
     */
    showToast(message) {
        if (typeof showToast === "function") {
            showToast(message);
        } else if (typeof showSafetyToast === "function") {
            showSafetyToast(message);
        } else {
            const toast = document.createElement("div");
            toast.className = "safety-toast";
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add("show"), 10);
            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => toast.remove(), 400);
            }, 3500);
        }
    },

    /**
     * Bind DOM Event Handlers
     */
    bindEvents() {
        // 1. Topbar Trigger Button
        const authTrigger = document.getElementById("topbar-auth-btn");
        if (authTrigger) {
            authTrigger.addEventListener("click", () => this.openModal("login"));
        }

        // 2. Profile Badge Toggle
        const profileTrigger = document.getElementById("topbar-user-profile");
        if (profileTrigger) {
            profileTrigger.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleProfileMenu();
            });
        }

        // Close profile dropdown on outside click
        document.addEventListener("click", (e) => {
            if (!e.target.closest("#topbar-user-profile") && !e.target.closest("#user-profile-dropdown")) {
                this.closeProfileMenu();
            }
        });

        // 3. Modal Close Buttons
        const closeBtn = document.getElementById("btn-close-auth-modal");
        if (closeBtn) closeBtn.addEventListener("click", () => this.closeModal());

        const modalBackdrop = document.getElementById("modal-auth");
        if (modalBackdrop) {
            modalBackdrop.addEventListener("click", (e) => {
                if (e.target === modalBackdrop) this.closeModal();
            });
        }

        // ESC Key listener
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.closeModal();
                this.closeProfileMenu();
            }
        });

        // 4. Tab Switcher
        const tabLogin = document.getElementById("auth-tab-login");
        const tabSignup = document.getElementById("auth-tab-signup");
        if (tabLogin) tabLogin.addEventListener("click", () => this.switchTab("login"));
        if (tabSignup) tabSignup.addEventListener("click", () => this.switchTab("signup"));

        // Switch to sign up link inside login form
        const toSignupLink = document.getElementById("link-to-signup");
        if (toSignupLink) {
            toSignupLink.addEventListener("click", (e) => {
                e.preventDefault();
                this.switchTab("signup");
            });
        }

        // Switch to login link inside signup form
        const toLoginLink = document.getElementById("link-to-login");
        if (toLoginLink) {
            toLoginLink.addEventListener("click", (e) => {
                e.preventDefault();
                this.switchTab("login");
            });
        }

        // 5. Password Visibility Toggles
        document.querySelectorAll(".btn-toggle-password").forEach(btn => {
            btn.addEventListener("click", () => {
                const targetId = btn.getAttribute("data-target");
                const input = document.getElementById(targetId);
                if (!input) return;
                const isPass = input.type === "password";
                input.type = isPass ? "text" : "password";
                btn.innerHTML = isPass ? `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                ` : `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                `;
            });
        });

        // 6. Login Form Submit
        const formLogin = document.getElementById("form-auth-login");
        if (formLogin) {
            formLogin.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = document.getElementById("auth-login-email")?.value.trim();
                const pass = document.getElementById("auth-login-password")?.value;
                const submitBtn = document.getElementById("btn-submit-login");
                this.handleLogin(email, pass, submitBtn);
            });
        }

        // 7. Signup Form Submit
        const formSignup = document.getElementById("form-auth-signup");
        if (formSignup) {
            formSignup.addEventListener("submit", (e) => {
                e.preventDefault();
                const name = document.getElementById("auth-signup-name")?.value.trim();
                const email = document.getElementById("auth-signup-email")?.value.trim();
                const password = document.getElementById("auth-signup-password")?.value;
                const confirmPassword = document.getElementById("auth-signup-confirm-password")?.value;
                const role = document.getElementById("auth-signup-role")?.value || "analyst";
                const organization = document.getElementById("auth-signup-org")?.value.trim();
                const badgeNumber = document.getElementById("auth-signup-badge")?.value.trim();
                const submitBtn = document.getElementById("btn-submit-signup");

                this.handleSignup({
                    name,
                    email,
                    password,
                    confirmPassword,
                    role,
                    organization,
                    badgeNumber
                }, submitBtn);
            });
        }

        // 8. Logout Trigger
        const btnLogout = document.getElementById("btn-user-logout");
        if (btnLogout) {
            btnLogout.addEventListener("click", () => this.logout());
        }
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => CrimeWatchAuth.init());
} else {
    CrimeWatchAuth.init();
}
