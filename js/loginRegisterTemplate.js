function getSuccessTemplate(message) {
    return `
        <div class="overlay-message">
            <button class="btn btn1 btn-success">${message}</button>
        </div>
    `;
}

function getLoginErrorTemplate() {
    return `
        <p>Check your email and password. Please try again.</p>
    `;
}