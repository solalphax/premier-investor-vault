/* /js/401k.js - Premier Investor Vault 401K Management */
(function() {
    'use strict';

    const Retirement = {
        init: function() {
            this.renderPlans();
            this.renderContributionSlider();
            this.renderAllocation();
            this.bindEvents();
        },

        // Plan data
        getPlans: function() {
            return window.PIVStorage ? window.PIVStorage.safeGet('piv_401k_plans', [
                {
                    id: '401k-traditional',
                    name: 'Traditional 401(k)',
                    type: 'Employer Sponsored',
                    balance: 284750.00,
                    change: 3.2,
                    contributions: { employee: 19500, employer: 9750, total: 29250 },
                    ytdReturn: 8.4,
                    risk: 'Moderate'
                },
                {
                    id: '401k-roth',
                    name: 'Roth 401(k)',
                    type: 'Post-Tax',
                    balance: 156200.00,
                    change: 4.1,
                    contributions: { employee: 12000, employer: 6000, total: 18000 },
                    ytdReturn: 9.2,
                    risk: 'Moderate-Aggressive',
                    featured: true
                },
                {
                    id: 'sep-ira',
                    name: 'SEP-IRA',
                    type: 'Self-Employed',
                    balance: 425000.00,
                    change: -1.2,
                    contributions: { employee: 45000, employer: 0, total: 45000 },
                    ytdReturn: 6.8,
                    risk: 'Conservative'
                }
            ]) : [];
        },

        // Render plan cards
        renderPlans: function() {
            const container = document.getElementById('plan-cards');
            if (!container) return;

            const plans = this.getPlans();
            container.innerHTML = plans.map(function(plan) {
                const changeClass = plan.change >= 0 ? 'positive' : 'negative';
                const changeIcon = plan.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
                const featured = plan.featured ? 'featured' : '';

                return '<div class="plan-card ' + featured + '" data-id="' + plan.id + '">' +
                    (plan.featured ? '<div class="plan-badge">Recommended</div>' : '') +
                    '<div class="plan-name">' + plan.name + '</div>' +
                    '<div class="plan-type">' + plan.type + '</div>' +
                    '<div class="plan-balance">$' + plan.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) + '</div>' +
                    '<div class="plan-change ' + changeClass + '"><i class="fas ' + changeIcon + '"></i> ' + Math.abs(plan.change) + '%</div>' +
                    '<div class="plan-details">' +
                    '<div class="plan-detail"><span>YTD Return</span><span>' + plan.ytdReturn + '%</span></div>' +
                    '<div class="plan-detail"><span>Risk Profile</span><span>' + plan.risk + '</span></div>' +
                    '<div class="plan-detail"><span>Annual Contribution</span><span>$' + plan.contributions.total.toLocaleString() + '</span></div>' +
                    '</div>' +
                    '</div>';
            }).join('');
        },

        // Render contribution slider
        renderContributionSlider: function() {
            const container = document.getElementById('contribution-section');
            if (!container) return;

            const currentRate = window.PIVStorage ? window.PIVStorage.safeGet('piv_contribution_rate', 12) : 12;
            const salary = 350000; // Annual salary
            const maxContribution = 22500; // 2026 limit
            const currentContribution = Math.round((currentRate / 100) * salary);

            container.innerHTML =
                '<div class="contribution-section">' +
                '<div class="contribution-header">' +
                '<h3>Contribution Rate</h3>' +
                '<div class="current-rate">' + currentRate + '%</div>' +
                '</div>' +
                '<div class="slider-container">' +
                '<div class="slider-labels"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>' +
                '<input type="range" id="contribution-slider" min="0" max="50" value="' + currentRate + '" step="1">' +
                '</div>' +
                '<div class="contribution-summary">' +
                '<div class="summary-box">' +
                '<div class="sum-label">Annual Contribution</div>' +
                '<div class="sum-value" id="annual-contrib">$' + currentContribution.toLocaleString() + '</div>' +
                '</div>' +
                '<div class="summary-box">' +
                '<div class="sum-label">Per Paycheck</div>' +
                '<div class="sum-value" id="paycheck-contrib">$' + Math.round(currentContribution / 26).toLocaleString() + '</div>' +
                '</div>' +
                '<div class="summary-box">' +
                '<div class="sum-label">Tax Savings (est.)</div>' +
                '<div class="sum-value" id="tax-savings">$' + Math.round(currentContribution * 0.32).toLocaleString() + '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            // Bind slider
            setTimeout(function() {
                const slider = document.getElementById('contribution-slider');
                if (slider) {
                    slider.addEventListener('input', function() {
                        Retirement.updateContributionDisplay(this.value, salary, maxContribution);
                    });
                }
            }, 0);
        },

        // Update contribution display
        updateContributionDisplay: function(rate, salary, maxContribution) {
            const annual = Math.min(Math.round((rate / 100) * salary), maxContribution);
            const paycheck = Math.round(annual / 26);
            const taxSavings = Math.round(annual * 0.32);

            const rateEl = document.querySelector('.current-rate');
            const annualEl = document.getElementById('annual-contrib');
            const paycheckEl = document.getElementById('paycheck-contrib');
            const taxEl = document.getElementById('tax-savings');

            if (rateEl) rateEl.textContent = rate + '%';
            if (annualEl) annualEl.textContent = '$' + annual.toLocaleString();
            if (paycheckEl) paycheckEl.textContent = '$' + paycheck.toLocaleString();
            if (taxEl) taxEl.textContent = '$' + taxSavings.toLocaleString();

            // Save to storage
            if (window.PIVStorage) {
                window.PIVStorage.safeSet('piv_contribution_rate', parseInt(rate));
            }
        },

        // Render allocation pie/legend
        renderAllocation: function() {
            const container = document.getElementById('allocation-section');
            if (!container) return;

            const allocation = [
                { name: 'US Large Cap', percent: 35, color: '#c9a84c' },
                { name: 'US Small Cap', percent: 15, color: '#1e3a5f' },
                { name: 'International', percent: 20, color: '#10b981' },
                { name: 'Bonds', percent: 20, color: '#3b82f6' },
                { name: 'Cash', percent: 10, color: '#94a3b8' }
            ];

            const legendHtml = allocation.map(function(item) {
                return '<div class="legend-item">' +
                    '<div class="legend-dot" style="background:' + item.color + '"></div>' +
                    '<span>' + item.name + ' (' + item.percent + '%)</span>' +
                    '</div>';
            }).join('');

            container.innerHTML =
                '<div class="allocation-section">' +
                '<div class="allocation-header">' +
                '<h3>Asset Allocation</h3>' +
                '<p>Current portfolio distribution across asset classes</p>' +
                '</div>' +
                '<div class="allocation-chart">' +
                '<div class="donut-chart">' +
                allocation.map(function(item, i) {
                    return '<div class="donut-segment" style="--percent:' + item.percent + '; --color:' + item.color + '; --offset:' +
                        allocation.slice(0, i).reduce(function(sum, a) { return sum + a.percent; }, 0) + '"></div>';
                }).join('') +
                '</div>' +
                '</div>' +
                '<div class="allocation-legend">' + legendHtml + '</div>' +
                '</div>';
        },

        // Bind events
        bindEvents: function() {
            // Rebalance button
            const rebalanceBtn = document.getElementById('rebalance-btn');
            if (rebalanceBtn) {
                rebalanceBtn.addEventListener('click', function() {
                    Retirement.showToast('Rebalancing initiated. Changes will reflect within 24 hours.', 'success');
                });
            }

            // Plan card clicks
            document.addEventListener('click', function(e) {
                const card = e.target.closest('.plan-card');
                if (card) {
                    document.querySelectorAll('.plan-card').forEach(function(c) { c.classList.remove('selected'); });
                    card.classList.add('selected');
                }
            });
        },

        // Toast notification
        showToast: function(message, type) {
            if (window.PIVDashboard && window.PIVDashboard.showToast) {
                window.PIVDashboard.showToast(message, type);
                return;
            }
            // Fallback toast
            const container = document.getElementById('toast-container') || document.body;
            const toast = document.createElement('div');
            toast.className = 'toast ' + type;
            toast.innerHTML = '<div class="toast-content"><div class="toast-message">' + message + '</div></div>';
            container.appendChild(toast);
            setTimeout(function() { toast.remove(); }, 4000);
        }
    };

    window.PIVRetirement = Retirement;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { Retirement.init(); });
    } else {
        Retirement.init();
    }
})();
