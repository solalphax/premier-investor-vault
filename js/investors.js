/* /js/investors.js - Premier Investor Vault Investor Management */
(function() {
    'use strict';

    const Investors = {
        init: function() {
            this.renderInvestorList();
            this.renderDealPipeline();
            this.bindEvents();
        },

        // Sample investor data
        getInvestors: function() {
            return window.PIVStorage ? window.PIVStorage.safeGet('piv_investors', [
                { id: 1, name: 'Kenneth L.', initials: 'KL', type: 'Institutional', invested: 2500000, status: 'active', since: '2024-01', deals: 12 },
                { id: 2, name: 'Maria V.', initials: 'MV', type: 'High Net Worth', invested: 850000, status: 'active', since: '2024-03', deals: 5 },
                { id: 3, name: 'James R.', initials: 'JR', type: 'Family Office', invested: 1200000, status: 'active', since: '2024-02', deals: 8 },
                { id: 4, name: 'Sarah T.', initials: 'ST', type: 'Angel', invested: 150000, status: 'pending', since: '2026-06', deals: 0 },
                { id: 5, name: 'Robert K.', initials: 'RK', type: 'Institutional', invested: 5000000, status: 'active', since: '2023-08', deals: 24 },
                { id: 6, name: 'Diana L.', initials: 'DL', type: 'High Net Worth', invested: 420000, status: 'pending', since: '2026-05', deals: 1 }
            ]) : [
                { id: 1, name: 'Kenneth L.', initials: 'KL', type: 'Institutional', invested: 2500000, status: 'active', since: '2024-01', deals: 12 },
                { id: 2, name: 'Maria V.', initials: 'MV', type: 'High Net Worth', invested: 850000, status: 'active', since: '2024-03', deals: 5 },
                { id: 3, name: 'James R.', initials: 'JR', type: 'Family Office', invested: 1200000, status: 'active', since: '2024-02', deals: 8 }
            ];
        },

        // Render investor cards
        renderInvestorList: function() {
            const container = document.getElementById('investor-list');
            if (!container) return;

            const investors = this.getInvestors();
            container.innerHTML = investors.map(function(inv) {
                const statusClass = inv.status === 'active' ? 'success' : 'pending';
                const statusIcon = inv.status === 'active' ? 'fa-check-circle' : 'fa-clock';

                return '<div class="investor-card" data-id="' + inv.id + '">' +
                    '<div class="investor-header">' +
                    '<div class="investor-avatar">' + inv.initials + '</div>' +
                    '<div class="investor-info">' +
                    '<div class="investor-name">' + inv.name + '</div>' +
                    '<div class="investor-type">' + inv.type + '</div>' +
                    '</div>' +
                    '<div class="investor-status ' + statusClass + '"><i class="fas ' + statusIcon + '"></i></div>' +
                    '</div>' +
                    '<div class="investor-stats">' +
                    '<div class="inv-stat"><div class="inv-value">$' + (inv.invested / 1000000).toFixed(1) + 'M</div><div class="inv-label">Invested</div></div>' +
                    '<div class="inv-stat"><div class="inv-value">' + inv.deals + '</div><div class="inv-label">Deals</div></div>' +
                    '<div class="inv-stat"><div class="inv-value">' + inv.since + '</div><div class="inv-label">Since</div></div>' +
                    '</div>' +
                    '<div class="investor-actions">' +
                    '<button class="btn btn-outline btn-sm view-profile"><i class="fas fa-user"></i> Profile</button>' +
                    '<button class="btn btn-primary btn-sm view-deals"><i class="fas fa-handshake"></i> Deals</button>' +
                    '</div>' +
                    '</div>';
            }).join('');
        },

        // Render deal pipeline
        renderDealPipeline: function() {
            const container = document.getElementById('deal-pipeline');
            if (!container) return;

            const deals = [
                { id: 'DL-2026-001', name: 'Granison Side Letter', investor: 'Donte Granison', value: 175200000, stage: 'integration', progress: 65, status: 'pending' },
                { id: 'DL-2026-002', name: 'Series B Bridge', investor: 'Kenneth L.', value: 2500000, stage: 'negotiation', progress: 40, status: 'active' },
                { id: 'DL-2026-003', name: 'Real Estate Fund III', investor: 'Robert K.', value: 8000000, stage: 'due-diligence', progress: 75, status: 'active' },
                { id: 'DL-2026-004', name: 'Tech Startup Round', investor: 'Maria V.', value: 500000, stage: 'term-sheet', progress: 90, status: 'active' },
                { id: 'DL-2026-005', name: 'Energy Portfolio', investor: 'James R.', value: 3200000, stage: 'closing', progress: 95, status: 'active' }
            ];

            container.innerHTML = deals.map(function(deal) {
                const stageLabels = {
                    'integration': 'Integration',
                    'negotiation': 'Negotiation',
                    'due-diligence': 'Due Diligence',
                    'term-sheet': 'Term Sheet',
                    'closing': 'Closing'
                };

                return '<div class="deal-card" data-id="' + deal.id + '">' +
                    '<div class="deal-header">' +
                    '<div class="deal-id">' + deal.id + '</div>' +
                    '<div class="deal-status ' + deal.status + '">' + deal.status + '</div>' +
                    '</div>' +
                    '<div class="deal-name">' + deal.name + '</div>' +
                    '<div class="deal-investor"><i class="fas fa-user"></i> ' + deal.investor + '</div>' +
                    '<div class="deal-value">$' + (deal.value / 1000000).toFixed(1) + 'M</div>' +
                    '<div class="deal-progress">' +
                    '<div class="progress-bar">' +
                    '<div class="progress-fill" style="width:' + deal.progress + '%"></div>' +
                    '</div>' +
                    '<div class="progress-label">' + deal.progress + '% — ' + stageLabels[deal.stage] + '</div>' +
                    '</div>' +
                    '</div>';
            }).join('');
        },

        // Bind events
        bindEvents: function() {
            // Investor search
            const searchInput = document.getElementById('investor-search');
            if (searchInput) {
                searchInput.addEventListener('input', this.debounce(function() {
                    Investors.filterInvestors(this.value);
                }, 300));
            }

            // Investor type filter
            const typeFilters = document.querySelectorAll('.investor-filter');
            typeFilters.forEach(function(btn) {
                btn.addEventListener('click', function() {
                    typeFilters.forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');
                    Investors.filterByType(this.dataset.type);
                });
            });

            // View profile buttons
            document.addEventListener('click', function(e) {
                if (e.target.closest('.view-profile')) {
                    const card = e.target.closest('.investor-card');
                    const id = card ? card.dataset.id : null;
                    if (id) Investors.showInvestorModal(id);
                }
                if (e.target.closest('.view-deals')) {
                    const card = e.target.closest('.investor-card');
                    const id = card ? card.dataset.id : null;
                    if (id) Investors.showDealsModal(id);
                }
            });
        },

        // Filter investors
        filterInvestors: function(query) {
            const cards = document.querySelectorAll('.investor-card');
            const q = query.toLowerCase();
            cards.forEach(function(card) {
                const name = card.querySelector('.investor-name').textContent.toLowerCase();
                card.style.display = name.includes(q) ? 'block' : 'none';
            });
        },

        filterByType: function(type) {
            const cards = document.querySelectorAll('.investor-card');
            if (!type || type === 'all') {
                cards.forEach(function(c) { c.style.display = 'block'; });
                return;
            }
            const investors = this.getInvestors();
            cards.forEach(function(card) {
                const id = parseInt(card.dataset.id);
                const inv = investors.find(function(i) { return i.id === id; });
                card.style.display = (inv && inv.type.toLowerCase().replace(' ', '-') === type) ? 'block' : 'none';
            });
        },

        // Show investor detail modal
        showInvestorModal: function(id) {
            const investors = this.getInvestors();
            const inv = investors.find(function(i) { return i.id == id; });
            if (!inv) return;

            const modal = document.getElementById('investor-modal');
            const body = document.getElementById('investor-modal-body');
            if (!modal || !body) return;

            body.innerHTML =
                '<div class="investor-detail">' +
                '<div class="detail-header">' +
                '<div class="detail-avatar">' + inv.initials + '</div>' +
                '<div class="detail-info">' +
                '<h3>' + inv.name + '</h3>' +
                '<p>' + inv.type + ' • Member since ' + inv.since + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="detail-stats">' +
                '<div class="d-stat"><div class="d-value">$' + (inv.invested / 1000000).toFixed(2) + 'M</div><div class="d-label">Total Invested</div></div>' +
                '<div class="d-stat"><div class="d-value">' + inv.deals + '</div><div class="d-label">Completed Deals</div></div>' +
                '<div class="d-stat"><div class="d-value">' + (inv.status === 'active' ? 'Active' : 'Pending') + '</div><div class="d-label">Account Status</div></div>' +
                '</div>' +
                '</div>';

            modal.classList.add('active');
        },

        // Show deals modal
        showDealsModal: function(id) {
            // Could filter deals by investor ID
            const modal = document.getElementById('deals-modal');
            if (modal) modal.classList.add('active');
        },

        // Debounce utility
        debounce: function(func, wait) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() { func.apply(context, args); }, wait);
            };
        }
    };

    window.PIVInvestors = Investors;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { Investors.init(); });
    } else {
        Investors.init();
    }
})();
