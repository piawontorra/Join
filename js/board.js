let tasksData = [];
let draggedElementId;
let priorityIcons = {
  Urgent: "./assets/img/urgent_icon.png",
  Medium: "./assets/img/medium_icon.png",
  Low: "./assets/img/low_icon.png"
}
const statusOrder = ['todo', 'in-progress', 'await-feedback', 'done'];

/**
 * Initializes the task board by including HTML, getting tasks data, and rendering tasks.
 * 
 * @async
 */
async function initBoard() {
  includeHTML();
  await getTasksData();
  await initAddTask();
  await renderTasks();
  initPortraitMode();
}

/**
* Renders the tasks in their respective status containers and adds a message if there are no tasks.
* 
* @async
*/
async function renderTasks() {
const statusContainers = getStatusContainers();
clearAllContainers(statusContainers);
await renderAllTasks(statusContainers);
addNoTasksMessage(statusContainers);
}

/**
* Returns an object containing references to the status containers in the task board.
* 
* @returns {Object} An object with references to the 'todo', 'in-progress', 'await-feedback', and 'done' containers.
*/
function getStatusContainers() {
return {
    'todo': document.getElementById('toDo'),
    'in-progress': document.getElementById('inProgress'),
    'await-feedback': document.getElementById('awaitFeedback'),
    'done': document.getElementById('done')
};
}

/**
* Clears all status containers by setting their innerHTML to an empty string.
* 
* @param {Object} statusContainers - An object containing status containers to be cleared.
*/
function clearAllContainers(statusContainers) {
for (let container of Object.values(statusContainers)) {
    container.innerHTML = '';
}
}

/**
* Fetches tasks data from the API and stores it in the tasksData array.
* 
* @async
* @returns {Array} The fetched and cleaned tasks data.
*/
async function getTasksData() {
const path = "tasks";
let response = await fetch(BASE_URL + path + ".json");
let responseAsJson = await response.json();

tasksData = cleanTasksData(responseAsJson);

return tasksData || {};
}

/**
* Cleans the tasks data by filtering out empty or invalid tasks.
* 
* @param {Object} tasksData - The raw tasks data from the API.
* @returns {Array} A cleaned array of tasks.
*/
function cleanTasksData(tasksData) {
if (!tasksData || Object.keys(tasksData).length === 0) {
    return [];
}

return Object.values(tasksData).filter(task => task);
}

/**
* Fetches user data by user ID.
* 
* @async
* @param {string} userId - The ID of the user whose data is to be fetched.
* @returns {Object|null} The fetched user data or null if an error occurs.
*/
async function getUserDataById(userId) {
const path = `contacts/${userId}`;
try {
  const response = await fetch(BASE_URL + path + ".json");
  const userData = await response.json();
  
  if (response.ok && userData) {
    return userData;
  }
} catch (error) {
  console.error(`Fehler beim Laden der Benutzerdaten für die ID ${userId}:`, error);
  return null;
}
}

/**
* Renders all tasks to their corresponding status containers.
* 
* @async
* @param {Object} statusContainers - The status containers where the tasks should be rendered.
*/
async function renderAllTasks(statusContainers) {
const tasks = cleanTasksData(tasksData);
const tempContainers = initializeTempContainers();

await populateTempContainers(tasks, tempContainers);
updateStatusContainers(statusContainers, tempContainers);
}

/**
* Initializes an object with empty string values for each status container.
* 
* @returns {Object} An object with empty string values for each task status container.
*/
function initializeTempContainers() {
return {
    'todo': '',
    'in-progress': '',
    'await-feedback': '',
    'done': ''
};
}

/**
* Populates the temporary containers with task cards for each task in the tasks array.
* 
* @async
* @param {Array} tasks - The tasks to populate the temporary containers with.
* @param {Object} tempContainers - The temporary containers to be populated.
*/
async function populateTempContainers(tasks, tempContainers) {
for (const task of tasks) {
    if (tempContainers[task.status] !== undefined) {
        tempContainers[task.status] += await getTaskCardTemplate(task);
    }
}
}

/**
* Updates the status containers by setting their innerHTML to the content from the temporary containers.
* 
* @param {Object} statusContainers - The status containers to be updated.
* @param {Object} tempContainers - The temporary containers with the content to set in the status containers.
*/
function updateStatusContainers(statusContainers, tempContainers) {
for (const status in statusContainers) {
    statusContainers[status].innerHTML = tempContainers[status];
}
}

/**
* Fetches the initials and background color of the users assigned to a task.
* 
* @async
* @param {Array} assignedUserIds - An array of user IDs to fetch data for.
* @returns {Array} A list of user data objects containing initials, color, and name.
*/
async function getAssignedUserInitialsAndColor(assignedUserIds) {
if (!isValidUserIdsArray(assignedUserIds)) {
    return [];
}

const userDataList = await fetchUserDataList(assignedUserIds);
return extractAssignedUserData(userDataList);
}

/**
* Validates if the provided array of user IDs is valid (non-empty).
* 
* @param {Array} assignedUserIds - The array of user IDs to validate.
* @returns {boolean} True if the array is valid, false otherwise.
*/
function isValidUserIdsArray(assignedUserIds) {
return Array.isArray(assignedUserIds) && assignedUserIds.length > 0;
}

/**
* Fetches user data for a list of user IDs.
* 
* @async
* @param {Array} assignedUserIds - An array of user IDs to fetch data for.
* @returns {Array} An array of user data objects.
*/
async function fetchUserDataList(assignedUserIds) {
const userPromises = assignedUserIds.map(userId => getUserDataById(userId));
return await Promise.all(userPromises);
}

/**
* Extracts the formatted user data from a list of user data objects.
* 
* @param {Array} userDataList - A list of user data objects.
* @returns {Array} A list of formatted user data objects containing initials, color, and name.
*/
function extractAssignedUserData(userDataList) {
return userDataList.map(userData => {
    if (userData) {
        return formatUserData(userData);
    }
    return null;
}).filter(user => user !== null);
}

/**
* Formats the user data into an object containing initials, color, and name.
* 
* @param {Object} userData - The user data object to format.
* @returns {Object} The formatted user data object.
*/
function formatUserData(userData) {
const userInitials = getInitials(userData.name);
const userColor = userData.userColor;
const userName = userData.name;

return { initials: userInitials, color: userColor, name: userName };
}

/**
* Returns the initials of a given name (first and last initials).
* 
* @param {string} name - The full name to get initials for.
* @returns {string} The initials of the name.
*/
function getInitials(name) {
let parts = name.split(" ");
if (parts.length < 2) return name.charAt(0).toUpperCase();
return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
}

/**
* Adds a "no tasks" message to each empty status container.
* 
* @param {Object} statusContainers - The status containers to add the "no tasks" message to.
*/
function addNoTasksMessage(statusContainers) {
if (isContainerEmpty(statusContainers['todo'])) {
    statusContainers['todo'].innerHTML = getNoTasksTemplate('To Do');
}
if (isContainerEmpty(statusContainers['in-progress'])) {
    statusContainers['in-progress'].innerHTML = getNoTasksTemplate('In Progress');
}
if (isContainerEmpty(statusContainers['await-feedback'])) {
    statusContainers['await-feedback'].innerHTML = getNoTasksTemplate('Await Feedback');
}
if (isContainerEmpty(statusContainers['done'])) {
    statusContainers['done'].innerHTML = getNoTasksTemplate('Done');
}
}

/**
* Checks if a given container is empty by comparing its innerHTML to an empty string.
* 
* @param {Element} container - The container to check.
* @returns {boolean} True if the container is empty, false otherwise.
*/
function isContainerEmpty(container) {
return container.innerHTML.trim() === '';
}

/**
* Retrieves the index of a task in the tasksData array by its ID.
* 
* @param {string} taskId - The ID of the task to find.
* @returns {number} The index of the task in the tasksData array, or -1 if not found.
*/
function getTaskIndexById(taskId) {
return Object.values(tasksData).findIndex(task => task.id === taskId);
}

/**
* Updates the progress bar of a task card based on the completed subtasks.
* 
* @param {Object} task - The task object to update the progress bar for.
*/
function updateProgressBar(task) {
const taskCard = document.querySelector(`.task-card[data-task-id="${task.id}"]`);
if (!taskCard) return;

const progressBar = taskCard.querySelector('.task-progress-bar');
const progressText = taskCard.querySelector('.taskcard-subtask p');

const completedCount = task.subtasks.filter(subtask => subtask.completed).length;
const totalSubtasks = task.subtasks.length;

const progressPercentage = totalSubtasks > 0 ? (completedCount / totalSubtasks) * 100 : 0;

if (progressBar) progressBar.style.width = `${progressPercentage}%`;
if (progressText) progressText.textContent = `${completedCount}/${totalSubtasks} Subtasks`;
}

/**
* Opens the task addition modal and sets the status for the new task.
* 
* @param {string} status - The status to set for the new task (e.g., 'todo').
*/
function openAddTask(status) {
selectedTaskStatus = status;
let contentRef = document.getElementById('boardAddTask');
contentRef.style.display = 'flex';
}

/**
* Closes the task addition modal.
*/
function closeAddTask() {
const contentRef = document.getElementById('boardAddTask');
const modalContent = contentRef.querySelector('.board-add-task-modal');

modalContent.classList.add('hidden');

setTimeout(() => {
    contentRef.style.display = 'none';
    modalContent.classList.remove('hidden');
}, 800);
}