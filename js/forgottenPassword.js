/**
 * Saves the new password of the user if it matches the confirmation.
 * 
 * This function checks the congruence of the new password and its confirmation. If they match, 
 * it saves the new password after verifying that the user with the provided email exists. 
 * After the successful update, an overlay message is displayed.
 *
 * @async
 * @function
 * @returns {Promise<void>} Returns a promise that resolves once the password update is completed.
 */
async function saveNewPassword() {
    let email = getEmailFromURL();
    let newPassword = document.getElementById('password').value;
    let confirmPassword = document.getElementById('password-confirmation').value;

    if (checkPasswordCongruence(newPassword, confirmPassword)) {
        const user = await getUserByEmail(email);

        if (user) {
            const { userId } = user;
            await updateUserPassword(userId, newPassword);
            addGreyOverlay();
            renderOverlay('Your password was resetted.');
        }
    }
}

/**
 * Retrieves the email address from the URL parameters.
 * 
 * This function extracts the email address from the URL parameters that were passed when the page was called.
 *
 * @function
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
 * @function
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
 * @function
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