let skipValidation = false;
const userNameRegex = /^[A-ZÄÖÜa-zäöüß]+ [A-ZÄÖÜa-zäöüß]+$/;
const emailRegex = /^(?![_.-])([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+\.[A-Za-z0-9.-]{2,}$/;

/**
 * Initializes the registration process by setting up necessary components and configurations.
 * It includes the footer, and initializes the portrait mode.
 */
function initRegistry() {
    includeFooter();
    initPortraitMode();
}

/**
 * Handles the submission of the registration form and adds a new user.
 *
 * This asynchronous function is triggered when the registration form is submitted. It validates the user's 
 * inputs (name, email, password, etc.) using helper functions. If all validations pass, it creates a new 
 * user object and adds the user to the Firebase database.
 * 
 * @async
 * @param {Event} event - The submit event triggered by the form submission.
 */
async function addUser(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('password-confirmation').value;
    const checkboxRef = document.getElementById('accepted-policy');

    if (checkNameValidity(name) && checkEmailValidity(email) && checkPasswordCongruence(password, passwordConfirmation) && checkPasswordLength(password, passwordConfirmation) && checkPolicyAcceptance(checkboxRef)) {
        let newUser = addNewUserObject(name, email, password);
        addUserToFirebase(newUser);
    }
}

/**
 * Validates the user's name input to ensure it consists of exactly two names, each consisting of only letters, and exactly one space between them.
 * If the name is invalid, it displays an error message and adds a red border to the name input field.
 * If validation is skipped (via `skipValidation` flag), the function will return true without performing the check.
 *
 * @param {string} name - The name input provided by the user.
 * @returns {boolean} - Returns `true` if the name is valid, otherwise `false`.
 */
function checkNameValidity(name) {
    if (skipValidation) return true;
    if (!userNameRegex.test(name)) {
        document.getElementById('msg-box').innerText = "Please enter your first and last name with a single space in between.";
        document.getElementById('input-registry-name').classList.add('red-border');
        return false;
    } else {
        document.getElementById('msg-box').innerText = '';
        document.getElementById('input-registry-name').classList.remove('red-border');
        return true;
    }
}

/**
 * Validates the format of the provided email address.
 * 
 * This function uses a regular expression to check if the email address follows a valid format. 
 * If the email is invalid, it displays an error message and highlights the email input field with a red border.
 * If validation is skipped (via `skipValidation` flag), the function will return true without performing the check.
 * 
 * @param {string} email - The email address to be validated.
 * @returns {boolean} Returns `true` if the email is valid, otherwise `false`.
 */
function checkEmailValidity(email) {
    if (skipValidation) return true;
    if (!emailRegex.test(email)) {
        document.getElementById('msg-box').innerText = "Please enter a valid email address, e.g. steven.miller@gmail.com.";
        document.getElementById('input-registry-email').classList.add('red-border');
        return false;
    } else {
        document.getElementById('msg-box').innerText = '';
        document.getElementById('input-registry-email').classList.remove('red-border');
        return true;
    }
}

/**
 * Checks if the password and password confirmation fields match.
 * 
 * If the passwords don't match, a message is displayed to the user and the confirmation field is highlighted with a red border.
 * If the passwords match, any previous error message and the red border are removed.
 * If validation is skipped (via `skipValidation` flag), the function will return true without performing the check.
 * 
 * @param {string} password - The user's password entered in the password field.
 * @param {string} passwordConfirmation - The user's password entered in the password confirmation field.
 * @returns {boolean} Returns `true` if the passwords match, otherwise returns `false`.
 */
function checkPasswordCongruence(password, passwordConfirmation) {
    if (skipValidation) return true;
    if (password !== passwordConfirmation) {
        document.getElementById('msg-box').innerText = "Your passwords don’t match. Please try again.";
        document.getElementById('input-password-confirmation').classList.add('red-border');
        return false;
    } else {
        document.getElementById('msg-box').innerText = '';
        document.getElementById('input-password-confirmation').classList.remove('red-border');
        return true;
    }
}

/**
 * Checks if the password and password confirmation fields have at least 3 characters.
 * 
 * If either of the password fields is shorter than 3 characters, a message is displayed and both password fields are highlighted with a red border.
 * If the length is valid, the error message and red borders are removed.
 * If validation is skipped (via `skipValidation` flag), the function will return true without performing the check.
 * 
 * @param {string} password - The user's password entered in the password field.
 * @param {string} passwordConfirmation - The user's password entered in the password confirmation field.
 * @returns {boolean} Returns `true` if both password fields are at least 3 characters long, otherwise returns `false`.
 */
function checkPasswordLength(password, passwordConfirmation) {
    if (skipValidation) return true;
    if (password.length < 3 || passwordConfirmation.length < 3) {
        document.getElementById('msg-box').innerText = "Please enter at least 3 characters for both password fields.";
        document.getElementById('input-password').classList.add('red-border');
        document.getElementById('input-password-confirmation').classList.add('red-border');
        return false;
    } else {
        document.getElementById('msg-box').innerText = '';
        document.getElementById('input-password').classList.remove('red-border');
        document.getElementById('input-password-confirmation').classList.remove('red-border');
        return true;
    }
}

/**
 * Checks if the user has accepted the Privacy Policy by verifying the checkbox state.
 * 
 * If the checkbox is not checked, a message is displayed and the checkbox is highlighted with a red border.
 * If the checkbox is checked, any previous error message and red border are removed.
 * If validation is skipped (via `skipValidation` flag), the function will return true without performing the check.
 * 
 * @param {HTMLInputElement} checkboxRef - The reference to the checkbox input element where the user must accept the Privacy Policy.
 * @returns {boolean} Returns `true` if the Privacy Policy checkbox is checked, otherwise returns `false`.
 */
function checkPolicyAcceptance(checkboxRef) {
    const checkboxDiv = document.getElementById('checkbox-img');
    if (skipValidation) return true;

    if (!checkboxRef.checked) {
        document.getElementById('msg-box').innerText = "To proceed, accept our Privacy Policy.";
        checkboxDiv.classList.add('red-border-registry');
        return false;
    } else {
        document.getElementById('msg-box').innerText = '';
        checkboxDiv.classList.remove('red-border-registry');
        return true;
    }
}

/**
 * Creates a new user object with the provided name, email, and password.
 * 
 * @param {string} name - The name of the new user.
 * @param {string} email - The email of the new user.
 * @param {string} password - The password of the new user.
 * @returns {Object} - The new user object.
 */
function addNewUserObject(name, email, password) {
    return {
        "name": name,
        "email": email,
        "password": password
    };
}

/**
 * Adds a new user to the database and updates the next user ID.
 * Displays a success message and overlays the page.
 * 
 * @async
 * @param {Object} user - The new user's data.
 * @param {string} user.name - The name of the new user.
 * @param {string} user.email - The email of the new user.
 * @param {string} user.password - The password of the new user.
 */
async function addUserToFirebase(user) {
    let existingUsers = await loadUsers("users");
    if (!existingUsers) {
        existingUsers = {};
    }
    let newUserId = await getNextUserId();
    existingUsers[newUserId] = user;
    await putUser("users", existingUsers);
    await nextUserIdToDatabase(newUserId);
    addGreyOverlay();
    renderOverlay('You Signed Up successfully.');
}

/**
 * Retrieves the next available user ID from the database.
 * 
 * @async
 * @returns {number} - The next available user ID.
 */
async function getNextUserId() {
    let response = await fetch(`${BASE_URL}/nextUserId.json`);
    let nextUserId = await response.json();
    if (!nextUserId) {
        nextUserId = 0;
    }
    return nextUserId;
}

/**
 * Updates the next available user ID in the database.
 * 
 * @async
 * @param {number} nextUserId - The next user ID to be stored in the database.
 */
async function nextUserIdToDatabase(nextUserId) {
    await fetch(`${BASE_URL}/nextUserId.json`, {
        method: 'PUT',
        body: JSON.stringify(nextUserId + 1),
    });
}

/**
 * Updates the user data in the database.
 * 
 * @async
 * @param {string} path - The path to the user data in the database.
 * @param {Object} users - The updated users data.
 */
async function putUser(path = "", users = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(users)
    });
    return responseAsJson = await response.json();
}

/**
 * Toggles the checkbox image between checked and unchecked states.
 * Changes the checkbox image when clicked and updates the checkbox status.
 */
function toggleCheckboxImg() {
    const checkboxRef = document.getElementById('accepted-policy');
    const checkboxImgRef = document.getElementById('checkbox-img');

    if (checkboxRef.checked) {
        checkboxImgRef.src = "assets/img/unchecked.png";
        checkboxRef.checked = false;
    } else {
        checkboxImgRef.src = "assets/img/checked.png";
        checkboxRef.checked = true;
    }
}

/**
 * Displays a grey overlay on the page to indicate a background process.
 */
function addGreyOverlay() {
    const greyOverlayRef = document.getElementById('grey-overlay');

    greyOverlayRef.classList.remove('d-none');
    handleScrollbar();
}

/**
 * Renders the success message overlay and displays a confirmation message.
 * After a delay, the user is redirected to the login page.
 * 
 * @param {string} message - The success message to be displayed.
 */
function renderOverlay(message) {
    let overlayRef = document.getElementById('success-msg');
    overlayRef.innerHTML = '';

    overlayRef.innerHTML = getSuccessTemplate(message);

    setTimeout(() => {
        returnToLogIn();
    }, 700);
}

/**
 * Manages the page's scrollbar visibility (it is hidden) when the overlay is active.
 */
function handleScrollbar() {
    const greyOverlayRef = document.getElementById('grey-overlay');

    greyOverlayRef.classList.contains('d-none') ?
        document.body.classList.remove('overlay-active') : document.body.classList.add('overlay-active');
}

/**
 * Redirects the user to the login page (index.html).
 *
 * This function updates the window location to redirect the user to the login page.
 * It does not perform any additional checks or validations before the redirection.
 */
function returnToLogIn() {
    window.location.href = 'index.html';
}

/**
 * Disables form validation and clears any error states.
 *
 * This function sets a flag to skip validation and removes any error-related UI changes
 * such as red borders and msg-box messages.
 */
function noValidation() {
    skipValidation = true;

    let inputFields = document.querySelectorAll('.registration-input input');
    inputFields.forEach(input => {
        input.classList.remove('red-border');
    });

    document.getElementById('msg-box').innerText = '';
}

/**
 * Disables form validation and redirects the user to the login page.
 *
 * This function first calls `noValidation()` to disable form validation and clear any errors,
 * then redirects the user to the login page using the `returnToLogIn()` function.
 */
function returnToStart() {
    noValidation();
    returnToLogIn();
}