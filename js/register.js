/**
 * Initializes the registration process by including HTML content and setting up the registration form.
 */
function initRegistry() {
    includeFooter();
    setupRegistrationForm();
}

/**
 * Sets up the event listener for the registration form submission.
 */
function setupRegistrationForm() {
    document.getElementById("registration-form").onsubmit = handleRegistrationFormSubmit;
}

/**
 * Handles the form submission event by validating the input.
 * If the password matches with its confirmation, a new user is added to the firebase database.
 * Afterwards the function to clear the input fields is called.
 * 
 * @async
 * @param {Event} event - The form submission event.
 */
async function handleRegistrationFormSubmit(event) {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let passwordConfirmation = document.getElementById('password-confirmation').value;

    if (checkPasswordCongruence(password, passwordConfirmation)) {
        let newUser = addNewUserObject(name, email, password);
        await addUser(newUser);
        resetRegistrationForm();
    }
}

/**
 * Checks if the password and its confirmation match.
 * 
 * @param {string} password - The password entered by the user.
 * @param {string} passwordConfirmation - The confirmation password entered by the user.
 * @returns {boolean} - Returns `true` if the passwords match, otherwise `false`.
 */
function checkPasswordCongruence(password, passwordConfirmation) {
    if (password !== passwordConfirmation) {
        document.getElementById('msg-box').innerText = "Your passwords don’t match. Please try again.";
        document.getElementById('input-password-confirmation').classList.add('red-border');
        return false;
    } else {
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
 * Resets the registration form by clearing all the input fields.
 */
function resetRegistrationForm() {
    document.getElementById('registration-form').reset();
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
 * Adds a new user to the database and updates the next user ID.
 * Displays a success message and overlays the page.
 * 
 * @async
 * @param {Object} user - The new user's data.
 * @param {string} user.name - The name of the new user.
 * @param {string} user.email - The email of the new user.
 * @param {string} user.password - The password of the new user.
 */
async function addUser(user) {
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
 * Displays a grey overlay on the page to indicate a background process.
 * Additionally, it handles the overlay state and displays a success message.
 */
function addGreyOverlay() {
    let greyOverlayRef = document.getElementById('grey-overlay');
    greyOverlayRef.classList.remove('d-none');
    renderOverlay();
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
    let greyOverlayRef = document.getElementById('grey-overlay');
    greyOverlayRef.classList.contains('d-none') ? 
        document.body.classList.remove('overlay-active') : document.body.classList.add('overlay-active');
}

/**
 * Redirects the user to the login page.
 */
function returnToLogIn() {
    window.location.href = 'index.html';
}