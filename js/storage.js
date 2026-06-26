// js/storage.js
/**
 * PREMIER INVESTOR VAULT — LocalStorage Data System
 * Initializes all datasets on first load
 */

const STORAGE_KEYS = {
  INVESTORS: 'piv_investors',
  USERS: 'piv_users',
  SESSION: 'piv_session',
  TRANSACTIONS: 'piv_transactions',
  ASSETS: 'piv_assets',
  RETIREMENT: 'piv_retirement',
  INITIALIZED: 'piv_initialized'
};

const INVESTORS_DATA = [
  { id: 1, name: 'Melissa Brooks', username: 'MelissaBrooks', role: 'Managing Partner', ownership: 18.5, status: 'Active', email: 'melissa.brooks@piv.vault', joined: '2019-03-15' },
  { id: 2, name: 'Jonathan Mercer', username: 'JonathanMercer', role: 'Senior Partner', ownership: 15.2, status: 'Active', email: 'jonathan.mercer@piv.vault', joined: '2019-07-22' },
  { id: 3, name: 'Ethan Caldwell', username: 'EthanCaldwell', role: 'Partner', ownership: 12.8, status: 'Active', email: 'ethan.caldwell@piv.vault', joined: '2020-01-10' },
  { id: 4, name: 'Victoria Reynolds', username: 'VictoriaReynolds', role: 'Partner', ownership: 11.3, status: 'Active', email: 'victoria.reynolds@piv.vault', joined: '2020-05-18' },
  { id: 5, name: 'Marcus Whitmore', username: 'MarcusWhitmore', role: 'Partner', ownership: 9.7, status: 'Active', email: 'marcus.whitmore@piv.vault', joined: '2020-09-03' },
  { id: 6, name: 'Aubrey Stawarski', username: 'AubreyStawarski', role: 'Associate Partner', ownership: 8.4, status: 'Active', email: 'aubrey.stawarski@piv.vault', joined: '2021-02-14' },
  { id: 7, name: 'Nathan Holloway', username: 'NathanHolloway', role: 'Associate Partner', ownership: 7.1, status: 'Active', email: 'nathan.holloway@piv.vault', joined: '2021-06-30' },
  { id: 8, name: 'Rebecca Sterling', username: 'RebeccaSterling', role: 'Associate Partner', ownership: 6.8, status: 'Active', email: 'rebecca.sterling@piv.vault', joined: '2021-11-12' },
  { id: 9, name: 'Derek Fitzgerald', username: 'DerekFitzgerald', role: 'Associate Partner', ownership: 3.2, status: 'Active', email: 'derek.fitzgerald@piv.vault', joined: '2022-03-08' },
  { id: 10, name: 'Olivia Harrington', username: 'OliviaHarrington', role: 'Principal', ownership: 2.9, status: 'Active', email: 'olivia.harrington@piv.vault', joined: '2022-07-19' },
  { id: 11, name: 'Sebastian Cole', username: 'SebastianCole', role: 'Principal', ownership: 2.1, status: 'Active', email: 'sebastian.cole@piv.vault', joined: '2023-01-05' },
  { id: 12, name: 'Isabella Monroe', username: 'IsabellaMonroe', role: 'Principal', ownership: 1.5, status: 'Active', email: 'isabella.monroe@piv.vault', joined: '2023-05-22' },
  { id: 13, name: 'Grayson Whitfield', username: 'GraysonWhitfield', role: 'Analyst', ownership: 0.5, status: 'Active', email: 'grayson.whitfield@piv.vault', joined: '2024-01-15' }
];

const USERS_DATA = [
  { id: 1, name: 'Melissa Brooks', username: 'MelissaBrooks', role: 'Managing Partner', passwordHash: 'piv_3a7f9c2e' },
  { id: 2, name: 'Jonathan Mercer', username: 'JonathanMercer', role: 'Senior Partner', passwordHash: 'piv_8b4d1e5a' },
  { id: 3, name: 'Ethan Caldwell', username: 'EthanCaldwell', role: 'Partner', passwordHash: 'piv_5c2e8f1b' },
  { id: 4, name: 'Victoria Reynolds', username: 'VictoriaReynolds', role: 'Partner', passwordHash: 'piv_9d6a3b7c' },
  { id: 5, name: 'Marcus Whitmore', username: 'MarcusWhitmore', role: 'Partner', passwordHash: 'piv_1e4f7a2d' },
  { id: 6, name: 'Aubrey Stawarski', username: 'AubreyStawarski', role: 'Associate Partner', passwordHash: 'piv_7b2c5e9f' },
  { id: 7, name: 'Nathan Holloway', username: 'NathanHolloway', role: 'Associate Partner', passwordHash: 'piv_4a8d1f3e' },
  { id: 8, name: 'Rebecca Sterling', username: 'RebeccaSterling', role: 'Associate Partner', passwordHash: 'piv_6c3e9b2a' },
  { id: 9, name: 'Derek Fitzgerald', username: 'DerekFitzgerald', role: 'Associate Partner', passwordHash: 'piv_2f5a8c1d' },
  { id: 10, name: 'Olivia Harrington', username: 'OliviaHarrington', role: 'Principal', passwordHash: 'piv_8e1b4d7a' },
  { id: 11, name: 'Sebastian Cole', username: 'SebastianCole', role: 'Principal', passwordHash: 'piv_3c7f2a9e' },
  { id: 12, name: 'Isabella Monroe', username: 'IsabellaMonroe', role: 'Principal', passwordHash: 'piv_5d9a1e6b' },
  { id: 13, name: 'Grayson Whitfield', username: 'GraysonWhitfield', role: 'Analyst', passwordHash: 'piv_1b6c3f8a' }
];

const TRANSACTIONS_DATA = [
  { id: 1, type: 'Deposit', asset: 'SPY', amount: 2500000, date: '2024-01-15T09:30:00Z', status: 'Completed', hash: '0x7a3f...9e2d' },
  { id: 2, type: 'Withdrawal', asset: 'BTC', amount: 450000, date: '2024-01-22T14:15:00Z', status: 'Completed', hash: '0x8b2e...1c4f' },
  { id: 3, type: 'Transfer', asset: 'ETH', amount: 320000, date: '2024-02-01T11:00:00Z', status: 'Completed', hash: '0x9c1d...3a5e' },
  { id: 4, type: 'Deposit', asset: 'AAPL', amount: 1800000, date: '2024-02-14T10:30:00Z', status: 'Completed', hash: '0x1d4e...7b8c' },
  { id: 5, type: 'Deposit', asset: 'TLT', amount: 950000, date: '2024-03-05T08:45:00Z', status: 'Completed', hash: '0x2e5f...9c1d' },
  { id: 6, type: 'Withdrawal', asset: 'GOOGL', amount: 620000, date: '2024-03-18T13:20:00Z', status: 'Completed', hash: '0x3f6a...2e4b' },
  { id: 7, type: 'Transfer', asset: 'MSFT', amount: 1100000, date: '2024-04-02T09:00:00Z', status: 'Completed', hash: '0x4a7b...3f5c' },
  { id: 8, type: 'Deposit', asset: 'VNQ', amount: 750000, date: '2024-04-20T15:30:00Z', status: 'Completed', hash: '0x5b8c...4a6d' },
  { id: 9, type: 'Withdrawal', asset: 'AMZN', amount: 380000, date: '2024-05-08T11:45:00Z', status: 'Completed', hash: '0x6c9d...5b7e' },
  { id: 10, type: 'Deposit', asset: 'VTI', amount: 2100000, date: '2024-05-25T10:00:00Z', status: 'Completed', hash: '0x7d0e...6c8f' },
  { id: 11, type: 'Transfer', asset: 'BTC', amount: 520000, date: '2024-06-10T14:30:00Z', status: 'Pending', hash: '0x8e1f...7d9a' },
  { id: 12, type: 'Deposit', asset: 'QQQ', amount: 1350000, date: '2024-06-18T09:15:00Z', status: 'Completed', hash: '0x9f2a...8e0b' }
];

const ASSETS_DATA = [
  { id: 1, name: 'S&P 500 ETF', ticker: 'SPY', category: 'Equity', value: 12500000, allocation: 25.0, change: 8.3 },
  { id: 2, name: 'US Treasury Bonds', ticker: 'TLT', category: 'Fixed Income', value: 7500000, allocation: 15.0, change: 2.1 },
  { id: 3, name: 'Bitcoin', ticker: 'BTC', category: 'Crypto', value: 5000000, allocation: 10.0, change: 24.7 },
  { id: 4, name: 'Total Stock Market', ticker: 'VTI', category: 'Equity', value: 8000000, allocation: 16.0, change: 6.5 },
  { id: 5, name: 'Real Estate Trust', ticker: 'VNQ', category: 'Real Estate', value: 4500000, allocation: 9.0, change: 4.2 },
  { id: 6, name: 'Ethereum', ticker: 'ETH', category: 'Crypto', value: 3200000, allocation: 6.4, change: 18.9 },
  { id: 7, name: 'Hedge Fund Alpha', ticker: 'HFA', category: 'Alternative', value: 6000000, allocation: 12.0, change: 11.4 },
  { id: 8, name: 'Cash Reserve', ticker: 'USD', category: 'Cash', value: 3300000, allocation: 6.6, change: 0.8 }
];

const RETIREMENT_DATA = [
  { id: 1, holderName: 'Melissa Brooks', planType: '401(k) Traditional', balance: 2850000, monthlyContribution: 2250, employerMatch: 6, target: 8500000, status: 'On Track' },
  { id: 2, holderName: 'Jonathan Mercer', planType: '401(k) Roth', balance: 2100000, monthlyContribution: 1800, employerMatch: 5, target: 7200000, status: 'On Track' },
  { id: 3, holderName: 'Ethan Caldwell', planType: '401(k) Traditional', balance: 1650000, monthlyContribution: 1500, employerMatch: 4, target: 6000000, status: 'On Track' },
  { id: 4, holderName: 'Victoria Reynolds', planType: '401(k) Roth', balance: 1420000, monthlyContribution: 1400, employerMatch: 5, target: 5500000, status: 'On Track' },
  { id: 5, holderName: 'Marcus Whitmore', planType: '401(k) Traditional', balance: 1180000, monthlyContribution: 1200, employerMatch: 4, target: 4800000, status: 'On Track' },
  { id: 6, holderName: 'Aubrey Stawarski', planType: '401(k) Roth', balance: 950000, monthlyContribution: 1000, employerMatch: 4, target: 4200000, status: 'On Track' },
  { id: 7, holderName: 'Nathan Holloway', planType: '401(k) Traditional', balance: 780000, monthlyContribution: 850, employerMatch: 3, target: 3800000, status: 'On Track' },
  { id: 8, holderName: 'Rebecca Sterling', planType: '401(k) Roth', balance: 620000, monthlyContribution: 750, employerMatch: 3, target: 3500000, status: 'On Track' },
  { id: 9, holderName: 'Derek Fitzgerald', planType: '401(k) Traditional', balance: 410000, monthlyContribution: 600, employerMatch: 3, target: 3200000, status: 'Caution' },
  { id: 10, holderName: 'Olivia Harrington', planType: '401(k) Roth', balance: 280000, monthlyContribution: 500, employerMatch: 2, target: 2800000, status: 'On Track' },
  { id: 11, holderName: 'Sebastian Cole', planType: '401(k) Traditional', balance: 195000, monthlyContribution: 450, employerMatch: 2, target: 2500000, status: 'On Track' },
  { id: 12, holderName: 'Isabella Monroe', planType: '401(k) Roth', balance: 120000, monthlyContribution: 400, employerMatch: 2, target: 2200000, status: 'On Track' },
  { id: 13, holderName: 'Grayson Whitfield', planType: '401(k) Traditional', balance: 45000, monthlyContribution: 300, employerMatch: 2, target: 1800000, status: 'On Track' }
];

const Storage = {
  /**
   * Initialize all data on first application load
   */
  init() {
    if (localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true') {
      return;
    }

    localStorage.setItem(STORAGE_KEYS.INVESTORS, JSON.stringify(INVESTORS_DATA));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(USERS_DATA));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(TRANSACTIONS_DATA));
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(ASSETS_DATA));
    localStorage.setItem(STORAGE_KEYS.RETIREMENT, JSON.stringify(RETIREMENT_DATA));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  /**
   * Get all investors
   */
  getInvestors() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.INVESTORS) || '[]');
  },

  /**
   * Get all users
   */
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  /**
   * Get all transactions
   */
  getTransactions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
  },

  /**
   * Get all assets
   */
  getAssets() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSETS) || '[]');
  },

  /**
   * Get all retirement accounts
   */
  getRetirementAccounts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RETIREMENT) || '[]');
  },

  /**
   * Add a new transaction
   */
  addTransaction(transaction) {
    const transactions = this.getTransactions();
    transaction.id = transactions.length + 1;
    transaction.date = new Date().toISOString();
    transaction.status = 'Pending';
    transaction.hash = this.generateHash();
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return transaction;
  },

  /**
   * Generate a simple transaction hash
   */
  generateHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 8; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash + '...' + chars[Math.floor(Math.random() * 16)] + chars[Math.floor(Math.random() * 16)] + chars[Math.floor(Math.random() * 16)] + chars[Math.floor(Math.random() * 16)];
  },

  /**
   * Update investor data
   */
  updateInvestor(id, updates) {
    const investors = this.getInvestors();
    const index = investors.findIndex(inv => inv.id === id);
    if (index !== -1) {
      investors[index] = { ...investors[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.INVESTORS, JSON.stringify(investors));
      return investors[index];
    }
    return null;
  },

  /**
   * Reset all data to defaults
   */
  reset() {
    localStorage.removeItem(STORAGE_KEYS.INVESTORS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.ASSETS);
    localStorage.removeItem(STORAGE_KEYS.RETIREMENT);
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    this.init();
  },

  /**
   * Clear session only
   */
  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};

// Initialize storage on script load
Storage.init();
