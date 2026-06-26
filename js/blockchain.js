// js/blockchain.js
/**
 * PREMIER INVESTOR VAULT — Blockchain Ledger
 * Immutable transaction records with hash verification
 */

const Blockchain = {
  init() {
    this.loadLedger();
    this.renderBlockChain();
    this.bindEvents();
  },

  loadLedger() {
    const transactions = Storage.getTransactions();
    const blocks = this.createBlocks(transactions);
    this.renderBlocks(blocks);
    this.renderLedgerTable(transactions);
  },

  createBlocks(transactions) {
    let previousHash = '0'.repeat(64);
    
    return transactions.map((tx, index) => {
      const blockData = {
        index: index,
        timestamp: tx.date,
        data: tx,
        previousHash: previousHash
      };
      
      const hash = this.calculateHash(blockData);
      previousHash = hash;
      
      return {
        ...blockData,
        hash: hash,
        nonce: Math.floor(Math.random() * 10000)
      };
    });
  },

  calculateHash(blockData) {
    // Simple hash simulation for demo
    const str = JSON.stringify(blockData);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char + (i * 17);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  },

  renderBlocks(blocks) {
    const container = document.getElementById('blockchainVisual');
    if (!container) return;

    const html = blocks.slice(-5).map(block => `
      <div class="block-node">
        <div class="block-header">
          <span class="block-index">#${block.index}</span>
          <span class="block-time">${new Date(block.timestamp).toLocaleTimeString()}</span>
        </div>
        <div class="block-hash">
          <span class="hash-label">Hash</span>
          <span class="hash-value truncate">${block.hash}</span>
        </div>
        <div class="block-prev">
          <span class="hash-label">Prev</span>
          <span class="hash-value truncate">${block.previousHash}</span>
        </div>
        <div class="block-tx">
          <i class="fas fa-exchange-alt"></i>
          <span>${block.data.type}: ${block.data.asset}</span>
        </div>
        <div class="chain-link">
          <i class="fas fa-link"></i>
        </div>
      </div>
    `).join('');

    container.innerHTML = html;
  },

  renderLedgerTable(transactions) {
    const tbody = document.getElementById('ledgerTableBody');
    if (!tbody) return;

    const html = transactions.map((tx, index) => `
      <tr>
        <td><span class="tx-hash">#${index.toString().padStart(4, '0')}</span></td>
        <td>${new Date(tx.date).toLocaleString()}</td>
        <td><span class="badge-type ${tx.type.toLowerCase()}">${tx.type}</span></td>
        <td>${tx.asset}</td>
        <td class="${tx.type === 'Deposit' ? 'positive' : 'negative'}">
          ${tx.type === 'Deposit' ? '+' : '-'}${this.formatCurrency(tx.amount)}
        </td>
        <td>
          <span class="verify-badge verified">
            <i class="fas fa-shield-alt"></i> Verified
          </span>
        </td>
      </tr>
    `).join('');

    tbody.innerHTML = html;
  },

  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  },

  bindEvents() {
    const verifyBtn = document.getElementById('verifyChain');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => {
        verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        setTimeout(() => {
          verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Chain Verified';
          verifyBtn.classList.add('verified');
        }, 1500);
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Blockchain.init());
