/**
 * Initializes the reset password process by setting up necessary components and configurations.
 * It includes the footer, and initializes the portrait mode.
 */
function initResetPassword() {
    includeFooter();
    initPortraitMode();
}

/**
 * Saves the new password for a user after validating the password fields.
 * 
 * This function is triggered when the user submits the reset password form. It prevents the default form submission,
 * validates the new password and password confirmation, and updates the user's password in the database.
 * If the update is successful, a confirmation message is displayed.
 *
 * @param {Event} event - The form submit event triggered when the user submits the reset password form.
 * @async
 * @returns {Promise<void>} - A promise that resolves once the password is successfully updated and the confirmation is shown.
 */
async function saveNewPassword(event) {
    event.preventDefault();
    let email = getEmailFromURL();
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('password-confirmation').value;

    if (checkPasswordCongruence(password, passwordConfirmation) && checkPasswordLength(password, passwordConfirmation)) {
        const user = await getUserByEmail(email);

        if (user) {
            const { userId } = user;
            let newPassword = password;
            await updateUserPassword(userId, newPassword);
            confirmPasswordReset();
        }
    }
}

/**
 * Retrieves the email address from the URL parameters.
 * 
 * This function extracts the email address from the URL parameters that were passed when the page was called.
 *
 * @returns {string|null} Returns the email address from the URL, or null if no email is present in the URL.
 */
function getEmailFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('email');
}

/**
 * Fetches the user by his/her email address.
 * 
 * This function searches for a user in the database by the provided email address.
 * If the user is found, it returns the user data along with the user ID.
 * 
 * @async
 * @param {string} email - The email address of the user which was retrieved from the URL parameters in getEmailFromURL().
 * @returns {Promise<{userId: string, user: Object}|null>} Returns an object containing the user ID and the user data, 
 *          or null if no user with this email address is found.
 */
async function getUserByEmail(email) {
    const users = await loadUsers("users");
    const userId = Object.keys(users).find(userId => users[userId].email === email);
    return userId ? { userId, user: users[userId] } : null;
}

/**
 * Updates the password of a user in the user database (firebase).
 * 
 * This function takes the user ID and new password, and updates the password of the user in the database.
 * 
 * @async
 * @param {string} userId - The user ID of the user whose password needs to be updated.
 * @param {string} newPassword - The new password to be set for the user.
 * @returns {Promise<void>} Returns a promise that resolves once the password update is complete.
 */
async function updateUserPassword(userId, newPassword) {
    const users = await loadUsers("users");
    const user = users[userId];

    if (user) {
        const updatedData = { email: user.email, name: user.name, password: newPassword };

        await fetch(`${BASE_URL}users/${userId}.json`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

/**
 * Clears the password input fields and the message box, removing any error styling.
 * This is used when the validation fails or when the user is redirected back to the page.
 * It removes the red border from the password fields and clears any error messages.
 */
function clearFields() {
    document.getElementById('input-password').classList.remove('red-border');
    document.getElementById('input-password-confirmation').classList.remove('red-border');
    document.getElementById('msg-box').innerHTML = '';
}

/**
 * Resets the password reset form and provides user feedback upon successful password reset.
 * 
 * This function performs the following actions:
 * - Resets the login form, clearing any user input.
 * - Removes the red border from the password confirmation input field (if present).
 * - Clears any messages displayed in the message box.
 * - Adds a grey overlay to the screen to provide visual feedback.
 * - Displays a message overlay to inform the user that the password has been reset.
 */
function confirmPasswordReset() {
    const passwordConfirmationInput = document.getElementById('input-password-confirmation');

    document.getElementById('login-form').reset();

    if (passwordConfirmationInput.classList.contains('red-border')) {
        passwordConfirmationInput.classList.remove('red-border');
    }
    document.getElementById('msg-box').innerHTML = '';
    addGreyOverlay();
    renderOverlay('Your password was resetted.');
}