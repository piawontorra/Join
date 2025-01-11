function logoAnimation() {
    innerWidth >= 816 ? checkLogoAnimationDesktop() : checkLogoAnimationMobile();
}

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

function changeLogoDuringAnimation() {
    const logoMobileRef = document.getElementById('logo-animation-mobile');

    setTimeout(() => {
        logoMobileRef.src = './assets/img/join_logo_login.png';
    }, 350);
}