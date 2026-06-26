/* /js/dashboard.js - Premier Investor Vault Dashboard */
(function() {
    'use strict';

    const Dashboard = {
        init: function() {
            // Auth check
            if (window.PIVAuth) {
                window.PIVAuth.requireAuth();
            }

            this.renderUserInfo();
            this.renderStats();
            this.renderDocuments();
            this.renderActivity();
            this.renderNotifications();
            this.bindEvents();
            this.initMobileMenu();
        },

        // Render user info in header
        renderUserInfo: function() {
            const profile = window.PIVStorage ? window.PIVStorage.getProfile() : { name: 'Donte Granison', role: 'Managing Director' };
            const userNameEls = document.querySelectorAll('.user-name');
            const userRoleEls = document.querySelectorAll('.user-role');
            const avatarEls = document.querySelectorAll('.user-avatar');

            userNameEls.forEach(function(el) { el.textContent = profile.name; });
            userRoleEls.forEach(function(el) { el.textContent = profile.role; });

            const initials = profile.name.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2).toUpperCase();
            avatarEls.forEach(function(el) {
                if (!el.querySelector('img')) {
                    el.textContent = initials;
                }
            });
        },

        // Render stat cards
        renderStats: function() {
            const balance = window.PIVStorage ? window.PIVStorage.getBalance() : { total: 187620.00, available: 187620.00 };
            const docs = window.PIVStorage ? window.PIVStorage.getDocuments() : [];
            const activeDeals = docs.filter(function(d) { return d.status === 'verified'; }).length;
            const pendingReview = docs.filter(function(d) { return d.status === 'pending'; }).length;

            const stats = [
                { icon: 'fa-file-contract', color: 'blue', value: docs.length, label: 'Total Documents' },
                { icon: 'fa-check-circle', color: 'green', value: activeDeals, label: 'Active Deals' },
                { icon: 'fa-dollar-sign', color: 'gold', value: '$' + this.formatMoney(balance.total), label: 'Portfolio Value' },
                { icon: 'fa-clock', color: 'purple', value: pendingReview, label: 'Pending Review' }
            ];

            const grid = document.getElementById('stats-grid');
            if (!grid) return;

            grid.innerHTML = stats.map(function(s) {
                return '<div class="stat-card animate-fade-in">' +
                    '<div class="stat-icon ' + s.color + '"><i class="fas ' + s.icon + '"></i></div>' +
                    '<div><div class="stat-value">' + s.value + '</div><div class="stat-label">' + s.label + '</div></div>' +
                    '</div>';
            }).join('');
        },

        // Render document cards
        renderDocuments: function() {
            const docs = window.PIVStorage ? window.PIVStorage.getDocuments() : [];
            const grid = document.getElementById('document-grid');
            if (!grid) return;

            const typeIcons = {
                contract: 'fa-file-signature',
                financial: 'fa-chart-line',
                legal: 'fa-balance-scale',
                compliance: 'fa-shield-alt'
            };

            const statusIcons = {
                verified: 'fa-check-circle',
                pending: 'fa-clock',
                urgent: 'fa-exclamation-circle'
            };

            grid.innerHTML = docs.slice(0, 6).map(function(doc) {
                const iconClass = typeIcons[doc.type] || 'fa-file';
                const statusIcon = statusIcons[doc.status] || 'fa-circle';
                const statusClass = doc.status;
                const accessHtml = doc.access.slice(0, 3).map(function(a, i) {
                    return '<div class="access-avatar" style="z-index:' + (3 - i) + '">' + a + '</div>';
                }).join('') + (doc.access.length > 3 ? '<span class="access-count">+' + (doc.access.length - 3) + '</span>' : '');

                return '<div class="document-card" data-id="' + doc.id + '">' +
                    '<div class="doc-header">' +
                    '<div class="doc-type-icon ' + doc.type + '"><i class="fas ' + iconClass + '"></i></div>' +
                    '<div class="doc-menu"><i class="fas fa-ellipsis-v"></i></div>' +
                    '</div>' +
                    '<div class="doc-title">' + doc.title + '</div>' +
                    '<div class="doc-desc">' + doc.type.charAt(0).toUpperCase() + doc.type.slice(1) + ' document • ' + doc.size + '</div>' +
                    '<div class="doc-meta"><span><i class="far fa-calendar"></i> ' + doc.date + '</span></div>' +
                    '<div class="doc-footer">' +
                    '<div class="doc-status ' + statusClass + '"><i class="fas ' + statusIcon + '"></i> ' + doc.status.charAt(0).toUpperCase() + doc.status.slice(1) + '</div>' +
                    '<div class="doc-access">' + accessHtml + '</div>' +
                    '</div>' +
                    '</div>';
            }).join('');
        },

        // Render activity table
        renderActivity: function() {
            const txs = window.PIVStorage ? window.PIVStorage.getTransactions() : [];
            const tbody = document.getElementById('activity-body');
            if (!tbody) return;

            const actionIcons = {
                deposit: { icon: 'fa-arrow-down', class: 'download' },
                withdraw: { icon: 'fa-arrow-up', class: 'upload' },
                fee: { icon: 'fa-receipt', class: 'edit' },
                transfer: { icon: 'fa-exchange-alt', class: 'share' }
            };

            tbody.innerHTML = txs.slice(0, 8).map(function(tx) {
                const action = actionIcons[tx.type] || { icon: 'fa-circle', class: 'view' };
                const amountClass = tx.amount >= 0 ? 'positive' : 'negative';
                const amountPrefix = tx.amount >= 0 ? '+' : '';
                const date = new Date(tx.date);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                return '<tr>' +
                    '<td><span class="action-icon ' + action.class + '"><i class="fas ' + action.icon + '"></i></span>' + tx.description + '</td>' +
                    '<td class="doc-name">' + tx.id + '</td>' +
                    '<td>' + dateStr + '</td>' +
                    '<td class="amount ' + amountClass + '">' + amountPrefix + '$' + Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }) + '</td>' +
                    '<td><span class="status-badge success">' + tx.status + '</span></td>' +
                    '</tr>';
            }).join('');
        },

        // Render notifications dropdown
        renderNotifications: function() {
            const notifs = window.PIVStorage ? window.PIVStorage.getNotifications() : [];
            const badge = document.getElementById('notif-badge');
            const list = document.getElementById('notif-list');

            const unread = notifs.filter(function(n) { return !n.read; }).length;
            if (badge) badge.textContent = unread > 9 ? '9+' : unread;

            if (list) {
                list.innerHTML = notifs.map(function(n) {
                    const iconClass = n.type === 'success' ? 'fa-check-circle text-success' :
                                     n.type === 'warning' ? 'fa-exclamation-circle text-warning' :
                                     'fa-info-circle text-info';
                    return '<div class="notif-item ' + (n.read ? 'read' : 'unread') + '" data-id="' + n.id + '">' +
                        '<i class="fas ' + iconClass + '"></i>' +
                        '<div class="notif-content"><div class="notif-title">' + n.title + '</div>' +
                        '<div class="notif-msg">' + n.message + '</div>' +
                        '<div class="notif-time">' + n.time + '</div></div>' +
                        '</div>';
                }).join('');
            }
        },

        // Bind all events
        bindEvents: function() {
            // Mobile menu toggle
            const menuToggle = document.getElementById('menu-toggle');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');

            if (menuToggle && sidebar) {
                menuToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('active');
                    if (overlay) overlay.classList.toggle('active');
                });
            }

            if (overlay) {
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                });
            }

            // Notification bell
            const notifBtn = document.getElementById('notif-btn');
            const notifDropdown = document.getElementById('notif-dropdown');
            if (notifBtn && notifDropdown) {
                notifBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    notifDropdown.classList.toggle('active');
                });
                document.addEventListener('click', function() {
                    notifDropdown.classList.remove('active');
                });
            }

            // Logout
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn && window.PIVAuth) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.PIVAuth.logout();
                });
            }

            // Search
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.addEventListener('input', this.debounce(function() {
                    Dashboard.filterDocuments(this.value);
                }, 300));
            }

            // Filter buttons
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    Dashboard.filterByCategory(this.dataset.filter);
                });
            });

            // Upload modal
            const uploadBtn = document.getElementById('upload-btn');
            const uploadModal = document.getElementById('upload-modal');
            if (uploadBtn && uploadModal) {
                uploadBtn.addEventListener('click', function() {
                    uploadModal.classList.add('active');
                });
            }

            // Modal close
            const modalCloses = document.querySelectorAll('.modal-close, .modal-overlay');
            modalCloses.forEach(function(el) {
                el.addEventListener('click', function() {
                    this.closest('.modal').classList.remove('active');
                });
            });

            // Drag and drop upload
            const uploadZone = document.getElementById('upload-zone');
            if (uploadZone) {
                ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(evt) {
                    uploadZone.addEventListener(evt, function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });
                uploadZone.addEventListener('dragenter', function() { this.classList.add('dragover'); });
                uploadZone.addEventListener('dragleave', function() { this.classList.remove('dragover'); });
                uploadZone.addEventListener('drop', function(e) {
                    this.classList.remove('dragover');
                    Dashboard.handleFiles(e.dataTransfer.files);
                });
                uploadZone.addEventListener('click', function() {
                    document.getElementById('file-input').click();
                });
            }

            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                fileInput.addEventListener('change', function() {
                    Dashboard.handleFiles(this.files);
                });
            }
        },

        // Filter documents by search
        filterDocuments: function(query) {
            const cards = document.querySelectorAll('.document-card');
            const q = query.toLowerCase();
            cards.forEach(function(card) {
                const title = card.querySelector('.doc-title').textContent.toLowerCase();
                card.style.display = title.includes(q) ? 'block' : 'none';
            });
        },

        // Filter by category
        filterByCategory: function(category) {
            const cards = document.querySelectorAll('.document-card');
            if (!category || category === 'all') {
                cards.forEach(function(c) { c.style.display = 'block'; });
                return;
            }
            const docs = window.PIVStorage ? window.PIVStorage.getDocuments() : [];
            cards.forEach(function(card) {
                const id = parseInt(card.dataset.id);
                const doc = docs.find(function(d) { return d.id === id; });
                card.style.display = (doc && doc.category === category) ? 'block' : 'none';
            });
        },

        // Handle file upload
        handleFiles: function(files) {
            if (!files.length) return;
            const file = files[0];
            const preview = document.getElementById('upload-preview');
            if (preview) {
                preview.innerHTML = '<div class="file-preview"><i class="fas fa-file"></i> ' + file.name + ' (' + this.formatFileSize(file.size) + ')</div>';
            }
            document.getElementById('upload-submit').disabled = false;
        },

        // Mobile menu init
        initMobileMenu: function() {
            // Set active nav item based on current page
            const path = window.location.pathname;
            const page = path.split('/').pop().replace('.html', '') || 'dashboard';
            document.querySelectorAll('.nav-item').forEach(function(item) {
                if (item.dataset.page === page) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        },

        // Utility: Format money
        formatMoney: function(amount) {
            return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },

        // Utility: Format file size
        formatFileSize: function(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        },

        // Utility: Debounce
        debounce: function(func, wait) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() { func.apply(context, args); }, wait);
            };
        }
    };

    window.PIVDashboard = Dashboard;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { Dashboard.init(); });
    } else {
        Dashboard.init();
    }
})();
