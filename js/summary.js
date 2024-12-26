function initSummary() {
    includeHTML();
    greetUser();
}

function greetUser() {
    let greetRef = document.getElementById('greet');
    greetRef.innerHTML = '';

    let hours = new Date().getHours();
    
    switch (true) {
        case (hours >= 1 && hours < 12):
            greetRef.innerHTML = 'Good morning';
            break;
        case (hours >= 12 && hours < 17):
            greetRef.innerHTML = 'Good afternoon';
            break;
        default:
            greetRef.innerHTML = 'Good evening';
            break;
    }
}