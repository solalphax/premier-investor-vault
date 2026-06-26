// js/auth.js
/**
 * PREMIER INVESTOR VAULT — Authentication System
 * Handles login, logout, session management, and route guards
 */

const Auth = {
  /**
   * Initialize auth system and check for existing session
   */
  init() {
    this.checkSession();
    this.bindEvents();
  },

  /**
   * Bind global auth events
   */
  bindEvents() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  },

  /**
   * Handle login form submission
   */
  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorEl = document.getElementById('loginError');

    if (!username || !password) {
      this.showError(errorEl, 'Please enter both username and password.');
      return;
    }

    const user = this.validateCredentials(username, password);
    if (user) {
      this.createSession(user);
      window.location.href = 'dashboard.html';
    } else {
      this.showError(errorEl, 'Invalid credentials. Please try again.');
      this.shakeForm();
    }
  },

  /**
   * Validate user credentials against stored data
   */
  validateCredentials(username, password) {
    const users = Storage.getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return null;

    // In production, use bcrypt. Here we use simple comparison for demo.
    const hashedInput = this.hashPassword(password);
    return user.passwordHash === hashedInput ? user : null;
  },

  /**
   * Simple hash function for demo purposes (NOT for production)
   */
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return 'piv_' + Math.abs(hash).toString(16);
  },

  /**
   * Create user session in localStorage
   */
  createSession(user) {
    const session = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      loginTime: new Date().toISOString(),
      expiresAt: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  },

  /**
   * Get current session data
   */
  getSession() {
    const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionData) return null;
    
    try {
      const session = JSON.parse(sessionData);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  },

  /**
   * Check if user is authenticated, redirect if not
   */
  checkSession() {
    const session = this.getSession();
    const isAuthPage = document.body.classList.contains('auth-page');
    
    if (!session && !isAuthPage) {
      window.location.href = 'index.html';
      return false;
    }
    
    if (session && isAuthPage) {
      window.location.href = 'dashboard.html';
      return false;
    }
    
    if (session) {
      this.updateUserDisplay(session);
    }
    
    return !!session;
  },

  /**
   * Update UI elements with current user info
   */
  updateUserDisplay(session) {
    const nameEls = document.querySelectorAll('[data-user-name]');
    const roleEls = document.querySelectorAll('[data-user-role]');
    
    nameEls.forEach(el => el.textContent = session.name);
    roleEls.forEach(el => el.textContent = session.role);
  },

  /**
   * Log out and clear session
   */
  logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    window.location.href = 'index.html';
  },

  /**
   * Show error message with animation
   */
  showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.remove('hidden');
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
  },

  /**
   * Shake animation for invalid login
   */
  shakeForm() {
    const form = document.getElementById('loginForm');
    if (form) {
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    }
  },

  /**
   * Generate default passwords for all investors
   * Password format: Firstname + birth year (e.g., Melissa1990)
   */
  generateDefaultPasswords() {
    const passwords = {
      'MelissaBrooks': 'Melissa1990',
      'JonathanMercer': 'Jonathan1985',
      'EthanCaldwell': 'Ethan1988',
      'VictoriaReynolds': 'Victoria1992',
      'MarcusWhitmore': 'Marcus1987',
      'AubreyStawarski': 'Aubrey1995',
      'NathanHolloway': 'Nathan1991',
      'RebeccaSterling': 'Rebecca1989',
      'DerekFitzgerald': 'Derek1986',
      'OliviaHarrington': 'Olivia1993',
      'SebastianCole': 'Sebastian1984',
      'IsabellaMonroe': 'Isabella1994',
      'GraysonWhitfield': 'Grayson1983'
    };
    return passwords;
  }
};

// Auto-initialize auth on page load
document.addEventListener('DOMContentLoaded', () => Auth.init());
