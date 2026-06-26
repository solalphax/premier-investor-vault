// js/vault.js
/**
 * PREMIER INVESTOR VAULT — Asset Vault Manager
 * Portfolio assets, allocations, and performance tracking
 */

const Vault = {
  init() {
    this.loadAssets();
    this.renderAllocationChart();
    this.bindEvents();
  },

  loadAssets() {
    const assets = Storage.getAssets();
    this.renderAssetCards(assets);
    this.renderAssetTable(assets);
    this.updateVaultStats(assets);
  },

  renderAssetCards(assets) {
    const container = document.getElementById('assetCards');
    if (!container) return;

    const html = assets.map(asset => `
      <div class="asset-card" data-category="${asset.category}">
        <div class="asset-icon ${asset.category}">
          <i class="fas fa-${this.getAssetIcon(asset.category)}"></i>
        </div>
        <div class="asset-info">
          <h4>${asset.name}</h4>
          <span class="asset-ticker">${asset.ticker}</span>
        </div>
        <div class="asset-metrics">
          <span class="asset-value">${this.formatCurrency(asset.value)}</span>
          <span class="asset-change ${asset.change >= 0 ? 'positive' : 'negative'}">
            <i class="fas fa-caret-${asset.change >= 0 ? 'up' : 'down'}"></i>
            ${Math.abs(asset.change)}%
          </span>
        </div>
        <div class="asset-bar">
          <div class="asset-fill" style="width: ${asset.allocation}%"></div>
          <span>${asset.allocation}% allocation</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  },

  renderAssetTable(assets) {
    const tbody = document.getElementById('assetTableBody');
    if (!tbody) return;

    const html = assets.map(asset => `
      <tr>
        <td>
          <div class="asset-row-icon ${asset.category}">
            <i class="fas fa-${this.getAssetIcon(asset.category)}"></i>
          </div>
          <div class="asset-row-info">
            <span class="row-name">${asset.name}</span>
            <span class="row-ticker">${asset.ticker}</span>
          </div>
        </td>
        <td><span class="badge-category">${asset.category}</span></td>
        <td>${this.formatCurrency(asset.value)}</td>
        <td>${asset.allocation}%</td>
        <td class="${asset.change >= 0 ? 'positive' : 'negative'}">
          ${asset.change >= 0 ? '+' : ''}${asset.change}%
        </td>
        <td>
          <button class="btn-icon" title="Details"><i class="fas fa-chart-line"></i></button>
        </td>
      </tr>
    `).join('');

    tbody.innerHTML = html;
  },

  getAssetIcon(category) {
    const icons = {
      'Equity': 'chart-line',
      'Fixed Income': 'university',
      'Alternative': 'gem',
      'Crypto': 'bitcoin',
      'Real Estate': 'building',
      'Cash': 'money-bill-wave'
    };
    return icons[category] || 'circle';
  },

  updateVaultStats(assets) {
    const totalValue = assets.reduce((sum, a) => sum + a.value, 0);
    const totalAllocation = assets.reduce((sum, a) => sum + a.allocation, 0);
    const bestPerformer = assets.reduce((best, a) => a.change > best.change ? a : best, assets[0]);

    this.updateEl('totalVaultValue', this.formatCurrency(totalValue));
    this.updateEl('totalAllocation', totalAllocation + '%');
    this.updateEl('bestPerformer', bestPerformer.name);
    this.updateEl('bestPerformerChange', (bestPerformer.change >= 0 ? '+' : '') + bestPerformer.change + '%');
  },

  renderAllocationChart() {
    const ctx = document.getElementById('allocationChart');
    if (!ctx) return;

    const assets = Storage.getAssets();
    
    new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: assets.map(a => a.name),
        datasets: [{
          data: assets.map(a => a.allocation),
          backgroundColor: [
            'rgba(201, 169, 98, 0.8)',
            'rgba(26, 26, 46, 0.8)',
            'rgba(22, 33, 62, 0.8)',
            'rgba(15, 52, 96, 0.8)',
            'rgba(83, 52, 131, 0.8)',
            'rgba(233, 69, 96, 0.8)'
          ],
          borderColor: '#0A0A0A',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#C9A962' } }
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
    // Category filter
    document.querySelectorAll('.category-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        document.querySelectorAll('.asset-card').forEach(card => {
          card.style.display = !category || card.dataset.category === category ? 'block' : 'none';
        });
        document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Vault.init());
