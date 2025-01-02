const BASE_URL = "https://join-83911-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
const msgBox = document.getElementById('msg-box');

function initLogin() {
    logoAnimation();
    includeHTML();
    loadUserCredentials();
    checkRememberMe();
    usersPush();
}

function logoAnimation() {
    const logo = document.getElementById('logo-animation');

    if (sessionStorage.getItem('logoAnimated') === 'true') {
        logo.classList.remove('logo-animation');
    } else {
        if (logo) {
            logo.classList.add('logo-animation');
            sessionStorage.setItem('logoAnimated', 'true');
        }
    }
};

function loadUserCredentials() {
    const rememberMe = localStorage.getItem('rememberMe');

    if (rememberMe === 'true') {
        const storedEmail = localStorage.getItem('email');
        const storedPassword = localStorage.getItem('password');

        if (storedEmail && storedPassword) {
            document.getElementById('email').value = storedEmail;
            document.getElementById('password').value = storedPassword;
        }
    }
}

function checkRememberMe() {
    const rememberMe = localStorage.getItem('rememberMe');
    const realCheckboxRef = document.getElementById('remember-me');
    const customizedCheckboxImg = document.getElementById('remember-checkbox-img');

    if (rememberMe === 'true') {
        realCheckboxRef.checked = true;
        customizedCheckboxImg.src = 'assets/img/checked.png';
    } else {
        realCheckboxRef.checked = false;
        customizedCheckboxImg.src = 'assets/img/unchecked.png';
    }
}

async function usersPush() {
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

if (msg) {
    msgBox.innerHTML = msg;
}

function openRegistry() {
    window.location.href = 'register.html';
}

function changePasswordImg(passwordRef) {
    let passwordImgRef = passwordRef.parentElement.querySelector('.password-img');
    let passwordFieldRef = passwordRef

    passwordRef.value.length > 0 ? (passwordFieldRef.type === "password" ? passwordImgRef.src = "assets/img/invisible.png" : passwordImgRef.src = "assets/img/visible.png") : passwordImgRef.src = "./assets/img/lock-icon.png";
}

function togglePasswordVisibility(passwordImgRef) {
    let passwordFieldRef = passwordImgRef.previousElementSibling;
    let passwordVisibilityRef = passwordFieldRef.type;

    switch (passwordVisibilityRef) {
        case "password":
            passwordFieldRef.type = "text";
            passwordImgRef.src = "assets/img/visible.png";
            break;
        default:
            passwordFieldRef.type = "password";
            passwordImgRef.src = "assets/img/invisible.png";
            break;
    }
}

function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = users.find(user => user.user.email === email.value && user.user.password === password.value);

    if (user) {
        sessionStorage.setItem('loggedInUserName', user.user.name);
        rememberMeEffects();
        transferToSummary();
        resetFields();
    }
    else {
        adaptFields();
    }
}

function rememberMeEffects() {
    let rememberMe = document.getElementById('remember-me').checked;
    if (rememberMe) {
        localStorage.setItem('email', email.value);
        localStorage.setItem('password', password.value);
    }
}

function resetFields() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    document.getElementById('input-email').classList.remove('red-border');
    email.value = '';
    document.getElementById('input-password').classList.remove('red-border');
    password.value = '';
    document.getElementById('msg-box').innerHTML = '';
}

function adaptFields() {
    document.getElementById('input-email').classList.add('red-border');
    document.getElementById('input-password').classList.add('red-border');
    document.getElementById('msg-box').innerHTML = getLoginErrorTemplate();
    forgotPasswordQuote();
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

function forgotPasswordQuote() {
    let forgottenPasswordRef = document.getElementById('forgotten-password');
    let forgottenPasswordConditions = users.find(user => user.user.email === email.value && user.user.password !== password.value);

    if (forgottenPasswordConditions) {
        forgottenPasswordRef.classList.remove('d-none');
    } else {
        forgottenPasswordRef.classList.add('d-none');
    }
}

function setNewPassword() {
    let email = document.getElementById('email').value;
    window.location.href = `forgotten-password.html?email=${encodeURIComponent(email)}`;
}

function toggleRememberCheckboxImg() {
    const realCheckboxRef = document.getElementById('remember-me');
    const customizedCheckboxImg = document.getElementById('remember-checkbox-img');

    realCheckboxRef.checked = !realCheckboxRef.checked;

    if (realCheckboxRef.checked) {
        customizedCheckboxImg.src = 'assets/img/checked.png';
    } else {
        customizedCheckboxImg.src = 'assets/img/unchecked.png';
    }

    localStorage.setItem('rememberMe', realCheckboxRef.checked);
}

function toggleUserMenu() {
    const userMenuRef = document.getElementById('userMenu');
    userMenuRef.classList.toggle('d-none');
}

function getCurrentUserName() {
    const currentUserName = sessionStorage.getItem('loggedInUserName');

    if (currentUserName) {
        displayUserIcon(currentUserName);
    }
}

function getUserInitials(currentUserName) {
    const nameParts = currentUserName.split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
}

function displayUserIcon(currentUserName) {
    const guestIconRef = document.getElementById('guestIcon');
    const userInitialsRef = document.getElementById('userInitialsHeader');

    if (currentUserName) {
        const initials = getUserInitials(currentUserName);
        guestIconRef.classList.add('d-none');
        userInitialsRef.classList.remove('d-none');
        userInitialsRef.textContent = initials;
    }
}

function logout() {
    const currentUserName = sessionStorage.getItem('loggedInUserName');
    const userInitialsRef = document.getElementById('userInitialsHeader');
    const guestIconRef = document.getElementById('guestIcon');

    if (currentUserName) {
        userInitialsRef.classList.add('d-none');
        guestIconRef.classList.remove('d-none');
        sessionStorage.removeItem('loggedInUserName');
        sessionStorage.setItem('logoAnimated', false);
    }

    window.location.href = 'index.html';
}

function switchTab(event, tabName) {
    window.location.href = `${tabName}.html`;
}

function markCurrentTab() {
    const currentPage = window.location.pathname.split('/').pop();
    const tabName = currentPage.split('.')[0];

    const tabs = document.getElementsByClassName('menu-component');
    Array.from(tabs).forEach(tab => {
        tab.classList.remove('active');
    });

    const activeTabBtn = document.getElementById(tabName);
    if (activeTabBtn) {
        activeTabBtn.classList.add('active');
    }
}
