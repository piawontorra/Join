/**
 * Searches for tasks based on the input query in the desktop view.
 */
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

/**
 * Searches for tasks based on the input query in the mobile view.
 */
function searchTasksMobile() {
    const searchQuery = document.getElementById('searchInputMobile').value.trim().toLowerCase();
    
    if (shouldShowAllTasks(searchQuery)) {
        showAllTasks();
        hideErrorMessageMobile();
        return;
    }

    const taskCards = document.querySelectorAll('.task-card');
    let foundTasks = filterTasks(taskCards, searchQuery);

    toggleErrorMessageMobile(foundTasks);
}

/**
 * Determines whether all tasks should be shown based on the search query.
 *
 * @param {string} searchQuery - The search query entered by the user.
 * @returns {boolean} True if the query is too short to filter tasks, false otherwise.
 */
function shouldShowAllTasks(searchQuery) {
    return searchQuery.length < 3;
}

/**
 * Displays all task cards.
 */
function showAllTasks() {
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        card.style.display = 'flex';
    });
}

/**
 * Hides the error message in the desktop view.
 */
function hideErrorMessage() {
    document.getElementById('errorTaskFound').style.display = 'none';
}

/**
 * Hides the error message in the mobile view.
 */
function hideErrorMessageMobile() {
    document.getElementById('errorTaskFoundMobile').style.display = 'none';
}

/**
 * Filters task cards based on the search query.
 *
 * @param {NodeList} taskCards - A list of task card elements.
 * @param {string} searchQuery - The search query entered by the user.
 * @returns {boolean} True if any tasks matched the query, false otherwise.
 */
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

/**
 * Retrieves the title text of a task card.
 *
 * @param {Element} card - The task card element.
 * @returns {string} The title text of the task card in lowercase.
 */
function getTaskTitle(card) {
    return card.querySelector('.task-title').textContent.toLowerCase();
}

/**
 * Retrieves the description text of a task card.
 *
 * @param {Element} card - The task card element.
 * @returns {string} The description text of the task card in lowercase, or an empty string if not found.
 */
function getTaskDescription(card) {
    const descriptionElement = card.querySelector('.task-description');
    return descriptionElement ? descriptionElement.textContent.toLowerCase() : '';
}

/**
 * Checks whether the task title or description matches the search query.
 *
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} searchQuery - The search query entered by the user.
 * @returns {boolean} True if the title or description contains the search query, false otherwise.
 */
function matchesSearchQuery(title, description, searchQuery) {
    return title.includes(searchQuery) || description.includes(searchQuery);
}

/**
 * Toggles the visibility of the error message in the desktop view based on whether tasks were found.
 *
 * @param {boolean} foundTasks - Whether any tasks matched the search query.
 */
function toggleErrorMessage(foundTasks) {
    const errorMessage = document.getElementById('errorTaskFound');
    errorMessage.style.display = foundTasks ? 'none' : 'block';
}

/**
 * Toggles the visibility of the error message in the mobile view based on whether tasks were found.
 *
 * @param {boolean} foundTasks - Whether any tasks matched the search query.
 */
function toggleErrorMessageMobile(foundTasks) {
    const errorMessage = document.getElementById('errorTaskFoundMobile');
    errorMessage.style.display = foundTasks ? 'none' : 'block';
}
