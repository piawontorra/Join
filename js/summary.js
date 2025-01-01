function initSummary() {
    includeHTML();
    greetUser();
    showCurrentTasksCount();
}

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

function getGreetingBasedOnTime(hours) {
    if (hours >= 1 && hours < 12) {
        return 'Good morning';
    } else if (hours >= 12 && hours < 17) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
}

function transferToBoard() {
    window.location.href = 'board.html';
}

function toggleImage(isHovered, imgId, hoverSrc, originalSrc) {
    let imgRef = document.getElementById(imgId);
    imgRef.src = isHovered ? hoverSrc : originalSrc;
}

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

function countTasksByStatus(tasksData) {
    const statusCount = { 'todo': 0, 'done': 0, 'in-progress': 0, 'await-feedback': 0 };
    tasksData.forEach(task => task && task.status && statusCount.hasOwnProperty(task.status) && statusCount[task.status]++);
    return statusCount;
}

function updateSummaryStatusCount(tasksData) {
    const statusCount = countTasksByStatus(tasksData);
    document.getElementById('to-do-count').textContent = statusCount['todo'];
    document.getElementById('done-count').textContent = statusCount['done'];
    document.getElementById('in-progress-count').textContent = statusCount['in-progress'];
    document.getElementById('awaiting-feedback-count').textContent = statusCount['await-feedback'];
}

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

function updateUrgentTaskDeadline(dueDate) {
    const deadlineElement = document.getElementById('next-deadline-date');
    if (!dueDate || dueDate < new Date()) {
        deadlineElement.textContent = '';
        return;
    }
    deadlineElement.textContent = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function countValidTasks(tasksData) {
    return tasksData.filter(task => task && task.status).length;
}

function updateGeneralTasksCount(totalTasks) {
    document.getElementById('general-tasks-count').textContent = totalTasks;
}

function updateUrgentTasksCount(tasksData) {
    const urgentUnfinishedTasks = tasksData.filter(task => task && task.priority === 'Urgent' && task.status !== 'done' && task.dueDate);

    if (urgentUnfinishedTasks.length === 0) {
        document.getElementById('urgent-count').textContent = 0;
        return;
    }

    let nearestDueDate = findUrgentTaskWithNearestDeadline(urgentUnfinishedTasks);
    if (!nearestDueDate) {
        document.getElementById('urgent-count').textContent = 0;
        return;
    }

    let urgentCount = urgentUnfinishedTasks.filter(task => {
        const dueDate = new Date(task.dueDate.split('/').reverse().join('/'));
        return dueDate <= nearestDueDate;
    }).length;

    document.getElementById('urgent-count').textContent = urgentCount;
}

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