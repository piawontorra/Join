/**
 * Toggles the visibility of the "Remember me" checkbox based on whether the email 
 * and the password input fields are filled out.
 * 
 * If neither the email nor password field is empty, the "Remember me" checkbox 
 * will be displayed. Otherwise, it will be hidden.
 * 
 * This function assumes that the HTML elements for the email, password, and "Remember me" checkbox 
 * exist in the DOM.
 * 
 * @returns {void} This function does not return any value.
 */
function toggleRememberMe() {
    const emailRef = document.getElementById('email');
    const passwordRef = document.getElementById('password');

    if (emailRef && passwordRef) {
        let emailValue = emailRef.value.trim();
        let passwordValue = passwordRef.value.trim();
        let rememberRef = document.getElementById('remember-div');

        if (emailValue !== "" && passwordValue !== "") {
            rememberRef.classList.remove('d-none');
        } else {
            rememberRef.classList.add('d-none');
        }
    }
}

/**
 * Checks if the "Remember Me" checkbox has to be shown.
 * Checks if the "Remember Me" option is enabled in localStorage, and updates the checkbox state accordingly.
 * Also updates the checkbox image to reflect its state.
 */
function checkRememberMe() {
    const rememberMe = localStorage.getItem('rememberMe');
    const realCheckboxRef = document.getElementById('remember-me');
    const customizedCheckboxImg = document.getElementById('remember-checkbox-img');

    toggleRememberMe();

    if (rememberMe === 'true') {
        realCheckboxRef.checked = true;
        customizedCheckboxImg.src = 'assets/img/checked.png';
    } else {
        realCheckboxRef.checked = false;
        customizedCheckboxImg.src = 'assets/img/unchecked.png';
    }
}

/**
 * Saves the email and password to localStorage if the "Remember Me" option is selected.
 */
function rememberMeEffects() {
    const rememberMe = document.getElementById('remember-me').checked;

    if (rememberMe) {
        localStorage.setItem('email', email.value);
        localStorage.setItem('password', password.value);
    }
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