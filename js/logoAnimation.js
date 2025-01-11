/**
 * Determines which logo animation to apply based on the window width.
 * If the window width is greater than or equal to 816px, the desktop logo animation is applied.
 * Otherwise, the mobile logo animation is applied.
 * 
 * @returns {void} 
 */
function logoAnimation() {
    window.innerWidth >= 816 ? checkLogoAnimationDesktop() : checkLogoAnimationMobile();
}

/**
 * Applies the desktop logo animation if it hasn't already been performed in the current session.
 * It checks the session storage to determine whether the animation has been triggered.
 * If not, it adds the animation class to the desktop logo and hides the "no-animation" element.
 * Once the animation is complete, the session storage is updated to reflect that the animation has been triggered.
 * 
 * @returns {void} 
 */
function checkLogoAnimationDesktop() {
    const logoDesktopRef = document.getElementById('logo-animation');
    const noAnimationRef = document.getElementById('logo-no-animation');

    if (sessionStorage.getItem('logoAnimated') !== 'true') {
        noAnimationRef.classList.add('d-none');
        logoDesktopRef.classList.add('logo-animation');
        sessionStorage.setItem('logoAnimated', 'true');
    } else {
        logoDesktopRef.classList.remove('logo-animation');
        logoDesktopRef.classList.add('d-none');
        document.getElementById('content-add').setAttribute('style', 'animation: none');
    }
}

/**
 * Applies the mobile logo animation if it hasn't already been performed in the current session.
 * It checks the session storage to determine whether the animation has been triggered.
 * If not, it adds the animation class to the mobile logo, triggers the logo change during the animation,
 * and hides the "no-animation" element. Once the animation is complete, the session storage is updated.
 * 
 * @returns {void} 
 */
function checkLogoAnimationMobile() {
    const logoMobileRef = document.getElementById('logo-animation-mobile');
    const noAnimationRef = document.getElementById('logo-no-animation');

    if (sessionStorage.getItem('logoAnimated') !== 'true') {
        noAnimationRef.classList.add('d-none');
        logoMobileRef.classList.add('logo-animation-mobile');
        changeLogoDuringAnimation();
        sessionStorage.setItem('logoAnimated', 'true');
    } else {
        logoMobileRef.classList.remove('logo-animation-mobile');
        logoMobileRef.classList.add('d-none');
        document.getElementById('logo-animation-div').setAttribute('style', 'animation: none');
        document.getElementById('content-add').setAttribute('style', 'animation: none');
    }
}

/**
 * Changes the logo image during the animation.
 * This function changes the source of the mobile logo after a short delay (450ms).
 * It is used to switch from the mobile version of the logo to the default desktop logo.
 * 
 * @returns {void} 
 */
function changeLogoDuringAnimation() {
    const logoMobileRef = document.getElementById('logo-animation-mobile');

    setTimeout(() => {
        logoMobileRef.src = './assets/img/join_logo_login.png';
    }, 450);
}