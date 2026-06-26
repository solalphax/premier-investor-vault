/* /js/blockchain.js - Premier Investor Vault Blockchain Monitor */
(function() {
    'use strict';

    const Blockchain = {
        init: function() {
            this.renderChain();
            this.renderContracts();
            this.renderTransactions();
            this.startLiveUpdates();
            this.bindEvents();
        },

        // Generate mock blockchain data
        generateBlocks: function() {
            const blocks = [];
            const now = Date.now();
            for (let i = 0; i < 6; i++) {
                const hash = this.generateHash();
                const prevHash = i > 0 ? blocks[i - 1].hash : '0'.repeat(64);
                blocks.push({
                    number: 18472930 + i,
                    hash: hash,
                    prevHash: prevHash,
                    timestamp: new Date(now - (i * 12000)).toLocaleTimeString(),
                    transactions: Math.floor(Math.random() * 200) + 50,
                    size: (Math.random() * 50 + 20).toFixed(2) + ' KB',
                    miner: '0x' + Math.random().toString(16).substr(2, 40)
                });
            }
            return blocks.reverse();
        },

        // Generate random hash
        generateHash: function() {
            const chars = '0123456789abcdef';
            let hash = '';
            for (let i = 0; i < 64; i++) {
                hash += chars[Math.floor(Math.random() * 16)];
            }
            return hash;
        },

        // Render blockchain visual
        renderChain: function() {
            const container = document.getElementById('blockchain-visual');
            if (!container) return;

            const blocks = this.generateBlocks();

            container.innerHTML =
                '<div class="blockchain-visual">' +
                '<div class="live-indicator">' +
                '<div class="pulse"></div>' +
                '<span>Live Blockchain Monitor</span>' +
                '</div>' +
                '<div class="chain-container">' +
                blocks.map(function(block) {
                    return '<div class="chain-block">' +
                        '<div class="block-header">' +
                        '<span class="block-num">Block #' + block.number.toLocaleString() + '</span>' +
                        '<span class="block-time">' + block.timestamp + '</span>' +
                        '</div>' +
                        '<div class="block-hash">' + block.hash.substring(0, 16) + '...</div>' +
                        '<div class="block-txs"><i class="fas fa-exchange-alt"></i> ' + block.transactions + ' transactions</div>' +
                        '<div class="block-connector"><i class="fas fa-link"></i></div>' +
                        '</div>';
                }).join('') +
                '</div>' +
                '</div>';
        },

        // Render smart contracts
        renderContracts: function() {
            const container = document.getElementById('contract-grid');
            if (!container) return;

            const contracts = [
                { id: 'SC-001', name: 'Escrow Agreement', status: 'active', deployed: '2026-01-15', calls: 1247, value: '$2.4M' },
                { id: 'SC-002', name: 'Token Distribution', status: 'active', deployed: '2026-02-20', calls: 3892, value: '$8.1M' },
                { id: 'SC-003', name: 'Vesting Schedule', status: 'pending', deployed: '2026-03-10', calls: 156, value: '$1.2M' },
                { id: 'SC-004', name: 'Governance Voting', status: 'active', deployed: '2026-04-05', calls: 567, value: '$450K' },
                { id: 'SC-005', name: 'Staking Pool', status: 'active', deployed: '2026-05-12', calls: 2103, value: '$5.7M' },
                { id: 'SC-006', name: 'Insurance Pool', status: 'pending', deployed: '2026-06-01', calls: 89, value: '$890K' }
            ];

            container.innerHTML = contracts.map(function(sc) {
                const statusClass = sc.status;
                return '<div class="contract-card">' +
                    '<div class="contract-header">' +
                    '<div class="contract-icon"><i class="fas fa-file-code"></i></div>' +
                    '<div class="contract-status ' + statusClass + '">' + sc.status + '</div>' +
                    '</div>' +
                    '<div class="contract-title">' + sc.name + '</div>' +
                    '<div class="contract-desc">Smart contract for automated execution</div>' +
                    '<div class="contract-meta">' +
                    '<span><i class="far fa-calendar"></i> ' + sc.deployed + '</span>' +
                    '</div>' +
                    '<div class="contract-stats">' +
                    '<div><div class="stat-num">' + sc.calls.toLocaleString() + '</div><div class="stat-label">Calls</div></div>' +
                    '<div><div class="stat-num">' + sc.value + '</div><div class="stat-label">Value Locked</div></div>' +
                    '<div><div class="stat-num">0.02%</div><div class="stat-label">Gas Fee</div></div>' +
                    '</div>' +
                    '</div>';
            }).join('');
        },

        // Render recent blockchain transactions
        renderTransactions: function() {
            const container = document.getElementById('blockchain-txs');
            if (!container) return;

            const txs = [
                { hash: '0x' + this.generateHash().substring(0, 40), from: '0x7a9f...3d2e', to: '0x2b4c...8a1f', amount: '1.25 ETH', fee: '0.0042 ETH', time: '12s ago', status: 'confirmed' },
                { hash: '0x' + this.generateHash().substring(0, 40), from: '0x1e3d...9c4b', to: '0x5f8a...2e7d', amount: '450.00 USDT', fee: '2.50 USDT', time: '45s ago', status: 'confirmed' },
                { hash: '0x' + this.generateHash().substring(0, 40), from: '0x9b2e...7f1a', to: '0x3c6d...4b8e', amount: '0.85 BTC', fee: '0.00012 BTC', time: '1m ago', status: 'pending' },
                { hash: '0x' + this.generateHash().substring(0, 40), from: '0x4d7f...1a3c', to: '0x8e2b...6d9f', amount: '2,500.00 USDC', fee: '1.25 USDC', time: '2m ago', status: 'confirmed' },
                { hash: '0x' + this.generateHash().substring(0, 40), from: '0x6a1c...9e4d', to: '0x2f5b...8c3a', amount: '15.50 BNB', fee: '0.003 BNB', time: '3m ago', status: 'confirmed' }
            ];

            container.innerHTML =
                '<table class="activity-table">' +
                '<thead><tr>' +
                '<th>Transaction Hash</th>' +
                '<th>From</th>' +
                '<th>To</th>' +
                '<th>Amount</th>' +
                '<th>Fee</th>' +
                '<th>Status</th>' +
                '</tr></thead>' +
                '<tbody>' +
                txs.map(function(tx) {
                    const statusClass = tx.status === 'confirmed' ? 'success' : 'pending';
                    return '<tr>' +
                        '<td class="tx-hash">' + tx.hash + '</td>' +
                        '<td class="address">' + tx.from + '</td>' +
                        '<td class="address">' + tx.to + '</td>' +
                        '<td class="amount">' + tx.amount + '</td>' +
                        '<td>' + tx.fee + '</td>' +
                        '<td><span class="status-badge ' + statusClass + '">' + tx.status + '</span></td>' +
                        '</tr>';
                }).join('') +
                '</tbody></table>';
        },

        // Live updates
        startLiveUpdates: function() {
            const self = this;
            // Update block times every 10 seconds
            setInterval(function() {
                const timeEls = document.querySelectorAll('.block-time');
                timeEls.forEach(function(el, i) {
                    const now = new Date();
                    el.textContent = now.toLocaleTimeString();
                });
            }, 10000);

            // Occasionally add a new block
            setInterval(function() {
                if (Math.random() > 0.7) {
                    self.addNewBlock();
                }
            }, 30000);
        },

        // Add new block to chain
        addNewBlock: function() {
            const container = document.querySelector('.chain-container');
            if (!container) return;

            const lastBlock = container.querySelector('.chain-block:last-child');
            const lastNum = lastBlock ? parseInt(lastBlock.querySelector('.block-num').textContent.replace(/[^0-9]/g, '')) : 18472935;

            const newBlock = document.createElement('div');
            newBlock.className = 'chain-block';
            newBlock.innerHTML =
                '<div class="block-header">' +
                '<span class="block-num">Block #' + (lastNum + 1).toLocaleString() + '</span>' +
                '<span class="block-time">' + new Date().toLocaleTimeString() + '</span>' +
                '</div>' +
                '<div class="block-hash">' + this.generateHash().substring(0, 16) + '...</div>' +
                '<div class="block-txs"><i class="fas fa-exchange-alt"></i> ' + (Math.floor(Math.random() * 200) + 50) + ' transactions</div>' +
                '<div class="block-connector"><i class="fas fa-link"></i></div>';

            // Remove first block, add new one
            const blocks = container.querySelectorAll('.chain-block');
            if (blocks.length > 6) {
                blocks[0].remove();
            }
            container.appendChild(newBlock);

            // Animate in
            newBlock.style.animation = 'fadeIn 0.5s ease';
        },

        // Bind events
        bindEvents: function() {
            // Refresh button
            const refreshBtn = document.getElementById('refresh-chain');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', function() {
                    Blockchain.renderChain();
                    Blockchain.showToast('Blockchain data refreshed', 'success');
                });
            }

            // Contract interaction
            document.addEventListener('click', function(e) {
                const card = e.target.closest('.contract-card');
                if (card) {
                    const title = card.querySelector('.contract-title').textContent;
                    Blockchain.showToast('Opening ' + title + '...', 'info');
                }
            });
        },

        // Toast helper
        showToast: function(message, type) {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = 'toast ' + type;
            toast.innerHTML =
                '<div class="toast-icon"><i class="fas ' + (type === 'success' ? 'fa-check' : 'fa-info-circle') + '"></i></div>' +
                '<div class="toast-content"><div class="toast-title">' + type.charAt(0).toUpperCase() + type.slice(1) + '</div>' +
                '<div class="toast-message">' + message + '</div></div>' +
                '<button class="toast-close"><i class="fas fa-times"></i></button>';

            container.appendChild(toast);

            toast.querySelector('.toast-close').addEventListener('click', function() {
                toast.remove();
            });

            setTimeout(function() { toast.remove(); }, 4000);
        }
    };

    window.PIVBlockchain = Blockchain;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { Blockchain.init(); });
    } else {
        Blockchain.init();
    }
})();
