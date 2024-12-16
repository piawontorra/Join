function initAddTask() {
    includeHTML();
}

let subtasks = [];

let selectedPriority = "Medium"; // Standardpriorität

function showUsers() {
    const usersElement = document.getElementById('users');
    const arrowDown = document.getElementById('userArrowDown');
    const arrowUp = document.getElementById('userArrowUp');
    const border = document.getElementsByClassName('add-task-assigned-to-input-field')[0];

    if (usersElement.style.display === 'none' || usersElement.style.display === '') {
        usersElement.style.display = 'block';
        arrowDown.style.display = 'none';
        arrowUp.style.display = 'block';
        if (border) {
            border.style.border = '1px solid #26ace3'; 
        }
    } else {
        usersElement.style.display = 'none';
        arrowDown.style.display = 'block';
        arrowUp.style.display = 'none';
        if (border) {
            border.style.border = '';
        }
    }
}

function showCategorys() {
    const categorysElement = document.getElementById('category')
    const arrowDown = document.getElementById('categoryArrowDown');
    const arrowUp = document.getElementById('categoryArrowUp');
    const border = document.getElementsByClassName('add-task-assigned-to-input-field')[1];

    if (categorysElement.style.display === 'none' || categorysElement.style.display === '') {
        categorysElement.style.display = 'block';
        arrowDown.style.display = 'none';
        arrowUp.style.display = 'block';
        if (border) {
            border.style.border = '1px solid #26ace3';
        }
    } else {
        categorysElement.style.display = 'none';
        arrowDown.style.display = 'block';
        arrowUp.style.display = 'none';
        if (border) {
            border.style.border = '';
        }
    }
}

function selectPriority(priority) {
    document.querySelectorAll('.prio-button').forEach(button => {
        button.classList.remove('selected');
    });

    const selectedButton = document.getElementById(priority.toLowerCase() + "Prio");
    selectedButton.classList.add('selected');

    selectedPriority = priority;

    console.log("Selected Priority:", selectedPriority);
}

window.onload = function () {
    selectPriority(selectedPriority);
};



  