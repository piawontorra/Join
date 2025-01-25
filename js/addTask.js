let tasks = [];
let subtasks = [];
let contacts = {};
let assignedTo = [];
let selectedTaskStatus = 'todo';
let selectedCategory = "Select task category";
let selectedPriority = "Medium";
let isUsersOpen = false;

/**
 * Executes when the page is loaded. Calls `selectPriority` to display the selected priority,
 * and starts the `newTask` function.
 */
window.onload = function () {
    selectPriority(selectedPriority);
    newTask();
};

/**
 * Initializes the "Add Task" page by inserting HTML content and loading categories.
 * 
 * @async
 */
async function initAddTask() {
    includeHTML();
    initializeCategory();
    await loadData();
    initPortraitMode();
}

/**
 * Loads tasks from the specified URL and returns them as JSON.
 *
 * @async
 * @param {string} [path=""] - The path to load the tasks from.
 * @returns {Promise<Object>} A JSON object containing the tasks.
 */
async function loadTasks(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseAsJson = await response.json();

    return responseAsJson || {};
}

/**
 * Retrieves the next card ID, updates the card ID, and returns it.
 *
 * @async
 * @returns {Promise<number>} The next card ID.
 * @throws {Error} If an error occurs while retrieving or updating the card ID.
 */
async function getCardID() {
    try {
        const nextCardID = await fetchNextCardID();
        await updateNextCardID(nextCardID + 1);
        return nextCardID;
    } catch (error) {
        handleCardIDError(error);
        throw error;
    }
}

/**
 * Retrieves the next card ID from the data source.
 *
 * @async
 * @returns {Promise<number>} The next card ID.
 */
async function fetchNextCardID() {
    const response = await fetch(`${BASE_URL}/nextCardID.json`);
    const nextCardID = await response.json();
    return nextCardID === null ? 1 : nextCardID;
}

/**
 * Updates the `nextCardID` in the data source.
 *
 * @async
 * @param {number} newCardID - The new card ID.
 */
async function updateNextCardID(newCardID) {
    await fetch(`${BASE_URL}/nextCardID.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCardID),
    });
}

/**
 * Error handling for retrieving or updating the card ID.
 * Logs the error.
 *
 * @param {Error} error - The error that occurred.
 */
function handleCardIDError(error) {
    console.error("Error retrieving or updating the nextCardID:", error);
}

/**
 * This function is executed when a new task is created. It validates the inputs
 * and creates the task if all inputs are valid.
 *
 * @async
 * @param {Event} event - The event triggered when the user creates a new task.
 */
async function newTask(event) {
    event.preventDefault();
    if (!validateTitle() || !validateDueDate() || !validateCategory()) {
        return;
    }
    try {
        const newTask = await createNewTask();
        addTask(newTask);
        showTaskAddedToBoard();
        resetErrorState();
        redirectToBoard();
    } catch (error) {
        console.error("Error creating task:", error);
    }
}

/**
 * Creates a new task with a unique ID and the entered details.
 *
 * @async
 * @returns {Promise<Object>} The created task object.
 */
async function createNewTask() {
    const cardID = await getCardID();
    const taskDetails = getTaskDetails();
    return { ...taskDetails, id: cardID };
}

/**
 * Returns the details of the task to be created.
 *
 * @returns {Object} The task details.
 */
function getTaskDetails() {
    return {
        title: getTitle(),
        description: getDescription(),
        assignedTo: getAssignedId(),
        dueDate: getDueDate(),
        priority: getPriority(),
        category: selectedCategory,
        subtasks: subtasks,
        status: selectedTaskStatus,
    };
}

/**
 * Returns the title of the task.
 *
 * @returns {string} The title of the task.
 */
function getTitle() {
    return document.getElementById('inputTitle').value;
}

/**
 * Returns the description of the task.
 *
 * @returns {string} The description of the task.
 */
function getDescription() {
    return document.getElementById('inputDescription').value;
}

/**
 * Returns the list of user IDs assigned to the task.
 *
 * @returns {Array<string>} An array of user IDs.
 */
function getAssignedId() {
    return assignedTo;
}

/**
 * Returns the due date of the task.
 *
 * @returns {string} The due date of the task.
 */
function getDueDate() {
    return document.getElementById('inputDueDate').value;
}

/**
 * Returns the priority of the task.
 *
 * @returns {string} The priority of the task.
 */
function getPriority() {
    return selectedPriority || 'Medium';
}

/**
 * Redirects the user to the board after a short delay
 * and resets the task creation area.
 */
function redirectToBoard() {
    setTimeout(function () {
        clearAddTask();
        location.href = 'board.html';
    }, 3000);
}

/**
 * Adds the new task to the data source.
 *
 * @async
 * @param {Object} task - The task object to be added.
 */
async function addTask(task) {
    let existingTasks = await loadTasks("tasks");
    let newTaskId = task.id;

    existingTasks[newTaskId] = task;

    await putTask("tasks", existingTasks);
}

/**
 * Saves the tasks in the data source.
 *
 * @async
 * @param {string} [path=""] - The path to save the tasks to.
 * @param {Object} [tasks={}] - The tasks object to be saved.
 * @returns {Promise<Object>} The response from the API.
 */
async function putTask(path = "", tasks = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks)
    });
    return responseAsJson = await response.json();
}

/**
 * Loads the contact data and displays it in the UI.
 *
 * @async
 */
async function loadData() {
    try {
        let response = await fetch(BASE_URL + "/contacts.json");
        let responseToJson = await response.json();

        contacts = responseToJson;

        renderUsers(contacts);
        showAssignedUsers();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

/**
 * Sets the priority for the task and marks the corresponding button as selected.
 * 
 * @param {string} priority - The priority of the task. Possible values: "Low", "Medium", "High".
 */
function selectPriority(priority) {
    document.querySelectorAll('.prio-button').forEach(button => {
        button.classList.remove('selected');
    });

    const selectedButton = document.getElementById(priority.toLowerCase() + "Prio");
    selectedButton.classList.add('selected');

    selectedPriority = priority;
}

/**
 * Initializes the display of the selected category.
 */
function initializeCategory() {
    const selectedCategoryElement = document.getElementById('selectedCategory');
    selectedCategoryElement.textContent = selectedCategory;
}

/**
 * Toggles the visibility of the category list and changes the arrow direction.
 */
function showCategorys() {
    const categorysElement = document.getElementById('category');
    const arrowDown = document.getElementById('categoryArrowDown');
    const arrowUp = document.getElementById('categoryArrowUp');
    const border = document.getElementsByClassName('add-task-category-input-field')[0];

    if (categorysElement.style.display === 'none' || categorysElement.style.display === '') {
        showCategorysList(categorysElement, arrowDown, arrowUp, border);
    } else {
        hideCategorysList(categorysElement, arrowDown, arrowUp, border);
    }
}

/**
 * Displays the category list and changes the arrows.
 * 
 * @param {HTMLElement} categorysElement - The DOM element for the category list.
 * @param {HTMLElement} arrowDown - The down arrow element.
 * @param {HTMLElement} arrowUp - The up arrow element.
 * @param {HTMLElement} border - The input field border.
 */
function showCategorysList(categorysElement, arrowDown, arrowUp, border) {
    categorysElement.style.display = 'block';
    arrowDown.style.display = 'none';
    arrowUp.style.display = 'block';
    if (border) {
        border.style.border = '1px solid #26ace3';
    }
}

/**
 * Hides the category list and changes the arrows.
 * 
 * @param {HTMLElement} categorysElement - The DOM element for the category list.
 * @param {HTMLElement} arrowDown - The down arrow element.
 * @param {HTMLElement} arrowUp - The up arrow element.
 * @param {HTMLElement} border - The input field border.
 */
function hideCategorysList(categorysElement, arrowDown, arrowUp, border) {
    categorysElement.style.display = 'none';
    arrowDown.style.display = 'block';
    arrowUp.style.display = 'none';
    if (border) {
        border.style.border = '';
    }
}

/**
 * Selects a category and displays it in the input field.
 * 
 * @param {Event} event - The event triggered by clicking on a category.
 * @param {string} category - The selected category.
 */
function selectCategory(event, category) {
    event.stopPropagation();
    selectedCategory = category;

    const border = document.getElementsByClassName('add-task-category-input-field')[0];
    border.style.border = '';
    const selectedCategoryElement = document.getElementById('selectedCategory');
    selectedCategoryElement.textContent = selectedCategory;
    const categorysElement = document.getElementById('category');
    categorysElement.style.display = 'none';
    const arrowDown = document.getElementById('categoryArrowDown');
    const arrowUp = document.getElementById('categoryArrowUp');
    arrowDown.style.display = 'block';
    arrowUp.style.display = 'none';
}

/**
 * Closes the category dropdown if a click occurs outside of it.
 */
document.addEventListener('click', (event) => {
    const categoryDropdown = document.getElementById('category');
    const categoryField = document.getElementsByClassName('add-task-category-input-field')[0];

    if (categoryDropdown.style.display === 'block' && !categoryField.contains(event.target)) {
        hideCategorysList(
            categoryDropdown,
            document.getElementById('categoryArrowDown'),
            document.getElementById('categoryArrowUp'),
            categoryField
        );
    }
});

/**
 * Displays a notification that the task has been successfully added to the board.
 */
function showTaskAddedToBoard() {
    let taskAddedToBoard = document.getElementById('taskAddedToBoard');
    let taskAddedToBoardModal = document.getElementById('taskAddedToBoardModal');

    taskAddedToBoard.style.display = 'flex';
    taskAddedToBoard.classList.add('task-added-to-board');
    taskAddedToBoardModal.classList.add('task-added-to-board-modal');
    setTimeout(function () {
        taskAddedToBoard.style.display = 'none';
        taskAddedToBoard.classList.remove('task-added-to-board');
        taskAddedToBoardModal.classList.remove('task-added-to-board-modal');
    }, 3000);
}