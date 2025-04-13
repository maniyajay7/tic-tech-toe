// DOM Elements - Auth
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const registerUsername = document.getElementById('register-username');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const authTabs = document.querySelectorAll('.auth-tab');

// DOM Elements - Main App
const usernameEl = document.getElementById('username');
const logoutBtn = document.getElementById('logout-btn');
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const transactionList = document.getElementById('transaction-list');
const transactionForm = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('transaction-date');
const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');
const dateFrom = document.getElementById('date-from');
const dateTo = document.getElementById('date-to');
const clearDateFilter = document.getElementById('clear-date-filter');
const timeRange = document.getElementById('time-range');

// DOM Elements - Charts
const categoryChart = document.getElementById('category-chart');
const incomeExpenseChart = document.getElementById('income-expense-chart');
const dailyChart = document.getElementById('daily-chart');

// DOM Elements - Groups
const createGroupBtn = document.getElementById('create-group-btn');
const createFirstGroupBtn = document.getElementById('create-first-group-btn');
const createGroupModal = document.getElementById('create-group-modal');
const createGroupForm = document.getElementById('create-group-form');
const groupNameInput = document.getElementById('group-name-input');
const noGroups = document.getElementById('no-groups');
const groupsContent = document.getElementById('groups-content');
const groupsList = document.getElementById('groups-list-items');
const groupName = document.getElementById('group-name');
const groupCreatedBy = document.getElementById('group-created-by');
const membersList = document.getElementById('members-list');
const newMemberInput = document.getElementById('new-member');
const addMemberBtn = document.getElementById('add-member-btn');
const addExpenseBtn = document.getElementById('add-expense-btn');
const addExpenseModal = document.getElementById('add-expense-modal');
const addExpenseForm = document.getElementById('add-expense-form');
const expenseDescription = document.getElementById('expense-description');
const expenseAmount = document.getElementById('expense-amount');
const expensePaidBy = document.getElementById('expense-paid-by');
const groupExpensesList = document.getElementById('group-expenses-list');
const noExpenses = document.getElementById('no-expenses');
const balancesList = document.getElementById('balances-list');
const settlementsList = document.getElementById('settlements-list');
const noBalances = document.getElementById('no-balances');

// DOM Elements - Tabs
const mainTabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const groupTabs = document.querySelectorAll('.group-tab');
const groupTabContents = document.querySelectorAll('.group-tab-content');

// Close buttons for modals
const closeButtons = document.querySelectorAll('.close');

// Global variables
let currentUser = '';
let transactions = [];
let groups = [];
let selectedGroup = null;
let categoryChartInstance = null;
let incomeExpenseChartInstance = null;
let dailyChartInstance = null;

// Colors for charts
const CHART_COLORS = [
    '#f94144', '#f3722c', '#f8961e', '#f9c74f', 
    '#90be6d', '#43aa8b', '#4d908e', '#577590', '#277da1'
];

// Initialize the app
function init() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        currentUser = localStorage.getItem('currentUser') || '';
        showApp();
        loadUserData();
    } else {
        showAuth();
    }
    
    // Set today's date as default for transaction date
    dateInput.valueAsDate = new Date();
}

// Show auth container
function showAuth() {
    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
}

// Show app container
function showApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    usernameEl.textContent = currentUser;
}

// Load user data
function loadUserData() {
    loadTransactions();
    loadGroups();
    updateValues();
    updateTransactionList();
    initCharts();
    updateGroupsUI();
}

// Load transactions from localStorage
function loadTransactions() {
    const userTransactions = JSON.parse(localStorage.getItem('userTransactions')) || {};
    transactions = userTransactions[currentUser] || [];
}

// Save transactions to localStorage
function saveTransactions() {
    const userTransactions = JSON.parse(localStorage.getItem('userTransactions')) || {};
    userTransactions[currentUser] = transactions;
    localStorage.setItem('userTransactions', JSON.stringify(userTransactions));
}

// Load groups from localStorage
function loadGroups() {
    const userGroups = JSON.parse(localStorage.getItem('userGroups')) || {};
    groups = userGroups[currentUser] || [];
}

// Save groups to localStorage
function saveGroups() {
    const userGroups = JSON.parse(localStorage.getItem('userGroups')) || {};
    userGroups[currentUser] = groups;
    localStorage.setItem('userGroups', JSON.stringify(userGroups));
}

// Update financial values
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    
    const total = amounts.reduce((acc, amount) => acc + amount, 0).toFixed(2);
    const income = amounts
        .filter(amount => amount > 0)
        .reduce((acc, amount) => acc + amount, 0)
        .toFixed(2);
    const expense = (amounts
        .filter(amount => amount < 0)
        .reduce((acc, amount) => acc + amount, 0) * -1)
        .toFixed(2);
    
    balanceEl.textContent = `$${total}`;
    moneyPlusEl.textContent = `+$${income}`;
    moneyMinusEl.textContent = `-$${expense}`;
}

// Add transaction
function addTransaction(e) {
    e.preventDefault();
    
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;
    
    if (!description || isNaN(amount) || !category || !date) return;
    
    const transaction = {
        id: generateID(),
        description,
        amount,
        category,
        date: new Date(date).toISOString()
    };
    
    transactions.push(transaction);
    saveTransactions();
    
    updateValues();
    updateTransactionList();
    updateCharts();
    
    // Reset form
    transactionForm.reset();
    dateInput.valueAsDate = new Date();
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions();
    
    updateValues();
    updateTransactionList();
    updateCharts();
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Update transaction list with filters
function updateTransactionList() {
    transactionList.innerHTML = '';
    
    let filteredTransactions = [...transactions];
    
    // Filter by type
    const type = filterType.value;
    if (type === 'income') {
        filteredTransactions = filteredTransactions.filter(t => t.amount > 0);
    } else if (type === 'expense') {
        filteredTransactions = filteredTransactions.filter(t => t.amount < 0);
    }
    
    // Filter by category
    const category = filterCategory.value;
    if (category !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.category === category);
    }
    
    // Filter by date range
    if (dateFrom.value) {
        const fromDate = new Date(dateFrom.value);
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= fromDate);
    }
    
    if (dateTo.value) {
        const toDate = new Date(dateTo.value);
        toDate.setHours(23, 59, 59, 999); // End of day
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= toDate);
    }
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = '<li class="no-data-message">No transactions found</li>';
        return;
    }
    
    filteredTransactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
        
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        item.innerHTML = `
            <div class="transaction-details">
                <span>${transaction.description}</span>
                <div>
                    <span class="transaction-category">${transaction.category}</span>
                    <span class="transaction-date">${formattedDate}</span>
                </div>
            </div>
            <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">×</button>
        `;
        
        transactionList.appendChild(item);
    });
}

// Initialize charts
function initCharts() {
    updateCategoryChart();
    updateIncomeExpenseChart();
    updateDailyChart();
}

// Update charts
function updateCharts() {
    updateCategoryChart();
    updateIncomeExpenseChart();
    updateDailyChart();
}

// Update category chart
function updateCategoryChart() {
    // Destroy existing chart if it exists
    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }
    
    // Filter transactions based on time range
    let filteredTransactions = [...transactions];
    const selectedTimeRange = timeRange.value;
    
    if (selectedTimeRange === 'month') {
        const startDate = new Date();
        startDate.setDate(1); // First day of current month
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= startDate);
    } else if (selectedTimeRange === 'quarter') {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= startDate);
    } else if (selectedTimeRange === 'year') {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= startDate);
    }
    
    // Only include expenses
    filteredTransactions = filteredTransactions.filter(t => t.amount < 0);
    
    // Group by category
    const categoryMap = {};
    filteredTransactions.forEach(transaction => {
        const category = transaction.category;
        const amount = Math.abs(transaction.amount);
        
        if (categoryMap[category]) {
            categoryMap[category] += amount;
        } else {
            categoryMap[category] = amount;
        }
    });
    
    const categories = Object.keys(categoryMap);
    const data = Object.values(categoryMap);
    
    if (categories.length === 0) {
        return;
    }
    
    categoryChartInstance = new Chart(categoryChart, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: data,
                backgroundColor: CHART_COLORS,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#f8f9fa'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw.toFixed(2);
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.raw / total) * 100);
                            return `${label}: $${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update income vs expense chart
function updateIncomeExpenseChart() {
    // Destroy existing chart if it exists
    if (incomeExpenseChartInstance) {
        incomeExpenseChartInstance.destroy();
    }
    
    // Filter transactions based on time range
    let filteredTransactions = [...transactions];
    const selectedTimeRange = timeRange.value;
    
    // Determine how many months to look back
    let monthsToLookBack = 12;
    if (selectedTimeRange === 'month') {
        monthsToLookBack = 1;
    } else if (selectedTimeRange === 'quarter') {
        monthsToLookBack = 3;
    }
    
    // Group by month
    const monthlyData = {};
    
    // Initialize with empty data for all months
    for (let i = 0; i < monthsToLookBack; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[monthYear] = { income: 0, expense: 0 };
    }
    
    // Fill with actual data
    filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        // Only process if within our time range
        if (monthlyData[monthYear]) {
            if (transaction.amount > 0) {
                monthlyData[monthYear].income += transaction.amount;
            } else {
                monthlyData[monthYear].expense += Math.abs(transaction.amount);
            }
        }
    });
    
    // Convert to arrays for chart
    const labels = Object.keys(monthlyData).reverse();
    const incomeData = labels.map(month => monthlyData[month].income);
    const expenseData = labels.map(month => monthlyData[month].expense);
    
    incomeExpenseChartInstance = new Chart(incomeExpenseChart, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    backgroundColor: '#43aa8b',
                    borderWidth: 1
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    backgroundColor: '#f94144',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#f8f9fa'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#f8f9fa',
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f8f9fa'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Update daily chart
function updateDailyChart() {
    // Destroy existing chart if it exists
    if (dailyChartInstance) {
        dailyChartInstance.destroy();
    }
    
    // Filter transactions based on time range
    let filteredTransactions = [...transactions];
    const selectedTimeRange = timeRange.value;
    
    let startDate = new Date();
    if (selectedTimeRange === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
    } else if (selectedTimeRange === 'quarter') {
        startDate.setMonth(startDate.getMonth() - 3);
    } else if (selectedTimeRange === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= startDate);
    
    // Group by date
    const dailyData = {};
    
    filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const dateStr = date.toISOString().split('T')[0];
        
        if (!dailyData[dateStr]) {
            dailyData[dateStr] = {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                income: 0,
                expense: 0
            };
        }
        
        if (transaction.amount > 0) {
            dailyData[dateStr].income += transaction.amount;
        } else {
            dailyData[dateStr].expense += Math.abs(transaction.amount);
        }
    });
    
    // Convert to arrays and sort by date
    const dailyDataArray = Object.values(dailyData);
    dailyDataArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const labels = dailyDataArray.map(d => d.date);
    const incomeData = dailyDataArray.map(d => d.income);
    const expenseData = dailyDataArray.map(d => d.expense);
    
    dailyChartInstance = new Chart(dailyChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#43aa8b',
                    backgroundColor: 'rgba(67, 170, 139, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    borderColor: '#f94144',
                    backgroundColor: 'rgba(249, 65, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#f8f9fa'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#f8f9fa',
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f8f9fa'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Update groups UI
function updateGroupsUI() {
    if (groups.length === 0) {
        noGroups.classList.remove('hidden');
        groupsContent.classList.add('hidden');
    } else {
        noGroups.classList.add('hidden');
        groupsContent.classList.remove('hidden');
        
        // Update groups list
        groupsList.innerHTML = '';
        groups.forEach(group => {
            const li = document.createElement('li');
            li.textContent = group.name;
            li.dataset.id = group.id;
            
            if (selectedGroup && selectedGroup.id === group.id) {
                li.classList.add('active');
            }
            
            li.addEventListener('click', () => selectGroup(group));
            groupsList.appendChild(li);
        });
        
        // If no group is selected, select the first one
        if (!selectedGroup && groups.length > 0) {
            selectGroup(groups[0]);
        } else if (selectedGroup) {
            // Refresh selected group data
            selectGroup(groups.find(g => g.id === selectedGroup.id) || groups[0]);
        }
    }
}

// Select a group
function selectGroup(group) {
    selectedGroup = group;
    
    // Update UI
    groupName.textContent = group.name;
    
    const createdDate = new Date(group.createdAt);
    const formattedDate = createdDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    groupCreatedBy.textContent = `Created by ${group.createdBy} on ${formattedDate}`;
    
    // Update members list
    updateMembersList();
    
    // Update expenses list
    updateExpensesList();
    
    // Update balances
    updateBalances();
    
    // Update active group in list
    const groupItems = groupsList.querySelectorAll('li');
    groupItems.forEach(item => {
        if (parseInt(item.dataset.id) === group.id) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Update members list
function updateMembersList() {
    membersList.innerHTML = '';
    
    selectedGroup.members.forEach(member => {
        const li = document.createElement('li');
        
        const memberSpan = document.createElement('span');
        memberSpan.textContent = member;
        
        li.appendChild(memberSpan);
        
        // Add creator badge if this is the creator
        if (member === selectedGroup.createdBy) {
            const badge = document.createElement('span');
            badge.textContent = 'Creator';
            badge.classList.add('badge');
            li.appendChild(badge);
        } else {
            // Add remove button for non-creators
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.classList.add('btn', 'btn-small');
            removeBtn.addEventListener('click', () => removeMember(member));
            li.appendChild(removeBtn);
        }
        
        membersList.appendChild(li);
    });
}

// Add member to group
function addMember() {
    const newMember = newMemberInput.value.trim();
    
    if (!newMember) return;
    
    // Check if member already exists
    if (selectedGroup.members.includes(newMember)) {
        alert('This member is already in the group');
        return;
    }
    
    // Add member
    selectedGroup.members.push(newMember);
    
    // Update groups
    const updatedGroups = groups.map(g => 
        g.id === selectedGroup.id ? selectedGroup : g
    );
    
    groups = updatedGroups;
    saveGroups();
    
    // Update UI
    updateMembersList();
    newMemberInput.value = '';
}

// Remove member from group
function removeMember(memberToRemove) {
    // Cannot remove the creator
    if (memberToRemove === selectedGroup.createdBy) {
        alert('Cannot remove the group creator');
        return;
    }
    
    // Remove member
    selectedGroup.members = selectedGroup.members.filter(m => m !== memberToRemove);
    
    // Update groups
    const updatedGroups = groups.map(g => 
        g.id === selectedGroup.id ? selectedGroup : g
    );
    
    groups = updatedGroups;
    saveGroups();
    
    // Update UI
    updateMembersList();
}

// Update expenses list
function updateExpensesList() {
    groupExpensesList.innerHTML = '';
    
    if (selectedGroup.expenses.length === 0) {
        noExpenses.classList.remove('hidden');
        groupExpensesList.classList.add('hidden');
    } else {
        noExpenses.classList.add('hidden');
        groupExpensesList.classList.remove('hidden');
        
        selectedGroup.expenses.forEach(expense => {
            const li = document.createElement('li');
            
            const expenseDate = new Date(expense.date);
            const formattedDate = expenseDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            li.innerHTML = `
                <div class="expense-header">
                    <div>
                        <h4>${expense.description}</h4>
                        <p class="expense-details">${formattedDate}</p>
                    </div>
                    <div class="expense-amount">
                        <span class="money">$${expense.amount.toFixed(2)}</span>
                        <button class="btn btn-small" onclick="deleteGroupExpense(${expense.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <p>Paid by <strong>${expense.paidBy}</strong></p>
                <div class="expense-splits">
                    <p>Split equally among ${selectedGroup.members.length} members</p>
                    <div class="splits-grid">
                        ${Object.entries(expense.splits).map(([member, amount]) => `
                            <div class="split-item">
                                <span>${member}</span>
                                <span class="${amount > 0 ? 'plus' : 'minus'}">${amount > 0 ? '+' : ''}$${Math.abs(amount).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            groupExpensesList.appendChild(li);
        });
    }
}

// Delete group expense
function deleteGroupExpense(expenseId) {
    // Remove expense
    selectedGroup.expenses = selectedGroup.expenses.filter(e => e.id !== expenseId);
    
    // Update groups
    const updatedGroups = groups.map(g => 
        g.id === selectedGroup.id ? selectedGroup : g
    );
    
    groups = updatedGroups;
    saveGroups();
    
    // Update UI
    updateExpensesList();
    updateBalances();
}

// Update balances
function updateBalances() {
    const balances = calculateBalances();
    
    balancesList.innerHTML = '';
    settlementsList.innerHTML = '';
    
    if (Object.keys(balances).length === 0) {
        noBalances.classList.remove('hidden');
        balancesList.classList.add('hidden');
        settlementsList.classList.add('hidden');
    } else {
        noBalances.classList.add('hidden');
        balancesList.classList.remove('hidden');
        settlementsList.classList.remove('hidden');
        
        // Display balances
        Object.entries(balances).forEach(([member, balance]) => {
            const li = document.createElement('li');
            
            const memberSpan = document.createElement('span');
            memberSpan.textContent = member;
            
            const balanceSpan = document.createElement('span');
            balanceSpan.textContent = `${balance > 0 ? '+' : ''}$${balance.toFixed(2)}`;
            
            if (balance > 0) {
                balanceSpan.classList.add('plus');
            } else if (balance < 0) {
                balanceSpan.classList.add('minus');
            }
            
            li.appendChild(memberSpan);
            li.appendChild(balanceSpan);
            
            balancesList.appendChild(li);
        });
        
        // Display settlements
        const settlements = generateSettlements(balances);
        
        settlements.forEach(settlement => {
            const li = document.createElement('li');
            
            li.innerHTML = `
                <i class="fas fa-dollar-sign"></i>
                <span><strong>${settlement.from}</strong> pays <strong>${settlement.to}</strong> <span class="money">$${settlement.amount.toFixed(2)}</span></span>
            `;
            
            settlementsList.appendChild(li);
        });
    }
}

// Calculate balances
function calculateBalances() {
    if (!selectedGroup) return {};
    
    const balances = {};
    
    // Initialize balances for all members
    selectedGroup.members.forEach(member => {
        balances[member] = 0;
    });
    
    // Calculate balances based on expenses
    selectedGroup.expenses.forEach(expense => {
        Object.entries(expense.splits).forEach(([member, amount]) => {
            balances[member] = (balances[member] || 0) + amount;
        });
    });
    
    return balances;
}

// Generate settlement suggestions
function generateSettlements(balances) {
    const settlements = [];
    
    const debtors = Object.entries(balances)
        .filter(([_, balance]) => balance < 0)
        .map(([name, balance]) => ({ name, balance: Math.abs(balance) }))
        .sort((a, b) => b.balance - a.balance);
    
    const creditors = Object.entries(balances)
        .filter(([_, balance]) => balance > 0)
        .map(([name, balance]) => ({ name, balance }))
        .sort((a, b) => b.balance - a.balance);
    
    // Create settlements until all debts are settled
    while (debtors.length > 0 && creditors.length > 0) {
        const debtor = debtors[0];
        const creditor = creditors[0];
        
        // Calculate the amount to settle
        const amount = Math.min(debtor.balance, creditor.balance);
        
        // Add settlement
        settlements.push({
            from: debtor.name,
            to: creditor.name,
            amount
        });
        
        // Update balances
        debtor.balance -= amount;
        creditor.balance -= amount;
        
        // Remove settled parties
        if (debtor.balance < 0.01) debtors.shift();
        if (creditor.balance < 0.01) creditors.shift();
    }
    
    return settlements;
}

// Create a new group
function createGroup(e) {
    e.preventDefault();
    
    const groupName = groupNameInput.value.trim();
    
    if (!groupName) return;
    
    const newGroup = {
        id: Date.now(),
        name: groupName,
        members: [currentUser],
        expenses: [],
        createdBy: currentUser,
        createdAt: new Date().toISOString()
    };
    
    groups.push(newGroup);
    saveGroups();
    
    // Update UI
    updateGroupsUI();
    selectGroup(newGroup);
    
    // Reset form and close modal
    createGroupForm.reset();
    createGroupModal.style.display = 'none';
}

// Add expense to group
function addExpense(e) {
    e.preventDefault();
    
    const description = expenseDescription.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const paidBy = expensePaidBy.value.trim();
    
    if (!description || isNaN(amount) || amount <= 0 || !paidBy) return;
    
    // Validate paidBy is a member
    if (!selectedGroup.members.includes(paidBy)) {
        alert('The person who paid must be a group member');
        return;
    }
    
    // Create equal splits
    const splitAmount = amount / selectedGroup.members.length;
    const splits = {};
    
    selectedGroup.members.forEach(member => {
        if (member === paidBy) {
            // The person who paid gets credited
            splits[member] = amount - splitAmount;
        } else {
            // Others owe their share
            splits[member] = -splitAmount;
        }
    });
    
    const newExpense = {
        id: Date.now(),
        description,
        amount,
        paidBy,
        date: new Date().toISOString(),
        splitType: 'equal',
        splits
    };
    
    selectedGroup.expenses.push(newExpense);
    
    // Update groups
    const updatedGroups = groups.map(g => 
        g.id === selectedGroup.id ? selectedGroup : g
    );
    
    groups = updatedGroups;
    saveGroups();
    
    // Update UI
    updateExpensesList();
    updateBalances();
    
    // Reset form and close modal
    addExpenseForm.reset();
    addExpenseModal.style.display = 'none';
}

// Event Listeners

// Auth tabs
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show active content
        document.querySelectorAll('.auth-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Login form
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const username = loginUsername.value.trim();
    const password = loginPassword.value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => (u.username === username || u.email === username));
    
    if (user && user.password === password) {
        currentUser = user.username;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', currentUser);
        
        // Initialize user data if not exists
        const userTransactions = JSON.parse(localStorage.getItem('userTransactions')) || {};
        if (!userTransactions[currentUser]) {
            userTransactions[currentUser] = [];
            localStorage.setItem('userTransactions', JSON.stringify(userTransactions));
        }
        
        const userGroups = JSON.parse(localStorage.getItem('userGroups')) || {};
        if (!userGroups[currentUser]) {
            userGroups[currentUser] = [];
            localStorage.setItem('userGroups', JSON.stringify(userGroups));
        }
        
        showApp();
        loadUserData();
        loginForm.reset();
    } else {
        loginError.textContent = 'Invalid username or password';
    }
});

// Register form
registerForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const username = registerUsername.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    const usernameExists = users.some(u => u.username === username);
    const emailExists = users.some(u => u.email === email);
    
    if (usernameExists) {
        registerError.textContent = 'Username already exists';
        return;
    }
    
    if (emailExists) {
        registerError.textContent = 'Email already registered';
        return;
    }
    
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Initialize empty transactions for the new user
    const userTransactions = JSON.parse(localStorage.getItem('userTransactions')) || {};
    userTransactions[username] = [];
    localStorage.setItem('userTransactions', JSON.stringify(userTransactions));
    
    // Initialize empty groups for the new user
    const userGroups = JSON.parse(localStorage.getItem('userGroups')) || {};
    userGroups[username] = [];
    localStorage.setItem('userGroups', JSON.stringify(userGroups));
    
    // Switch to login tab
    authTabs[0].click();
    registerForm.reset();
    loginError.textContent = 'Registration successful! Please log in.';
});

// Logout button
logoutBtn.addEventListener('click', () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('currentUser');
    currentUser = '';
    transactions = [];
    groups = [];
    selectedGroup = null;
    showAuth();
});

// Transaction form
transactionForm.addEventListener('submit', addTransaction);

// Filter changes
filterType.addEventListener('change', updateTransactionList);
filterCategory.addEventListener('change', updateTransactionList);
dateFrom.addEventListener('change', updateTransactionList);
dateTo.addEventListener('change', updateTransactionList);
clearDateFilter.addEventListener('click', () => {
    dateFrom.value = '';
    dateTo.value = '';
    updateTransactionList();
});

// Time range change for charts
timeRange.addEventListener('change', updateCharts);

// Main tabs
mainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        
        // Update active tab
        mainTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show active content
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // Update charts if analysis tab is selected
        if (tabId === 'analysis') {
            updateCharts();
        }
    });
});

// Group tabs
groupTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        
        // Update active tab
        groupTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show active content
        groupTabContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Create group buttons
createGroupBtn.addEventListener('click', () => {
    createGroupModal.style.display = 'block';
});

createFirstGroupBtn.addEventListener('click', () => {
    createGroupModal.style.display = 'block';
});

// Create group form
createGroupForm.addEventListener('submit', createGroup);

// Add member button
addMemberBtn.addEventListener('click', addMember);

// Add expense button
addExpenseBtn.addEventListener('click', () => {
    addExpenseModal.style.display = 'block';
    expensePaidBy.value = currentUser; // Default to current user
});

// Add expense form
addExpenseForm.addEventListener('submit', addExpense);

// Close buttons for modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.style.display = 'none';
    });
});

// Close modals when clicking outside
window.addEventListener('click', e => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Initialize the app
init();
