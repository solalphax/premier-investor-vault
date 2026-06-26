// js/retirement.js
/**
 * PREMIER INVESTOR VAULT — 401(k) Retirement Manager
 * Retirement accounts, contributions, and projections
 */

const Retirement = {
  init() {
    this.loadRetirementData();
    this.renderProjectionChart();
    this.bindEvents();
  },

  loadRetirementData() {
    const accounts = Storage.getRetirementAccounts();
    this.renderAccountCards(accounts);
    this.renderContributionTable(accounts);
    this.updateRetirementStats(accounts);
  },

  renderAccountCards(accounts) {
    const container = document.getElementById('retirementCards');
    if (!container) return;

    const html = accounts.map(acc => {
      const progress = (acc.balance / acc.target) * 100;
      return `
        <div class="retirement-card">
          <div class="retirement-header">
            <div class="retirement-icon">
              <i class="fas fa-piggy-bank"></i>
            </div>
            <div class="retirement-status ${acc.status.toLowerCase()}">${acc.status}</div>
          </div>
          <h4>${acc.holderName}</h4>
          <p class="plan-type">${acc.planType}</p>
          <div class="balance-display">
            <span class="balance-label">Current Balance</span>
            <span class="balance-value">${this.formatCurrency(acc.balance)}</span>
          </div>
          <div class="progress-ring">
            <svg viewBox="0 0 100 100">
              <circle class="progress-track" cx="50" cy="50" r="40"/>
              <circle class="progress-fill" cx="50" cy="50" r="40" 
                style="stroke-dasharray: ${progress * 2.51} 251"/>
            </svg>
            <div class="progress-text">${progress.toFixed(0)}%</div>
          </div>
          <div class="retirement-meta">
            <div class="meta-item">
              <span class="meta-label">Monthly Contribution</span>
              <span class="meta-value">${this.formatCurrency(acc.monthlyContribution)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Employer Match</span>
              <span class="meta-value">${acc.employerMatch}%</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Target</span>
              <span class="meta-value">${this.formatCurrency(acc.target)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = html;
  },

  renderContributionTable(accounts) {
    const tbody = document.getElementById('contributionTableBody');
    if (!tbody) return;

    const html = accounts.map(acc => `
      <tr>
        <td>
          <div class="contrib-avatar">${acc.holderName.split(' ').map(n => n[0]).join('')}</div>
          <span class="contrib-name">${acc.holderName}</span>
        </td>
        <td>${acc.planType}</td>
        <td>${this.formatCurrency(acc.balance)}</td>
        <td>${this.formatCurrency(acc.monthlyContribution)}</td>
        <td>${acc.employerMatch}%</td>
        <td>
          <div class="contrib-bar">
            <div class="contrib-fill" style="width: ${(acc.balance / acc.target) * 100}%"></div>
          </div>
        </td>
        <td>
          <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
        </td>
      </tr>
    `).join('');

    tbody.innerHTML = html;
  },

  updateRetirementStats(accounts) {
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const totalTarget = accounts.reduce((sum, a) => sum + a.target, 0);
    const avgProgress = (totalBalance / totalTarget) * 100;
    const totalMonthly = accounts.reduce((sum, a) => sum + a.monthlyContribution, 0);

    this.updateEl('totalRetirementBalance', this.formatCurrency(totalBalance));
    this.updateEl('avgProgress', avgProgress.toFixed(1) + '%');
    this.updateEl('totalMonthlyContrib', this.formatCurrency(totalMonthly));
    this.updateEl('activeAccounts', accounts.length);
  },

  renderProjectionChart() {
    const ctx = document.getElementById('retirementProjection');
    if (!ctx) return;

    const years = Array.from({length: 20}, (_, i) => 2024 + i);
    const conservative = years.map((_, i) => 2500000 * Math.pow(1.05, i));
    const moderate = years.map((_, i) => 2500000 * Math.pow(1.07, i));
    const aggressive = years.map((_, i) => 2500000 * Math.pow(1.09, i));

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Conservative (5%)',
            data: conservative,
            borderColor: '#888',
            borderDash: [5, 5],
            fill: false,
            tension: 0.4
          },
          {
            label: 'Moderate (7%)',
            data: moderate,
            borderColor: '#C9A962',
            fill: true,
            backgroundColor: 'rgba(201, 169, 98, 0.1)',
            tension: 0.4
          },
          {
            label: 'Aggressive (9%)',
            data: aggressive,
            borderColor: '#E94560',
            borderDash: [10, 5],
            fill: false,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: '#C9A962' } },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(201, 169, 98, 0.1)' },
            ticks: { color: '#888' }
          },
          y: {
            grid: { color: 'rgba(201, 169, 98, 0.1)' },
            ticks: {
              color: '#888',
              callback: (value) => this.formatCurrency(value)
            }
          }
        }
      }
    });
  },

  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  },

  updateEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  bindEvents() {
    const calcBtn = document.getElementById('calculateRetirement');
    if (calcBtn) {
      calcBtn.addEventListener('click', () => {
        // Simple calculator logic
        const age = parseInt(document.getElementById('currentAge')?.value || 35);
        const retireAge = parseInt(document.getElementById('retireAge')?.value || 65);
        const monthly = parseFloat(document.getElementById('monthlyContrib')?.value || 2000);
        
        const years = retireAge - age;
        const futureValue = monthly * 12 * ((Math.pow(1.07, years) - 1) / 0.07);
        
        const resultEl = document.getElementById('calcResult');
        if (resultEl) {
          resultEl.innerHTML = `
            <div class="calc-result">
              <span class="result-label">Projected Value at Retirement</span>
              <span class="result-value">${this.formatCurrency(futureValue)}</span>
              <span class="result-note">Based on 7% annual return</span>
            </div>
          `;
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Retirement.init());
