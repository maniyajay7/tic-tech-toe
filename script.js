// DOM Elements
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('list');
const formEl = document.getElementById('form');
const textEl = document.getElementById('text');
const amountEl = document.getElementById('amount');
const categoryEl = document.getElementById('category');
const filterTypeEl = document.getElementById('filter-type');
const filterCategoryEl = document.getElementById('filter-category');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameEl = document.getElementById('username');
const loginModal = document.getElementById('login-modal');
const closeModal = document.querySelector('.close');
const loginForm = document.getElementById('login-form');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');

// New elements for registration
const registerModal = document.getElementById('register-modal');
const registerForm = document.getElementById('register-form');
const registerUsername = document.getElementById('register-username');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const showRegisterLink = document.getElementById('show-register');
const registerClose = document.getElementById('register-close');

let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let currentUser = localStorage.getItem('currentUser') || 'Guest';

function updateLoginStatus() {
    if (isLoggedIn) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        usernameEl.textContent = currentUser;
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        usernameEl.textContent = 'Guest';
    }
}

updateLoginStatus();

function getTransactionsForUser(user) {
    const allTransactions = JSON.parse(localStorage.getItem('userTransactions')) || {};
    return allTransactions[user] || [];
}

function saveTransactionsForUser(user, transactions) {
    const allTransactions = JSON.parse(localStorage.getItem('userTransactions')) || {};
    allTransactions[user] = transactions;
    localStorage.setItem('userTransactions', JSON.stringify(allTransactions));
}

let transactions = getTransactionsForUser(currentUser);

function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

function addTransaction(e) {
    e.preventDefault();
    if (!textEl.value || !amountEl.value || !categoryEl.value) return;
    const transaction = {
        id: generateID(),
        text: textEl.value,
        amount: +amountEl.value,
        category: categoryEl.value,
        date: new Date().toISOString(),
    };
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    saveTransactionsForUser(currentUser, transactions);
    updateCharts();
    formEl.reset();
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        <div class="transaction-details">
            <span>${transaction.text}</span>
            <span class="transaction-category">${transaction.category}</span>
        </div>
        <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
    `;
    listEl.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
    const income = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0).toFixed(2);
    const expense = amounts.filter(a => a < 0).reduce((a, b) => a + b, 0) * -1;
    balanceEl.innerText = `$${total}`;
    moneyPlusEl.innerText = `+$${income}`;
    moneyMinusEl.innerText = `-$${expense.toFixed(2)}`;
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactionsForUser(currentUser, transactions);
    init();
}

function filterTransactions() {
    const type = filterTypeEl.value;
    const category = filterCategoryEl.value;
    listEl.innerHTML = '';
    let filtered = [...transactions];
    if (type === 'income') filtered = filtered.filter(t => t.amount > 0);
    if (type === 'expense') filtered = filtered.filter(t => t.amount < 0);
    if (category !== 'all') filtered = filtered.filter(t => t.category === category);
    filtered.forEach(addTransactionDOM);
}

filterTypeEl.addEventListener('change', filterTransactions);
filterCategoryEl.addEventListener('change', filterTransactions);
formEl.addEventListener('submit', addTransaction);

loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
closeModal.addEventListener('click', () => loginModal.style.display = 'none');
window.addEventListener('click', e => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
});

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const input = loginUsername.value;
    const pass = loginPassword.value;

    const user = users.find(u => (u.username === input || u.email === input));

    if (user && user.password === pass) {
        isLoggedIn = true;
        currentUser = user.username;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', currentUser);
        transactions = getTransactionsForUser(currentUser);
        updateLoginStatus();
        loginModal.style.display = 'none';
        loginForm.reset();
        init();
    } else {
        alert('Wrong email, username, or password.');
    }
});

logoutBtn.addEventListener('click', () => {
    isLoggedIn = false;
    currentUser = 'Guest';
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('currentUser', '');
    transactions = [];
    updateLoginStatus();
    init();
});

showRegisterLink.addEventListener('click', () => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
});

registerClose.addEventListener('click', () => {
    registerModal.style.display = 'none';
});

registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = registerUsername.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const usernameExists = users.some(u => u.username === username);
    const emailExists = users.some(u => u.email === email);

    if (usernameExists) {
        alert('Username already exists.');
        return;
    }
    if (emailExists) {
        alert('Email already registered.');
        return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const allTransactions = JSON.parse(localStorage.getItem('userTransactions')) || {};
    allTransactions[username] = [];
    localStorage.setItem('userTransactions', JSON.stringify(allTransactions));

    alert('Registration successful! Please log in.');
    registerModal.style.display = 'none';
});

function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    initCharts();
}

function initCharts() {
    // your existing chart logic
}

function updateCharts() {
    // your existing chart update logic
}

init();
