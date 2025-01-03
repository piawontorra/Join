const BASE_URL = "https://join-83911-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
const msgBox = document.getElementById('msg-box');

/**
 * Initializes the login page by calling necessary functions for logo animation, user credentials loading, 
 * remembering login state, and fetching user data.
 */
function initLogin() {
    logoAnimation();
    includeHTML();
    loadUserCredentials();
    checkRememberMe();
    usersPush();
}

/**
 * Handles the animation of the logo on the login page. If the logo has been animated previously, it removes the animation class.
 * Otherwise, it applies the animation and stores the animation state in sessionStorage.
 */
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

/**
 * Loads the stored user credentials from localStorage if the "Remember Me" option is checked.
 */
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

/**
 * Checks if the "Remember Me" option is enabled in localStorage, and updates the checkbox state accordingly.
 * Also updates the checkbox image to reflect its state.
 */
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

/**
 * Pushes the user data from the Firebase database into the local "users" array.
 * It fetches the data asynchronously and processes each user's key (= id) and information (= name, email, password).
 */
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

/**
 * Fetches the user data from the Firebase database.
 * 
 * @param {string} path - The path in the database to fetch the user data from.
 * @returns {Object} The response data from the database, parsed as JSON.
 */
async function loadUsers(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseAsJson = await response.json();
}

/**
 * If there is a message in the URL query parameters, it is displayed in the message box element.
 */
if (msg) {
    msgBox.innerHTML = msg;
}

/**
 * Navigates the user to the registration page.
 */
function openRegistry() {
    window.location.href = 'register.html';
}

/**
 * Changes the visibility of the password input field's associated icon based on the input field's content.
 * When a password is entered, the lock icon disappears and a cancelled eye icon appears, which can be toggled.
 * The cancelled eye icon (invisible password) can be toggled to an eye icon (visible password).
 * 
 * @param {HTMLElement} passwordRef - The password input field element.
 */
function changePasswordImg(passwordRef) {
    let passwordImgRef = passwordRef.parentElement.querySelector('.password-img');
    let passwordFieldRef = passwordRef;

    passwordRef.value.length > 0 ? (passwordFieldRef.type === "password" ? passwordImgRef.src = "assets/img/invisible.png" : passwordImgRef.src = "assets/img/visible.png") : passwordImgRef.src = "./assets/img/lock-icon.png";
}

/**
 * Toggles the visibility of the password field when the visibility icon is clicked.
 * The password can be toggled between plain text and a masked password.
 *
 * @param {HTMLElement} passwordImgRef - The password visibility icon element.
 */
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

/**
 * Handles the login process by checking the provided email and password against the stored users.
 * If a match is found, the user is logged in, the input fields are cleared and the user is redirected to the summary page.
 * If no match is found, the adaptFields() function is called, which signalize an error.
 * 
 * @param {string} email - The entered email address.
 * @param {string} password - The entered password.
 */
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

/**
 * Saves the email and password to localStorage if the "Remember Me" option is selected.
 */
function rememberMeEffects() {
    let rememberMe = document.getElementById('remember-me').checked;
    if (rememberMe) {
        localStorage.setItem('email', email.value);
        localStorage.setItem('password', password.value);
    }
}

/**
 * Resets the login form fields (email, password) and removes any error styling or messages.
 */
function resetFields() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    document.getElementById('input-email').classList.remove('red-border');
    email.value = '';
    document.getElementById('input-password').classList.remove('red-border');
    password.value = '';
    document.getElementById('msg-box').innerHTML = '';
}

/**
 * Adds error styling to the email and password fields and displays an error message.
 * Also shows the option for resetting the password if only the password input was incorrect.
 */
function adaptFields() {
    document.getElementById('input-email').classList.add('red-border');
    document.getElementById('input-password').classList.add('red-border');
    document.getElementById('msg-box').innerHTML = getLoginErrorTemplate();
    forgotPasswordQuote();
}

/**
 * Simulates a guest login by using predefined guest credentials.
 */
function guestLogIn() {
    const guestLoginData = {
        email: 'guest@test.de',
        password: '000'
    };

    loginWithGuestData(guestLoginData.email, guestLoginData.password);
}

/**
 * Logs the user in with guest credentials and transfers to the summary page.
 * If the credentials are incorrect, an error message is displayed.
 *
 * @param {string} email - The email address of the guest.
 * @param {string} password - The password of the guest.
 */
async function loginWithGuestData(email, password) {
    let users = await loadUsers("users");
    let user = Object.values(users).find(u => u.email === email && u.password === password);

    user ? transferToSummary() : document.getElementById('msg-box').innerHTML = 'Error logging in as guest. Please try again.';
}

/**
 * Redirects the user to the summary page after successful login.
 */
function transferToSummary() {
    window.location.href = 'summary.html';
}

/**
 * Displays or hides the "Forgotten Password" link based on whether the provided email exists and the password is incorrect.
 */
function forgotPasswordQuote() {
    let forgottenPasswordRef = document.getElementById('forgotten-password');
    let forgottenPasswordConditions = users.find(user => user.user.email === email.value && user.user.password !== password.value);

    if (forgottenPasswordConditions) {
        forgottenPasswordRef.classList.remove('d-none');
    } else {
        forgottenPasswordRef.classList.add('d-none');
    }
}

/**
 * Redirects the user to the password reset page with the email passed as a query parameter.
 */
function setNewPassword() {
    let email = document.getElementById('email').value;
    window.location.href = `forgotten-password.html?email=${encodeURIComponent(email)}`;
}

/**
 * Toggles the "Remember Me" checkbox state and updates the associated image. 
 * It also saves the state to localStorage.
 */
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

/**
 * Toggles the visibility of the user menu by adding or removing the 'menu-closed' class.
 * This controls whether the user menu is displayed or hidden.
 */
function toggleUserMenu() {
    const userMenuRef = document.getElementById('userMenu');
    userMenuRef.classList.toggle('menu-closed');
}

/**
 * Retrieves the current logged-in user's name from sessionStorage and displays the appropriate user icon 
 * or guest initials in the header. If a user is logged in, their initials are shown; otherwise, a general guest initial
 * ("G" for "guest") is displayed (look at displayGuestInitial()).
 */
function getCurrentUserName() {
    const currentUserName = sessionStorage.getItem('loggedInUserName');
    const unloggedIconRef = document.getElementById('unloggedIcon');
    const guestInitialsRef = document.getElementById('guestInitialsHeader');

    if (unloggedIconRef && guestInitialsRef) {
        currentUserName ? displayUserInitialsHeader(currentUserName) : displayGuestInitial();
    }
}

/**
 * Displays the logged-in user's initials in the header. The unlogged icon is hidden, 
 * and the user's initials are displayed.
 *
 * @param {string} currentUserName - The name of the currently logged-in user.
 */
function displayUserInitialsHeader(currentUserName) {
    const unloggedIconRef = document.getElementById('unloggedIcon');
    const userInitialsRef = document.getElementById('userInitialsHeader');

    if (currentUserName) {
        const initials = getUserInitials(currentUserName);
        unloggedIconRef.classList.add('d-none');
        userInitialsRef.classList.remove('d-none');
        userInitialsRef.textContent = initials;
    }
}

/**
 * Extracts and returns the initials from the user's full name. The initials are derived 
 * from the first character of each part of the user's name.
 *
 * @param {string} currentUserName - The full name of the logged-in user.
 * @returns {string} A string of the user's initials (e.g., 'FB' for "Frodo Beutlin").
 */
function getUserInitials(currentUserName) {
    const nameParts = currentUserName.split(' ');
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
}

/**
 * Displays the guest initials ("G") in the header. The unlogged icon is hidden, and the guest initials are shown.
 */
function displayGuestInitial() {
    const unloggedIconRef = document.getElementById('unloggedIcon');
    const guestInitialsRef = document.getElementById('guestInitialsHeader');

    if (unloggedIconRef && guestInitialsRef) {
        unloggedIconRef.classList.add('d-none');
        guestInitialsRef.classList.remove('d-none');
        guestInitialsRef.textContent = "G";
    }
}

/**
 * Logs the user out by removing the logged-in user's name from sessionStorage, hiding user initials, 
 * and displaying the unlogged icon. If the user is logged out, the guest icon is displayed. 
 * The page is then redirected to the login (index.html).
 */
function logout() {
    const currentUserName = sessionStorage.getItem('loggedInUserName');
    const userInitialsRef = document.getElementById('userInitialsHeader');
    const guestInitialsRef = document.getElementById('guestInitialsHeader');
    const unloggedIconRef = document.getElementById('unloggedIcon');

    if (currentUserName) {
        userInitialsRef.classList.add('d-none');
        unloggedIconRef.classList.remove('d-none');
        sessionStorage.removeItem('loggedInUserName');
        sessionStorage.setItem('logoAnimated', false);
    } else {
        guestInitialsRef.classList.add('d-none');
        unloggedIconRef.classList.remove('d-none');
    }
    window.location.href = 'index.html';
}

/**
 * Switches the current view to the specified tab by changing the window location.
 *
 * @param {string} tabName - The name of the tab to switch to (corresponds to the name of the .html file).
 */
function switchTab(tabName) {
    window.location.href = `${tabName}.html`;
}

/**
 * Marks the currently active tab in the sidebar by adding the 'active' class
 * to the button of the current tab.
 */
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