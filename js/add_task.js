function initAddTask() {
    includeHTML();
}

function showUsers() {
    const usersElement = document.getElementById('users');
    const arrowDown = document.getElementById('userArrowDown');
    const arrowUp = document.getElementById('userArrowUp');

    if (usersElement.style.display === 'none' || usersElement.style.display === '') {
        usersElement.style.display = 'block';
        arrowDown.style.display = 'none';
        arrowUp.style.display = 'block';
    } else {
        usersElement.style.display = 'none';
        arrowDown.style.display = 'block';
        arrowUp.style.display = 'none';
    }
}


  