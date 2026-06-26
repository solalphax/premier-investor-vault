// js/investors.js
/**
 * PREMIER INVESTOR VAULT — Investors Directory
 * Full investor listing with search, filter, and detail views
 */

const Investors = {
  currentFilter: 'all',
  searchQuery: '',

  init() {
    this.loadInvestors();
    this.bindEvents();
  },

  loadInvestors() {
    const investors = Storage.getInvestors();
    this.renderInvestorGrid(investors);
    this.renderInvestorTable(investors);
    this.updateStats(investors);
  },

  renderInvestorGrid(investors) {
    const container = document.getElementById('investorGrid');
    if (!container) return;

    const filtered = this.filterInvestors(investors);

    const html = filtered.map(inv => `
      <div class="investor-card" data-id="${inv.id}">
        <div class="card-header">
          <div class="investor-avatar large">${inv.name.split(' ').map(n => n[0]).join('')}</div>
          <div class="status-badge ${inv.status.toLowerCase()}">${inv.status}</div>
        </div>
        <div class="card-body">
          <h3>${inv.name}</h3>
          <p class="role">${inv.role}</p>
          <div class="ownership-bar">
            <div class="ownership-fill" style="width: ${inv.ownership}%"></div>
            <span>${inv.ownership}%</span>
          </div>
          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Joined</span>
              <span class="meta-value">${new Date(inv.joined).toLocaleDateString()}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Email</span>
              <span class="meta-value truncate">${inv.email}</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn-view" onclick="Investors.viewDetail(${inv.id})">View Profile</button>
        </div>
      </div>
    `).join('');

    container.innerHTML = html || '<p class="empty-state">No investors found</p>';
  },

  renderInvestorTable(investors) {
    const tbody = document.getElementById('investorTableBody');
    if (!tbody) return;

    const filtered = this.filterInvestors(investors);

    const html = filtered.map(inv => `
      <tr data-id="${inv.id}">
        <td>
          <div class="table-avatar">${inv.name.split(' ').map(n => n[0]).join('')}</div>
          <span class="table-name">${inv.name}</span>
        </td>
        <td><span class="badge-role">${inv.role}</span></td>
        <td>${inv.ownership}%</td>
        <td><span class="status-dot ${inv.status.toLowerCase()}"></span>${inv.status}</td>
        <td>${new Date(inv.joined).toLocaleDateString()}</td>
        <td>
          <button class="btn-icon" onclick="Investors.viewDetail(${inv.id})" title="View">
            <i class="fas fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join('');

    tbody.innerHTML = html || '<tr><td colspan="6" class="empty-cell">No investors found</td></tr>';
  },

  filterInvestors(investors) {
    return investors.filter(inv => {
      const matchesFilter = this.currentFilter === 'all' || 
        (this.currentFilter === 'active' && inv.status === 'Active') ||
        (this.currentFilter === 'partner' && inv.role.includes('Partner'));
      
      const matchesSearch = !this.searchQuery || 
        inv.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        inv.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        inv.role.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  },

  updateStats(investors) {
    const total = investors.length;
    const active = investors.filter(i => i.status === 'Active').length;
    const totalOwnership = investors.reduce((sum, i) => sum + i.ownership, 0);

    this.updateEl('statTotal', total);
    this.updateEl('statActive', active);
    this.updateEl('statOwnership', totalOwnership.toFixed(1) + '%');
  },

  updateEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  viewDetail(id) {
    const investors = Storage.getInvestors();
    const inv = investors.find(i => i.id === id);
    if (!inv) return;

    const modal = document.getElementById('investorModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
      <div class="modal-header">
        <div class="modal-avatar">${inv.name.split(' ').map(n => n[0]).join('')}</div>
        <div class="modal-title-group">
          <h2>${inv.name}</h2>
          <span class="modal-role">${inv.role}</span>
        </div>
        <span class="modal-status ${inv.status.toLowerCase()}">${inv.status}</span>
      </div>
      <div class="modal-body">
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Username</span>
            <span class="detail-value">${inv.username}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email</span>
            <span class="detail-value">${inv.email}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Ownership</span>
            <span class="detail-value highlight">${inv.ownership}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Date Joined</span>
            <span class="detail-value">${new Date(inv.joined).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="ownership-visual">
          <div class="ownership-ring" style="--percentage: ${inv.ownership}">
            <span>${inv.ownership}%</span>
          </div>
        </div>
      </div>
    `;
    
    modal.classList.add('active');
  },

  bindEvents() {
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.loadInvestors();
      });
    });

    // Search
    const searchInput = document.getElementById('investorSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.loadInvestors();
      });
    }

    // View toggle
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const gridEl = document.getElementById('investorGrid');
    const tableEl = document.getElementById('investorTable');

    if (gridViewBtn && listViewBtn) {
      gridViewBtn.addEventListener('click', () => {
        gridEl.classList.remove('hidden');
        tableEl.classList.add('hidden');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
      });
      
      listViewBtn.addEventListener('click', () => {
        gridEl.classList.add('hidden');
        tableEl.classList.remove('hidden');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
      });
    }

    // Modal close
    const modal = document.getElementById('investorModal');
    const closeBtn = document.getElementById('closeModal');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Investors.init());
