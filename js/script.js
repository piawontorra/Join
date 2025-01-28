const BASE_URL = "https://join-83911-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];

/**
 * Initializes the login page and performs necessary setup actions.
 * 
 * This function is responsible for initializing various aspects of the login page, 
 * including checking for animations, ensuring the page layout works correctly in portrait mode, 
 * loading user credentials from session or storage, verifying if "Remember Me" is checked, 
 * pushing user data, and toggling the logout alert if applicable.
 */
function initLogin() {
    checkLogoAnimation();
    initPortraitMode();
    loadUserCredentials();
    checkRememberMe();
    usersPush();
    toggleLogoutAlert();
}

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
function login(event) {
    event.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let user = users.find(user => user.user.email === email.value && user.user.password === password.value);

    if (user) {
        sessionStorage.setItem('loggedInUserName', user.user.name);
        rememberMeEffects();
        resetFields();
        transferToSummary();
    } else {
        adaptFields();
    }
}

/**
 * Resets the login form fields (email, password) and removes any error styling or messages.
 */
function resetFields() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

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
 * Initiates a guest login process. This function is triggered when the "Guest Log in" button is clicked.
 * At first the input fields are resetted.
 * If the "Remember Me" checkbox is checked, it will be unchecked. Then the function proceeds to log in the user as a guest.
 * The guest login is performed using predefined guest credentials (email and password).
 * 
 * @param {Event} event - The form submit event triggered when the user attempts to log in as a guest.
 */
function guestLogIn(event) {
    event.preventDefault();
    resetFields();
    uncheckCheckbox();
    noValidation();

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
 * @async
 * @returns {Promise<void>} - A promise that resolves once the guest is logged in or an error message is displayed.
 */
async function loginWithGuestData(email, password) {
    let users = await loadUsers("users");
    let guestUser = Object.values(users).find(u => u.email === email && u.password === password);
    let msgRef = document.getElementById('msg-box');

    if (guestUser) {
        sessionStorage.setItem('guestUser', 'G');
        transferToSummary();
    } else {
        msgRef.innerHTML = 'Error logging in as guest. Please try again.';
    }
}

/**
 * Unchecks the "Remember Me" checkbox if it is checked.
 * 
 */
function uncheckCheckbox() {
    const checkboxRef = document.getElementById('remember-me');

    if (checkboxRef.checked) {
        checkboxRef.checked = false;
    }
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
    const emailRef = document.getElementById('email');
    const passwordRef = document.getElementById('password');

    if (emailRef && passwordRef) {
        let forgottenPasswordRef = document.getElementById('forgotten-password');
        let forgottenPasswordConditions = users.find(user => user.user.email === email.value && user.user.password !== password.value);

        forgottenPasswordConditions ? forgottenPasswordRef.classList.remove('d-none') : forgottenPasswordRef.classList.add('d-none');
    }
}

/**
 * Redirects the user to the password reset page with the email passed as a query parameter.
 */
function setNewPassword() {
    const email = document.getElementById('email').value;
    window.location.href = `forgotten-password.html?email=${encodeURIComponent(email)}`;
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
 * Checks if a user or guest is logged in and displays their initials accordingly.
 * If a user is logged in, it displays the user's initials in the header.
 * If a guest is logged in, it displays a "G" as the guest's initial.
 * If either a user nor a guest is logged in, an icon for a unlogged user will be shown.
 */
function getLoggedInUser() {
    const currentUserName = sessionStorage.getItem('loggedInUserName');
    const guestInitialRef = sessionStorage.getItem('guestUser');

    if (currentUserName) {
        displayUserInitialsHeader(currentUserName);
    } else if (guestInitialRef) {
        displayGuestInitial(guestInitialRef);
    }
}

/**
 * Displays the initials of the logged-in user in the header.
 * It hides the unlogged icon and shows the user's initials.
 *
 * @param {string} currentUserName - The full name of the logged-in user.
 */
function displayUserInitialsHeader(currentUserName) {
    const unloggedIconRef = document.getElementById('unloggedIcon');
    const userInitialsRef = document.getElementById('userInitialsHeader');

    if (currentUserName) {
        const initials = getUserInitials(currentUserName);
        unloggedIconRef.classList.add('d-none');
        userInitialsRef.classList.remove('d-none');
        userInitialsRef.innerText = initials;
    }
}

/**
 * Extracts the initials from a full name.
 * The initials are the first letter of each name part in uppercase.
 *
 * @param {string} currentUserName - The full name of the logged-in user.
 * @returns {string} The initials of the user.
 */
function getUserInitials(currentUserName) {
    let nameParts = currentUserName.split(' ');
    let initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
}

/**
 * Displays the initials "G" for a guest user in the header.
 * It hides the unlogged icon and shows the guest initials.
 */
function displayGuestInitial() {
    const unloggedIconRef = document.getElementById('unloggedIcon');
    const guestInitialRef = document.getElementById('guestInitialHeader');

    if (unloggedIconRef && guestInitialRef) {
        unloggedIconRef.classList.add('d-none');
        guestInitialRef.classList.remove('d-none');
        guestInitialRef.innerText = "G";
    }
}

/**
 * Logs out the current user or guest user, and sets a flag indicating the user has logged out.
 * 
 * This function checks the session storage to determine whether a logged-in user or a guest user is currently active. 
 * Depending on the type of user, it calls the respective logout function:
 * - If a logged-in user is found, the function calls `logoutUser()`.
 * - If a guest user is detected, it calls `logoutGuest()`.
 * After logging out, it sets a session storage item `logoutFromApp` to `'true'` to indicate that the user has logged out.
 */
function logout() {
    const currentUserName = sessionStorage.getItem('loggedInUserName');
    const guestUserName = sessionStorage.getItem('guestUser');

    if (currentUserName) {
        logoutUser();
    } else if (guestUserName) {
        logoutGuest();
    }
    sessionStorage.setItem('logoutFromApp', 'true');
}

/**
 * Logs out the logged-in user by hiding their initials and displaying the unlogged icon.
 * Removes the 'loggedInUserName' from sessionStorage.
 */
function logoutUser() {
    const userInitialsRef = document.getElementById('userInitialsHeader');
    const unloggedIconRef = document.getElementById('unloggedIcon');

    userInitialsRef.classList.add('d-none');
    unloggedIconRef.classList.remove('d-none');
    sessionStorage.removeItem('loggedInUserName');
}

/**
 * Logs out the guest user by hiding the "G" initial and displaying the unlogged icon.
 * Removes the 'guestUser' from sessionStorage.
 */
function logoutGuest() {
    const guestInitialsRef = document.getElementById('guestInitialHeader');
    const unloggedIconRef = document.getElementById('unloggedIcon');

    guestInitialsRef.classList.add('d-none');
    unloggedIconRef.classList.remove('d-none');
    sessionStorage.removeItem('guestUser');
}

/**
 * Toggles the logout alert overlay.
 * If the session storage for `logoutFromApp` is set to `'true'`, the overlay will be displayed
 * for 2 seconds. After that the value is set to `'false'`.
 */
function toggleLogoutAlert() {
    if (sessionStorage.getItem('logoutFromApp') === 'true') {
        let overlay = document.getElementById('logOutInfo');
        overlay.classList.remove('closed');
        setTimeout(() => {
            overlay.classList.add('closed');
        }, 2000);
        sessionStorage.setItem('logoutFromApp', 'false');
    }
}