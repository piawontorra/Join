/**
 * Determines which logo animation to apply based on the window width.
 * If the window width is greater than or equal to 816px, the desktop logo animation is applied.
 * Otherwise, the mobile logo animation is applied.
 */
function checkLogoAnimation() {
    window.innerWidth >= 816 ? checkLogoAnimationDesktop() : checkLogoAnimationMobile();
}

/**
 * Checks whether the desktop logo animation has been played before, and applies the appropriate animation or no-animation logic.
 * This function uses `sessionStorage` to remember whether the logo animation has been shown during the current session.
 * If the logo animation has not been played yet, it adds the animation class to the desktop logo and plays the animation.
 * If the animation has already been played, it hides the logo animation and shows the not animated logo.
 */
function checkLogoAnimationDesktop() {
    const logoDesktopRef = document.getElementById('logo-animation');

    if (sessionStorage.getItem('logoAnimated') !== 'true') {
        playAnimation();
        setTimeout(() => logoDesktopRef.classList.add('logo-animation'), 200);
    } else {
        playNoAnimation();
        logoDesktopRef.classList.remove('logo-animation');
        logoDesktopRef.classList.add('d-none');
    }
}

/**
 * Checks whether the mobile logo animation has been played before, and applies the appropriate animation or no-animation logic.
 * This function uses `sessionStorage` to remember whether the logo animation has been shown during the current session or not.
 * If the logo animation has not been played yet, it adds the mobile animation class to the mobile logo and plays the animation.
 * If the animation has already been played, it hides the logo animation and shows the not animated logo.
 */
function checkLogoAnimationMobile() {
    const logoMobileRef = document.getElementById('logo-animation-mobile');
    const logoDiv = document.getElementById('logo-animation-div');

    if (sessionStorage.getItem('logoAnimated') !== 'true') {
        playAnimation();
        setTimeout(() => logoMobileRef.classList.add('logo-animation-mobile'), 200);
        changeLogoDuringAnimation();
    } else {
        playNoAnimation();
        logoMobileRef.classList.remove('logo-animation-mobile');
        logoMobileRef.classList.add('d-none');
        logoDiv.style.animation = 'none';
    }
}

/**
 * Plays the logo animation by hiding the not animated logo and setting a flag in `sessionStorage` to remember
 * that the animation was played.
 * This ensures that the animation is only played once per session.
 */
function playAnimation() {
    const noAnimationRef = document.getElementById('logo-no-animation');

    noAnimationRef.classList.add('d-none');
    sessionStorage.setItem('logoAnimated', 'true');
}

/**
 * Plays the "no animation" state by showing the not animated logo and stopping any ongoing animations.
 */
function playNoAnimation() {
    const noAnimationRef = document.getElementById('logo-no-animation');
    const contentAddRef = document.getElementById('content-add');

    noAnimationRef.classList.remove('d-none');
    contentAddRef.style.animation = 'none';
}

/**
 * Changes the logo image during the animation.
 * This function changes the source of the mobile logo after a short delay (450ms).
 * It is used to switch from the mobile version of the logo to the default desktop logo.
 */
function changeLogoDuringAnimation() {
    const logoMobileRef = document.getElementById('logo-animation-mobile');

    setTimeout(() => {
        logoMobileRef.src = './assets/img/join_logo_login.png';
    }, 450);
}

/**
 * Event listener for resizing the window.
 * This listener calls the `logoAnimation()` function whenever the window is resized.
 * The function adjusts the visibility of the imprint content based on the window width.
 * 
 * @listens resize
 */
window.addEventListener('resize', function () {
    checkLogoAnimation();
});