/* /js/storage.js - Premier Investor Vault Storage Manager */
(function() {
    'use strict';

    const Storage = {
        // Safe storage wrapper (handles private browsing)
        safeSet: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                try {
                    sessionStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (e2) {
                    console.warn('Storage unavailable:', e2);
                    return false;
                }
            }
        },

        safeGet: function(key, defaultValue) {
            let raw = null;
            try {
                raw = localStorage.getItem(key);
            } catch (e) {
                try {
                    raw = sessionStorage.getItem(key);
                } catch (e2) {
                    return defaultValue;
                }
            }
            if (raw === null) return defaultValue;
            try {
                return JSON.parse(raw);
            } catch (e) {
                return raw;
            }
        },

        safeRemove: function(key) {
            try { localStorage.removeItem(key); } catch (e) {}
            try { sessionStorage.removeItem(key); } catch (e) {}
        },

        // App data keys
        keys: {
            PROFILE: 'piv_profile',
            BALANCE: 'piv_balance',
            TRANSACTIONS: 'piv_transactions',
            DOCUMENTS: 'piv_documents',
            SETTINGS: 'piv_settings',
            LAST_TX: 'piv_last_tx',
            PENDING_TX: 'piv_pending_tx',
            NOTIFICATIONS: 'piv_notifications',
            REFUNDS: 'piv_refunds',
            THEME: 'piv_theme'
        },

        // Profile data
        getProfile: function() {
            return this.safeGet(this.keys.PROFILE, {
                name: 'Donte Granison',
                username: 'DonteG77',
                email: 'donte@premiervault.com',
                role: 'Managing Director',
                avatar: null,
                phone: '+1 (555) 019-2847',
                timezone: 'America/New_York',
                joined: '2023-03-15'
            });
        },

        setProfile: function(profile) {
            return this.safeSet(this.keys.PROFILE, profile);
        },

        // Balance data
        getBalance: function() {
            return this.safeGet(this.keys.BALANCE, {
                total: 187620.00,
                available: 187620.00,
                held: 0.00,
                currency: 'USD',
                lastUpdated: Date.now()
            });
        },

        setBalance: function(balance) {
            return this.safeSet(this.keys.BALANCE, balance);
        },

        // Deduct from balance
        deductBalance: function(amount) {
            const bal = this.getBalance();
            bal.total = parseFloat((bal.total - amount).toFixed(2));
            bal.available = parseFloat((bal.available - amount).toFixed(2));
            bal.lastUpdated = Date.now();
            return this.setBalance(bal);
        },

        // Transactions
        getTransactions: function() {
            return this.safeGet(this.keys.TRANSACTIONS, [
                { id: 'TX-2026-001', type: 'deposit', amount: 50000.00, status: 'completed', date: '2026-06-01T10:30:00', description: 'Initial funding' },
                { id: 'TX-2026-002', type: 'deposit', amount: 75000.00, status: 'completed', date: '2026-06-03T14:15:00', description: 'Investor capital injection' },
                { id: 'TX-2026-003', type: 'deposit', amount: 62620.00, status: 'completed', date: '2026-06-05T09:00:00', description: 'Q2 distribution' },
                { id: 'TX-2026-004', type: 'fee', amount: -300.00, status: 'completed', date: '2026-06-10T11:20:00', description: 'Processing fee' },
                { id: 'TX-2026-005', type: 'fee', amount: -800.00, status: 'completed', date: '2026-06-12T16:45:00', description: 'Compliance fee refund' }
            ]);
        },

        addTransaction: function(tx) {
            const txs = this.getTransactions();
            tx.id = tx.id || 'TX-' + new Date().getFullYear() + '-' + String(txs.length + 1).padStart(3, '0');
            tx.date = tx.date || new Date().toISOString();
            txs.unshift(tx);
            this.safeSet(this.keys.TRANSACTIONS, txs);
            return tx;
        },

        // Documents
        getDocuments: function() {
            return this.safeGet(this.keys.DOCUMENTS, [
                { id: 1, title: 'Granison Side Letter', type: 'contract', status: 'pending', date: '2026-06-20', size: '2.4 MB', access: ['DG', 'KL', 'MV'], category: 'legal' },
                { id: 2, title: 'Q2 Financial Report', type: 'financial', status: 'verified', date: '2026-06-15', size: '5.1 MB', access: ['DG', 'KL'], category: 'financial' },
                { id: 3, title: 'Investment Agreement v2.3', type: 'contract', status: 'verified', date: '2026-06-10', size: '1.8 MB', access: ['DG', 'KL', 'MV', 'JR'], category: 'legal' },
                { id: 4, title: 'Compliance Certificate', type: 'compliance', status: 'verified', date: '2026-06-08', size: '890 KB', access: ['DG'], category: 'compliance' },
                { id: 5, title: 'KYC Documentation', type: 'legal', status: 'pending', date: '2026-06-05', size: '3.2 MB', access: ['DG', 'KL'], category: 'legal' },
                { id: 6, title: 'Portfolio Allocation', type: 'financial', status: 'verified', date: '2026-06-01', size: '1.1 MB', access: ['DG', 'MV', 'JR'], category: 'financial' },
                { id: 7, title: 'Risk Assessment', type: 'compliance', status: 'urgent', date: '2026-05-28', size: '4.5 MB', access: ['DG'], category: 'compliance' },
                { id: 8, title: 'Partner Agreement', type: 'contract', status: 'verified', date: '2026-05-20', size: '2.0 MB', access: ['DG', 'KL', 'MV'], category: 'legal' },
                { id: 9, title: 'Tax Filing 2026', type: 'financial', status: 'pending', date: '2026-05-15', size: '6.3 MB', access: ['DG'], category: 'financial' }
            ]);
        },

        addDocument: function(doc) {
            const docs = this.getDocuments();
            doc.id = doc.id || docs.length + 1;
            docs.unshift(doc);
            this.safeSet(this.keys.DOCUMENTS, docs);
            return doc;
        },

        // Settings
        getSettings: function() {
            return this.safeGet(this.keys.SETTINGS, {
                notifications: true,
                emailAlerts: true,
                twoFactor: false,
                darkMode: false,
                language: 'en',
                currency: 'USD'
            });
        },

        setSettings: function(settings) {
            return this.safeSet(this.keys.SETTINGS, settings);
        },

        // Notifications
        getNotifications: function() {
            return this.safeGet(this.keys.NOTIFICATIONS, [
                { id: 1, title: 'Document uploaded', message: 'Q2 Financial Report has been verified.', time: '2 hours ago', read: false, type: 'success' },
                { id: 2, title: 'Action required', message: 'Granison Side Letter requires your signature.', time: '5 hours ago', read: false, type: 'warning' },
                { id: 3, title: 'Security alert', message: 'New login detected from New York, NY.', time: '1 day ago', read: true, type: 'info' }
            ]);
        },

        markNotificationRead: function(id) {
            const notifs = this.getNotifications();
            const notif = notifs.find(function(n) { return n.id === id; });
            if (notif) {
                notif.read = true;
                this.safeSet(this.keys.NOTIFICATIONS, notifs);
            }
        },

        // Refunds
        getRefunds: function() {
            return this.safeGet(this.keys.REFUNDS, []);
        },

        addRefund: function(refund) {
            const refunds = this.getRefunds();
            refund.id = 'REF-' + Date.now();
            refund.date = new Date().toISOString();
            refund.status = 'pending';
            refunds.push(refund);
            this.safeSet(this.keys.REFUNDS, refunds);
            return refund;
        },

        // Theme
        getTheme: function() {
            return this.safeGet(this.keys.THEME, 'light');
        },

        setTheme: function(theme) {
            this.safeSet(this.keys.THEME, theme);
            document.body.setAttribute('data-theme', theme);
        },

        // Clear all data (logout/reset)
        clearAll: function() {
            Object.keys(this.keys).forEach(function(key) {
                Storage.safeRemove(Storage.keys[key]);
            });
        }
    };

    window.PIVStorage = Storage;
})();
