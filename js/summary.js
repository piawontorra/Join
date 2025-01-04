/**
 * Initializes the summary page by including HTML, greeting the user, and showing the current task counts.
 */
function initSummary() {
    includeHTML();
    greetUser();
    showCurrentTasksCount();
}

/**
 * Greets the user based on the time of day and displays her/his name if logged in.
 */
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

/**
 * Returns a greeting based on the time of day.
 * 
 * @param {number} hours - The current hour (in 24-hour format).
 * @returns {string} - A greeting message based on the time.
 */
function getGreetingBasedOnTime(hours) {
    if (hours >= 1 && hours < 12) {
        return 'Good morning';
    } else if (hours >= 12 && hours < 17) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
}

/**
 * Redirects the user to the board page.
 */
function transferToBoard() {
    window.location.href = 'board.html';
}

/**
 * Toggles the image source between the hover and original image when the user hovers over it.
 * 
 * @param {boolean} isHovered - Whether the image is hovered or not.
 * @param {string} imgId - The ID of the image element.
 * @param {string} hoverSrc - The source of the image when hovered.
 * @param {string} originalSrc - The source of the image when not hovered.
 */
function toggleImage(isHovered, imgId, hoverSrc, originalSrc) {
    let imgRef = document.getElementById(imgId);
    imgRef.src = isHovered ? hoverSrc : originalSrc;
}

/**
 * Loads the tasks data from the given path.
 * 
 * @param {string} [path=""] - The path to the tasks data.
 * @returns {Promise<Array>} - A promise that resolves to an array of tasks.
 */
async function loadTasks(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        if (!response.ok) throw new Error('Failed to fetch tasks data');
        const data = await response.json();
        return data ? Object.values(data).filter(task => task && task.status !== 'done') : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

/**
 * Counts the number of tasks in each status category: 'todo', 'done', 'in-progress', 'await-feedback' starting by 0.
 * 
 * @param {Array} tasksData - The list of tasks.
 * @returns {Object} - An object containing the count of tasks by status.
 */
function countTasksByStatus(tasksData) {
    const statusCount = { 'todo': 0, 'done': 0, 'in-progress': 0, 'await-feedback': 0 };
    tasksData.forEach(task => task && task.status && statusCount.hasOwnProperty(task.status) && statusCount[task.status]++);
    return statusCount;
}

/**
 * Updates the summary status count displayed on the page.
 * 
 * @param {Array} tasksData - The list of tasks.
 */
function updateSummaryStatusCount(tasksData) {
    const statusCount = countTasksByStatus(tasksData);
    document.getElementById('to-do-count').textContent = statusCount['todo'];
    document.getElementById('done-count').textContent = statusCount['done'];
    document.getElementById('in-progress-count').textContent = statusCount['in-progress'];
    document.getElementById('awaiting-feedback-count').textContent = statusCount['await-feedback'];
}

/**
 * Finds the nearest urgent task's deadline.
 * 
 * @param {Array} tasksData - The list of tasks.
 * @returns {Date|null} - The nearest due date of an urgent task or null if none is found.
 */
function findUrgentTaskWithNearestDeadline(tasksData) {
    const today = new Date();
    let selectedTask = null;
    let selectedDateDiff = null;
    tasksData.filter(task => task && task.priority === 'Urgent' && task.dueDate && task.status !== 'done')
        .forEach(task => {
            const dueDate = new Date(task.dueDate.split('/').reverse().join('/'));
            const diffTime = dueDate - today;
            if (dueDate > today && (selectedDateDiff === null || diffTime < selectedDateDiff)) {
                selectedTask = task;
                selectedDateDiff = diffTime;
            }
        });
    return selectedTask ? new Date(selectedTask.dueDate.split('/').reverse().join('/')) : null;
}

/**
 * Updates the urgent task deadline displayed on the page by using the US date standard.
 * 
 * @param {Date} dueDate - The due date of the urgent task.
 */
function updateUrgentTaskDeadline(dueDate) {
    const deadlineElement = document.getElementById('next-deadline-date');
    if (!dueDate || dueDate < new Date()) {
        deadlineElement.textContent = '';
        return;
    }
    deadlineElement.textContent = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Counts the number of valid tasks (those that have a status).
 * 
 * @param {Array} tasksData - The list of tasks.
 * @returns {number} - The count of valid tasks.
 */
function countValidTasks(tasksData) {
    return tasksData.filter(task => task && task.status).length;
}

/**
 * Updates the general task count displayed on the page.
 * 
 * @param {number} totalTasks - The total number of valid tasks.
 */
function updateGeneralTasksCount(totalTasks) {
    document.getElementById('general-tasks-count').textContent = totalTasks;
}

/**
 * Filters the urgent, unfinished tasks from the tasks data.
 * 
 * @param {Array} tasksData - The list of tasks.
 * @returns {Array} - The filtered list of urgent, unfinished tasks.
 */
function filterUrgentUnfinishedTasks(tasksData) {
    return tasksData.filter(task => task && task.priority === 'Urgent' && task.status !== 'done' && task.dueDate);
}

/**
 * Finds the nearest due date among the urgent, unfinished tasks.
 * 
 * @param {Array} urgentTasks - The filtered urgent tasks.
 * @returns {Date|null} - The nearest due date or null if not found.
 */
function findNearestUrgentTaskDueDate(urgentTasks) {
    return findUrgentTaskWithNearestDeadline(urgentTasks);
}

/**
 * Calculates the count of urgent tasks that have a due date before or on the nearest due date.
 * 
 * @param {Array} urgentTasks - The filtered urgent tasks.
 * @param {Date} nearestDueDate - The nearest due date.
 * @returns {number} - The count of urgent tasks with a due date before or on the nearest due date.
 */
function countUrgentTasksBeforeDueDate(urgentTasks, nearestDueDate) {
    return urgentTasks.filter(task => {
        const dueDate = new Date(task.dueDate.split('/').reverse().join('/'));
        return dueDate <= nearestDueDate;
    }).length;
}

/**
 * Updates the count of urgent tasks displayed on the page.
 * 
 * @param {Array} tasksData - The list of all tasks.
 */
function updateUrgentTasksCount(tasksData) {
    const urgentUnfinishedTasks = filterUrgentUnfinishedTasks(tasksData);
    if (urgentUnfinishedTasks.length === 0) {
        document.getElementById('urgent-count').textContent = 0;
        return;
    }

    const nearestDueDate = findNearestUrgentTaskDueDate(urgentUnfinishedTasks);
    if (!nearestDueDate) {
        document.getElementById('urgent-count').textContent = 0;
        return;
    }

    const urgentCount = countUrgentTasksBeforeDueDate(urgentUnfinishedTasks, nearestDueDate);
    document.getElementById('urgent-count').textContent = urgentCount;
}

/**
 * Displays the current task counts on the summary page.
 */
async function showCurrentTasksCount() {
    let tasksData = await loadTasks("tasks");
    if (tasksData && tasksData.length > 0) {
        updateSummaryStatusCount(tasksData);
        updateGeneralTasksCount(countValidTasks(tasksData));
        const urgentUnfinishedTask = findUrgentTaskWithNearestDeadline(tasksData);
        updateUrgentTaskDeadline(urgentUnfinishedTask);
        updateUrgentTasksCount(tasksData);
    } else {
        updateGeneralTasksCount(0);
        updateUrgentTaskDeadline(0);
        updateUrgentTasksCount([]);
    }
}