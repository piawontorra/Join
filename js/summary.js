let urgentUnfinishedTasks = [];
let today = new Date();
let yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
let selectedTask = null;
let selectedDateDiff = null;

/**
 * Initializes the summary page by including HTML, greeting the user, and showing the current task counts.
 */
function initSummary() {
    includeHTML();
    initPortraitMode();
    summaryRepresentation();
}

/**
 * Controls the display of summary content based on the screen width.
 * If the screen width is less than 1065px, the mobile layout is applied.
 * Otherwise, the desktop layout is applied.
 *
 * @returns {void} This function does not return any value, it performs DOM manipulation based on the screen size.
 */
function summaryRepresentation() {
    const summaryHeadRef = document.getElementById('summary-head');
    const summaryContentRef = document.getElementById('summary-content');

    if (summaryHeadRef || summaryContentRef) {
        if (innerWidth < 1065) {
            summaryMobile();
        } else {
            summaryDesktop();
        }
    }
}

/**
 * Applies the mobile layout for the summary content.
 * This function hides the summary header and content, adjusts the greeting height, 
 * and displays the greeting. Afterward, it invokes the `greetingComesAtFirst` function 
 * to manage the transition of the greeting display.
 *
 * @returns {void} This function does not return any value, it manipulates the DOM to adjust the layout for mobile view.
 */
function summaryMobile() {
    const summaryHeadRef = document.getElementById('summary-head');
    const summaryContentRef = document.getElementById('summary-content');
    const greetingHeightRef = document.getElementById('greeting-min-height');

    summaryHeadRef.classList.add('d-none');
    summaryContentRef.classList.add('d-none');
    greetingHeightRef.classList.add('tab-min-height');
    greetUser();
    greetingComesAtFirst();
}

/**
 * Handles the greeting display transition for mobile layout.
 * After a short delay, this function hides the greeting, reveals the summary header 
 * and content, and adjusts the layout by removing and adding the appropriate classes.
 * It also invokes the `showCurrentTasksCount` function to display the current tasks count.
 *
 * @returns {void} This function does not return any value, it manipulates the DOM elements to manage the greeting transition.
 */
function greetingComesAtFirst() {
    const summaryHeadRef = document.getElementById('summary-head');
    const summaryContentRef = document.getElementById('summary-content');
    const greetingHeightRef = document.getElementById('greeting-min-height');
    const summaryGreetingRef = document.getElementById('summary-greeting');

    setTimeout(() => {
        summaryGreetingRef.classList.add('d-none');
        summaryHeadRef.classList.remove('d-none');
        summaryContentRef.classList.remove('d-none');
        greetingHeightRef.classList.remove('tab-min-height');
        document.getElementById('section-min-height').classList.add('tab-min-height');
        showCurrentTasksCount();
    }, 1200);
}

/**
 * Applies the desktop layout for the summary content.
 * This function ensures that the summary header, content, and greeting are visible.
 * It also calls the `greetUser` and `showCurrentTasksCount` functions to display the user greeting 
 * and the current tasks count.
 *
 * @returns {void} This function does not return any value, it manipulates the DOM to adjust the layout for desktop view.
 */
function summaryDesktop() {
    const summaryHeadRef = document.getElementById('summary-head');
    const summaryContentRef = document.getElementById('summary-content');
    const summaryGreetingRef = document.getElementById('summary-greeting');

    summaryHeadRef.classList.remove('d-none');
    summaryContentRef.classList.remove('d-none');
    summaryGreetingRef.classList.remove('d-none');
    greetUser();
    showCurrentTasksCount();
}

/**
 * Greets the user based on the time of day and displays her/his name if logged in.
 */
function greetUser() {
    const greetingTextRef = document.getElementById('greeting-text');
    const userNameRef = document.getElementById('user-name');
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
    const imgRef = document.getElementById(imgId);
    imgRef.src = isHovered ? hoverSrc : originalSrc;
}

/**
 * Fetches the current tasks from firebase and updates the task counts.
 *
 * This function loads the tasks data asynchronously, processes it, and updates the 
 * status counts, urgent task deadlines, and urgent task counts in the DOM. 
 * If no tasks are found, it updates the DOM with default values.
 *
 * @async
 * @returns {void}
 */
async function showCurrentTasksCount() {
    let tasksData = await loadTasks("tasks");
    if (tasksData && tasksData.length > 0) {
        updateSummaryStatusCount(tasksData);
        const selectedTask = updateUrgentTaskDeadline(tasksData);
        updateUrgentTasksCount(selectedTask, urgentUnfinishedTasks);
    } else {
        updateSummaryStatusCount([]);
        updateUrgentTaskDeadline([]);
        updateUrgentTasksCount(null, []);
    }
}

/**
 * Fetches the tasks data from firebase and processes it by filtering out 
 * tasks that are missing a status to ensure, it is not a deleted one.
 *
 * @async
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
 * Iterates through the tasks array and counts the number of tasks for each 
 * status: 'todo', 'done', 'in-progress', and 'await-feedback'.
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
 * Displays the task count for each status in the DOM elements with the 
 * corresponding ids ('to-do-count', 'done-count', etc.).
 * The element with the id 'every-status-count' represents the sum of tasks of every status.
 *
 * @param {Array} tasksData - The list of tasks to check.
 * @returns {void}
 */
function updateSummaryStatusCount(tasksData) {
    let statusCount = countTasksByStatus(tasksData);
    document.getElementById('to-do-count').innerText = statusCount['todo'];
    document.getElementById('done-count').innerText = statusCount['done'];
    document.getElementById('in-progress-count').innerText = statusCount['in-progress'];
    document.getElementById('awaiting-feedback-count').innerText = statusCount['await-feedback'];
    document.getElementById('every-status-count').innerHTML = tasksData.length;
}

/**
 * Updates the urgent task deadline and displays it in the DOM.
 *
 * Finds the task with the nearest deadline from the list of tasks and 
 * displays its due date. If no urgent task is found, it displays a message 
 * indicating no urgent tasks are available.
 *
 * @param {Array} tasksData - The list of tasks to check.
 * @returns {Object|null} - The task with the nearest deadline, or null if no task is found.
 */
function updateUrgentTaskDeadline(tasksData) {
    let selectedTask = findUrgentTaskWithNearestDeadline(tasksData);

    if (selectedTask) {
        let dueDate = new Date(selectedTask.dueDate.split('/').reverse().join('/'));
        document.getElementById('next-deadline-date').innerHTML = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return selectedTask;
    } else {
        document.getElementById('next-deadline-date').innerHTML = 'No urgent tasks available';
        return null;
    }
}

/**
 * Finds the urgent task with the nearest deadline.
 *
 * Filters the tasks to find urgent tasks that are not marked as 'done' 
 * and have a due date. It returns the task with the closest due date to today.
 *
 * @param {Array} tasksData - The list of tasks to check.
 * @returns {Object|null} - The task with the nearest deadline, or null if no urgent task is found.
 */
function findUrgentTaskWithNearestDeadline(tasksData) {
    urgentUnfinishedTasks = tasksData.filter(task => task && task.priority === 'Urgent' && task.dueDate && task.status !== 'done');

    urgentUnfinishedTasks.forEach(task => {
        let dueDate = new Date(task.dueDate.split('/').reverse().join('/'));
        let diffTime = dueDate - yesterday;
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
 * Filters the list of urgent, unfinished tasks to find those that have 
 * a due date earlier than or equal to the provided due date.
 *
 * @param {Array} urgentUnfinishedTasks - The list of urgent, unfinished tasks.
 * @param {Date} nearestDueDate - The date by which tasks are counted.
 * @returns {number} - The number of tasks before the given due date.
 */
function countUrgentTasksBeforeDueDate(urgentUnfinishedTasks, nearestDueDate) {
    return urgentUnfinishedTasks.filter(task => {
        let taskDueDate = new Date(task.dueDate.split('/').reverse().join('/'));
        return taskDueDate <= nearestDueDate;
    }).length;
}

/**
 * Updates the count of urgent tasks before the nearest deadline.
 *
 * Displays the count of urgent tasks that have a due date before or 
 * equal to the selected task's due date in the DOM element with the 
 * id 'urgent-count'.
 *
 * @param {Object|null} selectedTask - The selected urgent task with the nearest deadline.
 * @param {Array} urgentUnfinishedTasks - The list of urgent, unfinished tasks.
 * @returns {void}
 */
function updateUrgentTasksCount(selectedTask, urgentUnfinishedTasks) {
    if (selectedTask) {
        let dueDate = new Date(selectedTask.dueDate.split('/').reverse().join('/'));
        let urgentCount = countUrgentTasksBeforeDueDate(urgentUnfinishedTasks, dueDate);
        document.getElementById('urgent-count').innerText = urgentCount;
    } else {
        document.getElementById('urgent-count').innerText = 0;
    }
}

/**
 * Event listener for resizing the window.
 * This listener calls the `summaryRepresentation()` function whenever the window is resized.
 * The function adjusts the visibility of the imprint summary based on the window width.
 * 
 * @listens resize
 */
window.addEventListener('resize', function () {
    summaryRepresentation();
});