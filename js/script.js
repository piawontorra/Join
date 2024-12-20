const BASE_URL = "https://join-83911-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
const msgBox = document.getElementById('msg-box');

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

window.onload = function () {
    if (!sessionStorage.getItem('logoAnimated')) {
        document.getElementById('logo-animation').classList.add('animate-logo');
        sessionStorage.setItem('logoAnimated', 'true');
    }
};

if (msg) {
    msgBox.innerHTML = msg;
}

function openRegistry() {
    window.location.href = 'register.html';
}

function changePasswordImg() {
    let passwordRef = document.getElementById('password').value;
    let passwordImgRef = document.getElementById('password-img');

    passwordRef.length > 0 ? passwordImgRef.src = "./assets/img/invisible.png" : passwordImgRef.src = "./assets/img/lock-icon.png";
}

function togglePasswordVisibility() {
    let passwordField = document.getElementById("password");
    let passwordImgRef = document.getElementById("password-img");

    switch (passwordField.type) {
        case "password":
            passwordField.type = "text";
            passwordImgRef.src = "./assets/img/visible.png";
            break;
        default:
            passwordField.type = "password";
            passwordImgRef.src = "./assets/img/invisible.png";
            break;
    }
}

function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(user => user.user.email === email.value && user.user.password === password.value);

    if (user) {
        let userName = user.user.name;
        console.log(userName);

        transferToSummary();
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
    email.value = '';
    document.getElementById('input-password').classList.remove('red-border');
    password.value = '';
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

