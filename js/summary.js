function initSummary() {
    includeHTML();
    greetUser();
}

function greetUser() {
    let greetingTextRef = document.getElementById('greeting-text');
    let userNameRef = document.getElementById('user-name');
    let hours = new Date().getHours();
    let userName = sessionStorage.getItem('loggedInUserName');
    let greeting = getGreetingBasedOnTime(hours);
    greetingTextRef.innerHTML = '';
    userNameRef.innerHTML = '';
    
    userName ? greetingTextRef.innerHTML = greeting + ', ' : greetingTextRef.innerHTML = greeting;

    if (userName) {
        userNameRef.innerHTML = userName;
    }
}

function getGreetingBasedOnTime(hours) {
    if (hours >= 1 && hours < 12) {
        return 'Good morning';
    } else if (hours >= 12 && hours < 17) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
}