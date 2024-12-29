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
        if (!response.ok) {
            throw new Error('Failed to fetch tasks data');
        }
        const data = await response.json();
        return data ? Object.values(data).filter(task => task && task.status) : [];
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

function countTasksByStatus(tasksData) {
    const statusCount = {
        'todo': 0,
        'done': 0,
        'in-progress': 0,
        'await-feedback': 0
    };

    tasksData.forEach(task => {
        if (task && task.status && statusCount.hasOwnProperty(task.status)) {
            statusCount[task.status]++;
        }
    });

    return statusCount;
}

async function showCurrentTasksCount() {
    let tasksData = await loadTasks("tasks");
    if (tasksData && tasksData.length > 0) {
        updateSummaryStatusCount(tasksData);
        let totalTasks = countValidTasks(tasksData);
        updateGeneralTasksCount(totalTasks);
    } else {
        console.warn('No valid tasks found');
        updateGeneralTasksCount(0);
    }
}

function countValidTasks(tasksData) {
    let validTasksCount = 0;
    
    tasksData.forEach(task => {
        // Zählt nur gültige Aufgaben (task darf nicht null sein und muss einen Status haben)
        if (task && task.status) {
            validTasksCount++;
        }
    });

    return validTasksCount;
}

function updateSummaryStatusCount(tasksData) {
    const statusCount = countTasksByStatus(tasksData);

    document.getElementById('to-do-count').textContent = statusCount['todo'];
    document.getElementById('done-count').textContent = statusCount['done'];
    document.getElementById('in-progress-count').textContent = statusCount['in-progress'];
    document.getElementById('awaiting-feedback-count').textContent = statusCount['await-feedback'];
}

function updateGeneralTasksCount(totalTasks) {
    document.getElementById('general-tasks-count').textContent = totalTasks;
}