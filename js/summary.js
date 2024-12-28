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
        if (!data) {
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

function initializeStatusCount() {
    return {
        'todo': 0,
        'done': 0,
        'in-progress': 0,
        'await-feedback': 0
    };
}

function isValidTask(task, statusCount) {
    return task && task.status && statusCount.hasOwnProperty(task.status);
}

function countTasksByStatus(tasksData) {
    const statusCount = initializeStatusCount();

    if (!tasksData || tasksData.length === 0) {
        console.warn('No tasks data available');
        return statusCount;
    }

    tasksData.forEach(task => {
        isValidTask(task, statusCount) ? statusCount[task.status]++ : console.warn('Skipping task with invalid status', task);
    });

    return statusCount;
}


async function showCurrentTasksCount() {
    let tasksData = await loadTasks("tasks");
    if (tasksData && Array.isArray(tasksData) && tasksData.length > 0) {
        updateSummaryStatusCount(tasksData);
    } else {
        console.warn('No valid tasks data available to show counts');
    }
}

function updateSummaryStatusCount(tasksData) {
    const statusCount = countTasksByStatus(tasksData);

    document.getElementById('to-do-count').textContent = statusCount['todo'];
    document.getElementById('done-count').textContent = statusCount['done'];
    // document.getElementById('urgent-count').textContent = statusCount['urgent'];
    document.getElementById('in-progress-count').textContent = statusCount['in-progress'];
    document.getElementById('awaiting-feedback-count').textContent = statusCount['await-feedback'];
}