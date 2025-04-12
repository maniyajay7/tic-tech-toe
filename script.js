// Firebase configuration (replace with your own)
const firebaseConfig = {
    apiKey: "AIzaSyDEXAMPLEEXAMPLEEXAMPLE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abc123def456"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const providerGoogle = new firebase.auth.GoogleAuthProvider();
  const providerFacebook = new firebase.auth.FacebookAuthProvider();
  const providerGithub = new firebase.auth.GithubAuthProvider();
  
  // DOM Elements
  const balanceEl = document.getElementById('balance');
  const moneyPlusEl = document.getElementById('money-plus');
  const moneyMinusEl = document.getElementById('money-minus');
  const listEl = document.getElementById('list');
  const formEl = document.getElementById('form');
  const textEl = document.getElementById('text');
  const amountEl = document.getElementById('amount');
  const categoryEl = document.getElementById('category');
  const transactionDateEl = document.getElementById('transaction-date');
  const filterTypeEl = document.getElementById('filter-type');
  const filterCategoryEl = document.getElementById('filter-category');
  const filterMonthEl = document.getElementById('filter-month');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const usernameEl = document.getElementById('username');
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const closeModal = document.querySelectorAll('.close');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginUsername = document.getElementById('login-username');
  const loginPassword = document.getElementById('login-password');
  const signupUsername = document.getElementById('signup-username');
  const signupEmail = document.getElementById('signup-email');
  const signupPassword = document.getElementById('signup-password');
  const signupConfirmPassword = document.getElementById('signup-confirm-password');
  const themeToggle = document.getElementById('theme-toggle');
  const showSignup = document.getElementById('show-signup');
  const showLogin = document.getElementById('show-login');
  const googleLogin = document.getElementById('google-login');
  const facebookLogin = document.getElementById('facebook-login');
  const githubLogin = document.getElementById('github-login');
  const googleSignup = document.getElementById('google-signup');
  const facebookSignup = document.getElementById('facebook-signup');
  const githubSignup = document.getElementById('github-signup');
  const currentMonthYearEl = document.getElementById('current-month-year');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const budgetCalendarEl = document.getElementById('budget-calendar');
  
  // Charts
  let categoryChart;
  let incomeExpenseChart;
  
  // Calendar variables
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  
  // Initialize date picker
  flatpickr(transactionDateEl, {
    dateFormat: "Y-m-d",
    defaultDate: "today",
    maxDate: "today"
  });
  
  // Check if user is logged in
  let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  let currentUser = localStorage.getItem('currentUser') || 'Guest';
  let currentUserId = localStorage.getItem('currentUserId') || null;
  
  // Update UI based on login status
  function updateLoginStatus() {
    if (isLoggedIn) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        usernameEl.textContent = currentUser;
        loadUserData();
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        usernameEl.textContent = 'Guest';
        // Clear data for guest
        transactions = [];
        updateLocalStorage();
        init();
    }
  }
  
  // Get transactions from localStorage
  function getTransactions() {
    if (!currentUserId) return [];
    
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    return userData[currentUserId]?.transactions || [];
  }
  
  // Save transactions to localStorage
  function saveTransactions() {
    if (!currentUserId) return;
    
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    userData[currentUserId] = userData[currentUserId] || {};
    userData[currentUserId].transactions = transactions;
    userData[currentUserId].username = currentUser;
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  // Load user data
  function loadUserData() {
    if (!currentUserId) return;
    
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    transactions = userData[currentUserId]?.transactions || [];
    
    // If no transactions, add sample data
    if (transactions.length === 0) {
        const sampleTransactions = [
            { 
                id: generateID(), 
                text: 'Salary', 
                amount: 3000, 
                category: 'Salary', 
                date: new Date().toISOString() 
            },
            { 
                id: generateID(), 
                text: 'Rent', 
                amount: -1000, 
                category: 'Housing', 
                date: new Date().toISOString() 
            },
            { 
                id: generateID(), 
                text: 'Groceries', 
                amount: -150, 
                category: 'Food', 
                date: new Date().toISOString() 
            },
            { 
                id: generateID(), 
                text: 'Utilities', 
                amount: -120, 
                category: 'Utilities', 
                date: new Date().toISOString() 
            },
            { 
                id: generateID(), 
                text: 'Dining out', 
                amount: -80, 
                category: 'Food', 
                date: new Date().toISOString() 
            },
            { 
                id: generateID(), 
                text: 'Freelance work', 
                amount: 500, 
                category: 'Other Income', 
                date: new Date().toISOString() 
            }
        ];
        
        transactions = sampleTransactions;
        saveTransactions();
    }
    
    init();
  }
  
  // Add transaction
  function addTransaction(e) {
    e.preventDefault();
    
    if (textEl.value.trim() === '' || amountEl.value.trim() === '' || categoryEl.value === '' || transactionDateEl.value === '') {
        alert('Please fill in all fields');
        return;
    }
    
    const transaction = {
        id: generateID(),
        text: textEl.value,
        amount: +amountEl.value,
        category: categoryEl.value,
        date: transactionDateEl.value
    };
    
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    saveTransactions();
    updateCharts();
    renderCalendar();
    
    // Reset form
    textEl.value = '';
    amountEl.value = '';
    categoryEl.value = '';
    transactionDateEl._flatpickr.setDate(new Date());
  }
  
  // Generate random ID
  function generateID() {
    return Math.floor(Math.random() * 1000000000);
  }
  
  // Add transactions to DOM list
  function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  
    item.innerHTML = `
        <div class="transaction-details">
            <span>${transaction.text}</span>
            <span class="transaction-category">${transaction.category}</span>
            <small>${new Date(transaction.date).toLocaleDateString()}</small>
        </div>
        <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="edit-btn" onclick="editTransaction(${transaction.id})">✎</button>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
    `;
  
    listEl.appendChild(item);
  }
  
  // Edit transaction
  function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
  
    textEl.value = transaction.text;
    amountEl.value = Math.abs(transaction.amount);
    categoryEl.value = transaction.category;
    transactionDateEl._flatpickr.setDate(transaction.date);
  
    removeTransaction(id);
  }
  
  // Update the balance, income and expense
  function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    
    const expense = (
        amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);
    
    balanceEl.innerText = `$${total}`;
    moneyPlusEl.innerText = `+$${income}`;
    moneyMinusEl.innerText = `-$${expense}`;
  }
  
  // Remove transaction by ID
  function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    saveTransactions();
    init();
  }
  
  // Filter transactions
  function filterTransactions() {
    const typeFilter = filterTypeEl.value;
    const categoryFilter = filterCategoryEl.value;
    const monthFilter = filterMonthEl.value;
  
    let filteredTransactions = [...transactions];
  
    if (typeFilter === 'income') {
        filteredTransactions = filteredTransactions.filter(t => t.amount > 0);
    } else if (typeFilter === 'expense') {
        filteredTransactions = filteredTransactions.filter(t => t.amount < 0);
    }
  
    if (categoryFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
    }
  
    if (monthFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === parseInt(monthFilter);
        });
    }
  
    listEl.innerHTML = '';
    filteredTransactions.forEach(addTransactionDOM);
  }
  
  // Initialize charts
  function initCharts() {
    const categoryCtx = document.getElementById('category-chart').getContext('2d');
    const incomeExpenseCtx = document.getElementById('income-expense-chart').getContext('2d');
    
    if (categoryChart) categoryChart.destroy();
    if (incomeExpenseChart) incomeExpenseChart.destroy();
    
    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#f94144', '#f3722c', '#f8961e', 
                    '#f9c74f', '#90be6d', '#43aa8b',
                    '#577590', '#277da1', '#9d4edd'
                ],
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
                        color: document.body.classList.contains('light-mode') ? '#001e29' : '#f8f9fa'
                    }
                }
            }
        }
    });
    
    incomeExpenseChart = new Chart(incomeExpenseCtx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Amount',
                data: [0, 0],
                backgroundColor: [
                    '#43aa8b',
                    '#f94144'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: document.body.classList.contains('light-mode') ? '#001e29' : '#f8f9fa'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: document.body.classList.contains('light-mode') ? '#001e29' : '#f8f9fa'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    updateCharts();
  }
  
  // Update charts with current data
  function updateCharts() {
    if (!categoryChart || !incomeExpenseChart) return;
    
    const expensesByCategory = {};
    transactions.forEach(transaction => {
        if (transaction.amount < 0) {
            if (!expensesByCategory[transaction.category]) {
                expensesByCategory[transaction.category] = 0;
            }
            expensesByCategory[transaction.category] += Math.abs(transaction.amount);
        }
    });
    
    const categoryLabels = Object.keys(expensesByCategory);
    const categoryData = Object.values(expensesByCategory);
    
    categoryChart.data.labels = categoryLabels;
    categoryChart.data.datasets[0].data = categoryData;
    categoryChart.update();
    
    const income = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);
    
    const expense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((acc, transaction) => acc + Math.abs(transaction.amount), 0);
    
    incomeExpenseChart.data.datasets[0].data = [income, expense];
    incomeExpenseChart.update();
  }
  
  // Calendar functions
  function renderCalendar() {
    // Set month and year in header
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    currentMonthYearEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Get first day of month and total days in month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Clear previous calendar
    budgetCalendarEl.innerHTML = '';
    
    // Add day headers
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-header';
        dayHeader.textContent = day;
        budgetCalendarEl.appendChild(dayHeader);
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        budgetCalendarEl.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Highlight today if it's the current month
        if (isCurrentMonth && day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Calculate transactions for this day
        const currentDate = new Date(currentYear, currentMonth, day);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        const dayTransactions = transactions.filter(t => {
            const tDate = new Date(t.date).toISOString().split('T')[0];
            return tDate === dateStr;
        });
        
        const dayIncome = dayTransactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const dayExpense = dayTransactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        // Add income and expense to day element
        if (dayIncome > 0) {
            const incomeEl = document.createElement('div');
            incomeEl.className = 'day-income';
            incomeEl.textContent = `$${dayIncome.toFixed(2)}`;
            dayElement.appendChild(incomeEl);
        }
        
        if (dayExpense > 0) {
            const expenseEl = document.createElement('div');
            expenseEl.className = 'day-expense';
            expenseEl.textContent = `-$${dayExpense.toFixed(2)}`;
            dayElement.appendChild(expenseEl);
        }
        
        budgetCalendarEl.appendChild(dayElement);
    }
  }
  
  function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
  }
  
  function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
  }
  
  // Theme toggle logic
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    updateThemeIcon();
    initCharts(); // Re-initialize charts to update colors
  });
  
  function updateThemeIcon() {
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  
  // Initialize theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
  updateThemeIcon();
  
  // Initialize app
  function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    initCharts();
    renderCalendar();
  }
  
  // Event listeners
  formEl.addEventListener('submit', addTransaction);
  filterTypeEl.addEventListener('change', filterTransactions);
  filterCategoryEl.addEventListener('change', filterTransactions);
  filterMonthEl.addEventListener('change', filterTransactions);
  prevMonthBtn.addEventListener('click', prevMonth);
  nextMonthBtn.addEventListener('click', nextMonth);
  
  // Modal controls
  loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
  });
  
  showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
  });
  
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    loginModal.style.display = 'block';
  });
  
  closeModal.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    });
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === loginModal || e.target === signupModal) {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    }
  });
  
  // Login form
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple demo login (in a real app, use proper authentication)
    if (loginUsername.value.trim() === 'demo' && loginPassword.value === 'password') {
        isLoggedIn = true;
        currentUser = 'Demo User';
        currentUserId = 'demo-user-id';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', currentUser);
        localStorage.setItem('currentUserId', currentUserId);
        updateLoginStatus();
        loginModal.style.display = 'none';
        loginUsername.value = '';
        loginPassword.value = '';
    } else {
        alert('Invalid credentials. Try username: "demo", password: "password"');
    }
  });
  
  // Signup form
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (signupPassword.value !== signupConfirmPassword.value) {
        alert('Passwords do not match');
        return;
    }
    
    // In a real app, you would create the user account here
    isLoggedIn = true;
    currentUser = signupUsername.value.trim();
    currentUserId = 'user-' + Date.now();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', currentUser);
    localStorage.setItem('currentUserId', currentUserId);
    updateLoginStatus();
    signupModal.style.display = 'none';
    
    // Reset form
    signupUsername.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
    signupConfirmPassword.value = '';
  });
  
  // Social login functions
  function handleSocialLogin(provider) {
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            isLoggedIn = true;
            currentUser = user.displayName || user.email;
            currentUserId = user.uid;
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', currentUser);
            localStorage.setItem('currentUserId', currentUserId);
            updateLoginStatus();
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
        })
        .catch((error) => {
            console.error('Social login error:', error);
            alert('Error during social login. Please try again.');
        });
  }
  
  googleLogin.addEventListener('click', () => handleSocialLogin(providerGoogle));
  facebookLogin.addEventListener('click', () => handleSocialLogin(providerFacebook));
  githubLogin.addEventListener('click', () => handleSocialLogin(providerGithub));
  googleSignup.addEventListener('click', () => handleSocialLogin(providerGoogle));
  facebookSignup.addEventListener('click', () => handleSocialLogin(providerFacebook));
  githubSignup.addEventListener('click', () => handleSocialLogin(providerGithub));
  
  // Logout
  logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        isLoggedIn = false;
        currentUser = 'Guest';
        currentUserId = null;
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('currentUser', '');
        localStorage.setItem('currentUserId', '');
        updateLoginStatus();
    });
  });
  
  // Initialize the app
  updateLoginStatus();