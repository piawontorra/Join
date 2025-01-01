function searchTasks() {
    const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (shouldShowAllTasks(searchQuery)) {
        showAllTasks();
        hideErrorMessage();
        return;
    }

    const taskCards = document.querySelectorAll('.task-card');
    let foundTasks = filterTasks(taskCards, searchQuery);

    toggleErrorMessage(foundTasks);
}

function shouldShowAllTasks(searchQuery) {
    return searchQuery.length < 3;
}

function showAllTasks() {
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        card.style.display = 'flex';
    });
}

function hideErrorMessage() {
    document.getElementById('errorTaskFound').style.display = 'none';
}

function filterTasks(taskCards, searchQuery) {
    let foundTasks = false;

    taskCards.forEach(card => {
        const taskTitle = getTaskTitle(card);
        const taskDescription = getTaskDescription(card);
        
        if (matchesSearchQuery(taskTitle, taskDescription, searchQuery)) {
            card.style.display = 'flex';
            foundTasks = true;
        } else {
            card.style.display = 'none';
        }
    });

    return foundTasks;
}

function getTaskTitle(card) {
    return card.querySelector('.task-title').textContent.toLowerCase();
}

function getTaskDescription(card) {
    const descriptionElement = card.querySelector('.task-description');
    return descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
}

function matchesSearchQuery(title, description, searchQuery) {
    return title.includes(searchQuery) || description.includes(searchQuery);
}

function toggleErrorMessage(foundTasks) {
    const errorMessage = document.getElementById('errorTaskFound');
    if (foundTasks) {
        errorMessage.style.display = 'none';
    } else {
        errorMessage.style.display = 'block';
    }
}
