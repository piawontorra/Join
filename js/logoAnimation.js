/**
 * Manages the logo animation, ensuring it only plays once per session.
 * The animation is played only if the logo has not been animated during the current session.
 * Once the animation plays, it is marked in the sessionStorage to prevent it from being played again during the same session.
 *
 * @function
 * @returns {void} 
 */
function logoAnimation() {
    const logo = document.getElementById('logo-animation');

    if (sessionStorage.getItem('logoAnimated') !== 'true') {
        setLogoBasedOnScreenSize();
        checkAndRemoveLogoAnimation(logo);
        addLogoAnimation(logo);
        triggerLogoAnimationWithDelay(logo);
        resetLogoForMobileDevices(logo);
        sessionStorage.setItem('logoAnimated', 'true');
    } else {
        checkAndRemoveLogoAnimation(logo);
    }
}

/**
 * Sets the logo image source based on the screen size.
 * This function switches between two logo sources: one for mobile screens (<= 616px)
 * and the other for larger screens. It updates the `src` attribute of the logo image accordingly.
 * 
 * @function
 * @returns {void} 
 */
function setLogoBasedOnScreenSize() {
    const logo = document.getElementById('logo-animation');

    window.innerWidth <= 616 ? logo.src = "./assets/img/mobile-logo.png" : logo.src = "./assets/img/join_logo_login.png";
}

/**
 * Checks if the logo has already been animated and removes the animation if it has.
 * If the logo hasn't been animated yet, it adds the animation class and stores the animation state in sessionStorage.
 * 
 * @param {HTMLElement} logo - The logo DOM element to check and animate.
 * @returns {void} 
 */
function checkAndRemoveLogoAnimation(logo) {
    if (sessionStorage.getItem('logoAnimated') === 'true') {
        logo.classList.remove('logo-animation');
    } else {
        if (logo) {
            logo.classList.add('logo-animation');
            sessionStorage.setItem('logoAnimated', 'true');
        }
    }
}

/**
 * Adds the logo animation class to the logo element and stores the animation state.
 * This function triggers the animation for the logo.
 * 
 * @param {HTMLElement} logo - The logo DOM element to animate.
 * @returns {void} 
 */
function addLogoAnimation(logo) {
    if (logo) {
        logo.classList.add('logo-animation');
        sessionStorage.setItem('logoAnimated', 'true');
    }
}

/**
 * Triggers the logo animation with a 200ms delay.
 * After the delay, it adds the animation class to the logo for small screen sizes (<= 616px).
 * 
 * @param {HTMLElement} logo - The logo DOM element to animate.
 * @returns {void} 
 */
function triggerLogoAnimationWithDelay(logo) {
    setTimeout(() => {
        if (window.innerWidth <= 616) {
            logo.classList.add('logo-animation');
        }
    }, 200);
}

/**
 * Resets the logo to its default image for mobile devices (<= 616px) after the animation.
 * This function ensures that after the animation, the logo source is reset to the default logo for mobile users.
 * 
 * @param {HTMLElement} logo - The logo DOM element to reset.
 * @returns {void} 
 */
function resetLogoForMobileDevices(logo) {
    setTimeout(() => {
        if (window.innerWidth <= 616) {
            logo.src = './assets/img/join_logo_login.png';
        }
    }, 400);
}