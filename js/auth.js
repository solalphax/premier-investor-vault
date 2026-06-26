/* /js/auth.js - Premier Investor Vault Authentication */
(function() {
    'use strict';

    // Hardcoded credentials
    const VALID_USERNAME = 'DonteG77';
    const VALID_PASSWORD = 'XTokenDG7';

    // Session management
    const AUTH_KEY = 'piv_auth_session';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    const Auth = {
        // Initialize auth module
        init: function() {
            this.bindEvents();
            this.checkSession();
        },

        // Bind login form events
        bindEvents: function() {
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', this.handleLogin.bind(this));
            }

            // Toggle password visibility
            const toggleBtns = document.querySelectorAll('.toggle-password');
            toggleBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const input = this.parentElement.querySelector('input');
                    const icon = this.querySelector('i');
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                });
            });
        },

        // Handle login submission
        handleLogin: function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember-me') ? document.getElementById('remember-me').checked : false;
            const errorMsg = document.getElementById('login-error');

            // Validation
            if (!username || !password) {
                this.showError(errorMsg, 'Please enter both username and password.');
                return;
            }

            // Check credentials
            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                this.createSession(username, remember);
                this.showSuccess(errorMsg, 'Login successful! Redirecting...');
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 800);
            } else {
                this.showError(errorMsg, 'Invalid username or password. Please try again.');
                // Shake animation on form
                const form = document.getElementById('login-form');
                form.style.animation = 'shake 0.5s ease';
                setTimeout(function() {
                    form.style.animation = '';
                }, 500);
            }
        },

        // Create user session
        createSession: function(username, remember) {
            const session = {
                username: username,
                loggedIn: true,
                timestamp: Date.now(),
                remember: remember
            };
            try {
                localStorage.setItem(AUTH_KEY, JSON.stringify(session));
            } catch (e) {
                // Fallback for private browsing
                sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
            }
        },

        // Check existing session
        checkSession: function() {
            let session = null;
            try {
                session = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
            } catch (e) {
                session = sessionStorage.getItem(AUTH_KEY);
            }

            if (session) {
                try {
                    const data = JSON.parse(session);
                    const now = Date.now();
                    const maxAge = data.remember ? (30 * 24 * 60 * 60 * 1000) : SESSION_DURATION;

                    if (data.loggedIn && (now - data.timestamp) < maxAge) {
                        // Valid session - redirect to dashboard if on login page
                        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                            window.location.href = 'dashboard.html';
                        }
                    } else {
                        this.logout();
                    }
                } catch (e) {
                    this.logout();
                }
            }
        },

        // Verify session on protected pages
        requireAuth: function() {
            let session = null;
            try {
                session = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
            } catch (e) {
                session = sessionStorage.getItem(AUTH_KEY);
            }

            if (!session) {
                window.location.href = 'index.html';
                return false;
            }

            try {
                const data = JSON.parse(session);
                if (!data.loggedIn) {
                    window.location.href = 'index.html';
                    return false;
                }
                return data;
            } catch (e) {
                window.location.href = 'index.html';
                return false;
            }
        },

        // Get current user
        getUser: function() {
            const session = this.requireAuth();
            return session ? session.username : null;
        },

        // Logout
        logout: function() {
            try {
                localStorage.removeItem(AUTH_KEY);
            } catch (e) {}
            sessionStorage.removeItem(AUTH_KEY);
            window.location.href = 'index.html';
        },

        // Show error message
        showError: function(el, msg) {
            if (!el) return;
            el.textContent = msg;
            el.style.color = 'var(--danger)';
            el.style.display = 'block';
        },

        // Show success message
        showSuccess: function(el, msg) {
            if (!el) return;
            el.textContent = msg;
            el.style.color = 'var(--success)';
            el.style.display = 'block';
        }
    };

    // Shake animation keyframes (injected if not present)
    if (!document.getElementById('auth-animations')) {
        const style = document.createElement('style');
        style.id = 'auth-animations';
        style.textContent = '@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-10px)} 40%,80%{transform:translateX(10px)} }';
        document.head.appendChild(style);
    }

    // Expose globally
    window.PIVAuth = Auth;

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { Auth.init(); });
    } else {
        Auth.init();
    }
})();
