let urgentUnfinishedTasks = [];

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

    userName ? greetingTextRef.innerHTML = greeting + ', ' : greetingTextRef.innerHTML = greeting + '!';

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

async function showCurrentTasksCount() {
    let tasksData = await loadTasks("tasks");
    if (tasksData && tasksData.length > 0) {
        updateSummaryStatusCount(tasksData);
        const selectedTask = updateUrgentTaskDeadline(tasksData);
        updateUrgentTasksCount(selectedTask, urgentUnfinishedTasks)
    } else {
        updateSummaryStatusCount([]);
        updateUrgentTaskDeadline([]);
        updateUrgentTasksCount(null, []);
    }
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
        return data ? Object.values(data).filter(task => task && task.status) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

/**
 * Counts the number of tasks by their status.
 *
 * @param {Array} tasksData - The list of tasks to count.
 * @returns {Object} - An object containing the count of tasks by status.
 */
function countTasksByStatus(tasksData) {
    const statusCount = { 'todo': 0, 'done': 0, 'in-progress': 0, 'await-feedback': 0 };
    tasksData.forEach(task => task && task.status && statusCount.hasOwnProperty(task.status) && statusCount[task.status]++);
    return statusCount;
}

/**
 * Updates the summary status count in the DOM.
 *
 * @param {Array} tasksData - The list of tasks to check.
 * @returns {void}
 */
function updateSummaryStatusCount(tasksData) {
    const statusCount = countTasksByStatus(tasksData);
    document.getElementById('to-do-count').innerText = statusCount['todo'];
    document.getElementById('done-count').innerText = statusCount['done'];
    document.getElementById('in-progress-count').innerText = statusCount['in-progress'];
    document.getElementById('awaiting-feedback-count').innerText = statusCount['await-feedback'];
    document.getElementById('every-status-count').innerHTML = tasksData.length;
}

/**
 * Updates the urgent task deadline and displays it in the DOM.
 *
 * @param {Array} tasksData - The list of tasks to check.
 * @returns {Object|null} - The task with the nearest deadline, or null if no task is found.
 */
function updateUrgentTaskDeadline(tasksData) {
    const selectedTask = findUrgentTaskWithNearestDeadline(tasksData);

    if (selectedTask) {
        const dueDate = new Date(selectedTask.dueDate.split('/').reverse().join('/'));
        document.getElementById('next-deadline-date').innerHTML = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return selectedTask;  // selectedTask zurückgeben
    } else {
        document.getElementById('next-deadline-date').innerHTML = 'No urgent tasks available';
        return null;
    }
}

/**
 * Finds the urgent task with the nearest deadline.
 *
 * @param {Array} tasksData - The list of tasks to check.
 * @returns {Object|null} - The task with the nearest deadline, or null if no task is found.
 */
function findUrgentTaskWithNearestDeadline(tasksData) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    let selectedTask = null;
    let selectedDateDiff = null;

    // Filter urgent and unfinished tasks
    urgentUnfinishedTasks = tasksData.filter(task => task && task.priority === 'Urgent' && task.dueDate && task.status !== 'done');

    urgentUnfinishedTasks.forEach(task => {
        const dueDate = new Date(task.dueDate.split('/').reverse().join('/'));
        const diffTime = dueDate - yesterday;
        if (dueDate >= yesterday && (selectedDateDiff === null || diffTime <= selectedDateDiff)) {
            selectedTask = task;
            selectedDateDiff = diffTime;
        }
    });

    return selectedTask;
}

/**
 * Counts the number of urgent tasks before the given due date.
 *
 * @param {Array} urgentUnfinishedTasks - The list of urgent, unfinished tasks.
 * @param {Date} nearestDueDate - The date by which tasks should be counted.
 * @returns {number} - The number of tasks.
 */
function countUrgentTasksBeforeDueDate(urgentUnfinishedTasks, nearestDueDate) {
    return urgentUnfinishedTasks.filter(task => {
        const taskDueDate = new Date(task.dueDate.split('/').reverse().join('/'));
        return taskDueDate <= nearestDueDate;
    }).length;
}

/**
 * Updates the count of urgent tasks before the nearest deadline.
 *
 * @param {Object|null} selectedTask - The selected urgent task with the nearest deadline.
 * @param {Array} tasksData - The list of tasks to check.
 * @returns {void}
 */
function updateUrgentTasksCount(selectedTask, urgentUnfinishedTasks) {
    if (selectedTask) {
        const dueDate = new Date(selectedTask.dueDate.split('/').reverse().join('/'));
        
        const urgentCount = countUrgentTasksBeforeDueDate(urgentUnfinishedTasks, dueDate);
        document.getElementById('urgent-count').innerText = urgentCount;
    } else {
        document.getElementById('urgent-count').innerText = 0;
    }
}
