const BASE_URL = "https://join-83911-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
const msgBox = document.getElementById('msg-box');

// logo-animation sollte nur beim ersten Mal in der session abgespielt Werden. Funktioniert noch nicht.
window.onload = function () {
    if (!sessionStorage.getItem('logoAnimated')) {
        document.getElementById('logo-animation').classList.add('animate-logo');
        sessionStorage.setItem('logoAnimated', 'true');
    }
};

if (msg) {
    msgBox.innerHTML = msg;
}

async function initLogin() {
    includeHTML();
    let userResponse = await loadUsers("users");
    let userKeysArray = Object.keys(userResponse);
    for (let i = 0; i < userKeysArray.length; i++) {
        users.push({
            id: userKeysArray[i],
            user: userResponse[userKeysArray[i]]
        });
    }
}

async function loadUsers(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseAsJson = await response.json();
}

function openRegistry() {
    window.location.href = 'register.html';
}

function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let user = users.find(user => user.user.email === email && user.user.password === password);

    if (user) {
        transferToSummary();
        document.getElementById('login-form').reset();
        resetFields();
    }
    else {
        adaptFields();
    }
}

function adaptFields() {
    document.getElementById('input-email').classList.add('red-border');
    document.getElementById('input-password').classList.add('red-border');
    document.getElementById('msg-box').innerHTML = 'Check your email and password. Please try again.';
    document.getElementById('login-form').reset();
}

function resetFields() {
    document.getElementById('input-email').classList.remove('red-border');
    document.getElementById('input-password').classList.remove('red-border');
    document.getElementById('msg-box').innerHTML = '';
}

function guestLogIn() {
    const guestLoginData = {
        email: 'guest@test.de',
        password: '000'
    };

    loginWithGuestData(guestLoginData.email, guestLoginData.password);
}

async function loginWithGuestData(email, password) {
    let users = await loadUsers("users");
    let user = Object.values(users).find(u => u.email === email && u.password === password);

    user ? transferToSummary() : document.getElementById('msg-box').innerHTML = 'Error logging in as guest. Please try again.';
}

function transferToSummary() {
    window.location.href = 'summary.html';
}

