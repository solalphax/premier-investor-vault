// js/dashboard.js
/**
 * PREMIER INVESTOR VAULT — Dashboard Controller
 * Main dashboard data visualization and overview
 */

const Dashboard = {
  session: null,
  charts: {},

  init() {
    this.session = Auth.getSession();
    if (!this.session) return;

    this.loadDashboardData();
    this.renderCharts();
    this.bindEvents();
  },

  loadDashboardData() {
    const investors = Storage.getInvestors();
    const transactions = Storage.getTransactions();
    
    // Calculate portfolio metrics
    const totalAUM = investors.reduce((sum, inv) => sum + (inv.ownership * 1000000), 0);
    const activeInvestors = investors.filter(i => i.status === 'Active').length;
    const recentTransactions = transactions.slice(-5).reverse();

    // Update stat cards
    this.updateStat('totalAUM', this.formatCurrency(totalAUM));
    this.updateStat('activeInvestors', activeInvestors);
    this.updateStat('totalInvestors', investors.length);
    this.updateStat('recentActivity', recentTransactions.length);

    // Render recent transactions
    this.renderRecentTransactions(recentTransactions);
    
    // Render investor quick list
    this.renderInvestorQuickList(investors);
  },

  updateStat(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  },

  renderRecentTransactions(transactions) {
    const container = document.getElementById('recentTransactions');
    if (!container) return;

    const html = transactions.map(tx => `
      <div class="transaction-item">
        <div class="tx-icon ${tx.type.toLowerCase()}">
          <i class="fas fa-${tx.type === 'Deposit' ? 'arrow-down' : tx.type === 'Withdrawal' ? 'arrow-up' : 'exchange-alt'}"></i>
        </div>
        <div class="tx-details">
          <span class="tx-type">${tx.type}</span>
          <span class="tx-asset">${tx.asset}</span>
        </div>
        <div class="tx-amount ${tx.type.toLowerCase()}">
          ${tx.type === 'Deposit' ? '+' : '-'}${this.formatCurrency(tx.amount)}
        </div>
        <div class="tx-date">${new Date(tx.date).toLocaleDateString()}</div>
      </div>
    `).join('');

    container.innerHTML = html || '<p class="empty-state">No recent transactions</p>';
  },

  renderInvestorQuickList(investors) {
    const container = document.getElementById('investorQuickList');
    if (!container) return;

    const html = investors.slice(0, 5).map(inv => `
      <div class="investor-mini-card">
        <div class="investor-avatar">${inv.name.split(' ').map(n => n[0]).join('')}</div>
        <div class="investor-info">
          <span class="investor-name">${inv.name}</span>
          <span class="investor-role">${inv.role}</span>
        </div>
        <div class="investor-ownership">${inv.ownership}%</div>
      </div>
    `).join('');

    container.innerHTML = html;
  },

  renderCharts() {
    this.renderOwnershipChart();
    this.renderPerformanceChart();
  },

  renderOwnershipChart() {
    const ctx = document.getElementById('ownershipChart');
    if (!ctx) return;

    const investors = Storage.getInvestors();
    const labels = investors.map(i => i.name.split(' ')[0]);
    const data = investors.map(i => i.ownership);
    const colors = [
      '#C9A962', '#1A1A2E', '#16213E', '#0F3460', '#533483',
      '#E94560', '#16C79A', '#F9A826', '#118AB2', '#EF476F',
      '#06D6A0', '#FFD166', '#9B5DE5'
    ];

    this.charts.ownership = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: '#0A0A0A',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#C9A962', font: { family: 'Inter' } } },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`
            }
          }
        },
        cutout: '65%'
      }
    });
  },

  renderPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [2.1, 3.4, 1.8, 4.2, 3.9, 5.1, 4.7, 6.2, 5.8, 7.1, 6.5, 8.3];

    this.charts.performance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Portfolio Growth %',
          data: data,
          borderColor: '#C9A962',
          backgroundColor: 'rgba(201, 169, 98, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#C9A962',
          pointBorderColor: '#0A0A0A',
          pointBorderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(201, 169, 98, 0.1)' },
            ticks: { color: '#888', font: { family: 'Inter' } }
          },
          y: {
            grid: { color: 'rgba(201, 169, 98, 0.1)' },
            ticks: { color: '#888', font: { family: 'Inter' } }
          }
        }
      }
    });
  },

  bindEvents() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spinning');
        setTimeout(() => {
          this.loadDashboardData();
          refreshBtn.classList.remove('spinning');
        }, 800);
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Dashboard.init());
