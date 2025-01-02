/**
 * Generates an HTML template for a success message displayed in an overlay.
 * This template includes a button with a given success message.
 *
 * @param {string} message - The success message to display on the button.
 * @returns {string} The HTML string for the success message overlay.
 */
function getSuccessTemplate(message) {
    return `
        <div class="overlay-message">
            <button class="btn btn1 btn-success">${message}</button>
        </div>
    `;
}

/**
 * Generates an HTML template for a login error message.
 * This template contains a simple error message instructing the user to check her/his credentials.
 *
 * @returns {string} The HTML string for the login error message.
 */
function getLoginErrorTemplate() {
    return `
        <p>Check your email and password. Please try again.</p>
    `;
}