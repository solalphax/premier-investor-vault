// js/ownership.js
/**
 * PREMIER INVESTOR VAULT — Ownership Structure
 * Cap table visualization and equity distribution
 */

const Ownership = {
  init() {
    this.loadOwnershipData();
    this.renderCapTable();
    this.renderOwnershipChart();
    this.bindEvents();
  },

  loadOwnershipData() {
    const investors = Storage.getInvestors();
    const totalOwnership = investors.reduce((sum, i) => sum + i.ownership, 0);
    
    // Calculate derived values
    const enriched = investors.map(inv => ({
      ...inv,
      equityValue: (inv.ownership / 100) * 50000000, // $50M fund
      votingPower: Math.round((inv.ownership / totalOwnership) * 100 * 10) / 10
    }));

    this.renderOwnershipCards(enriched);
    this.renderCapTable(enriched);
  },

  renderOwnershipCards(investors) {
    const container = document.getElementById('ownershipCards');
    if (!container) return;

    const html = investors.slice(0, 4).map(inv => `
      <div class="ownership-card">
        <div class="owner-header">
          <div class="owner-avatar">${inv.name.split(' ').map(n => n[0]).join('')}</div>
          <div class="owner-rank">#${inv.id}</div>
        </div>
        <h4>${inv.name}</h4>
        <p class="owner-role">${inv.role}</p>
        <div class="ownership-big">${inv.ownership}%</div>
        <div class="owner-value">${this.formatCurrency(inv.equityValue)}</div>
        <div class="voting-bar">
          <div class="voting-fill" style="width: ${inv.votingPower}%"></div>
          <span>Voting: ${inv.votingPower}%</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  },

  renderCapTable(investors) {
    const tbody = document.getElementById('capTableBody');
    if (!tbody) return;

    const totalOwnership = investors.reduce((sum, i) => sum + i.ownership, 0);
    const totalValue = investors.reduce((sum, i) => sum + i.equityValue, 0);

    const html = investors.map(inv => `
      <tr>
        <td>
          <div class="cap-avatar">${inv.name.split(' ').map(n => n[0]).join('')}</div>
          <span class="cap-name">${inv.name}</span>
        </td>
        <td>${inv.role}</td>
        <td>
          <div class="cap-bar">
            <div class="cap-fill" style="width: ${(inv.ownership / totalOwnership * 100)}%"></div>
            <span>${inv.ownership}%</span>
          </div>
        </td>
        <td>${this.formatCurrency(inv.equityValue)}</td>
        <td>${inv.votingPower}%</td>
        <td><span class="status-badge ${inv.status.toLowerCase()}">${inv.status}</span></td>
      </tr>
    `).join('');

    // Add totals row
    const totalsHtml = `
      <tr class="totals-row">
        <td colspan="2"><strong>Total</strong></td>
        <td><strong>${totalOwnership.toFixed(1)}%</strong></td>
        <td><strong>${this.formatCurrency(totalValue)}</strong></td>
        <td><strong>100%</strong></td>
        <td></td>
      </tr>
    `;

    tbody.innerHTML = html + totalsHtml;
  },

  renderOwnershipChart() {
    const ctx = document.getElementById('ownershipBreakdown');
    if (!ctx) return;

    const investors = Storage.getInvestors();
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: investors.map(i => i.name.split(' ')[0]),
        datasets: [{
          label: 'Ownership %',
          data: investors.map(i => i.ownership),
          backgroundColor: investors.map((_, i) => 
            i === 0 ? '#C9A962' : `rgba(201, 169, 98, ${0.8 - (i * 0.05)})`
          ),
          borderColor: '#C9A962',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(201, 169, 98, 0.1)' },
            ticks: { color: '#888' }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#C9A962' }
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

  bindEvents() {
    // Sort handlers
    document.querySelectorAll('.sort-header').forEach(th => {
      th.addEventListener('click', (e) => {
        const sortKey = e.target.dataset.sort;
        // Implement sort logic
        console.log('Sort by:', sortKey);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Ownership.init());
