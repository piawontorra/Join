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

// Lädt Aufgaben vom Server
async function loadTasks(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        if (!response.ok) throw new Error('Failed to fetch tasks data');
        const data = await response.json();
        return data ? Object.values(data).filter(task => task && task.status !== 'done') : []; // Filter 'done' Aufgaben
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
    }
}

// Zählt Aufgaben nach Status
function countTasksByStatus(tasksData) {
    const statusCount = { 'todo': 0, 'done': 0, 'in-progress': 0, 'await-feedback': 0, 'urgent': 0 };
    tasksData.forEach(task => {
        if (task && task.status && statusCount.hasOwnProperty(task.status)) statusCount[task.status]++;
        if (task && task.priority === 'Urgent') statusCount['urgent']++;
    });
    return statusCount;
}

// Aktualisiert die Aufgabenstatus-Zählung auf der Seite
function updateSummaryStatusCount(tasksData) {
    const statusCount = countTasksByStatus(tasksData);
    document.getElementById('to-do-count').textContent = statusCount['todo'];
    document.getElementById('done-count').textContent = statusCount['done'];
    document.getElementById('in-progress-count').textContent = statusCount['in-progress'];
    document.getElementById('awaiting-feedback-count').textContent = statusCount['await-feedback'];
    document.getElementById('urgent-count').textContent = statusCount['urgent'];
}

// Findet das früheste Fälligkeitsdatum (auch aus der Vergangenheit)
// Findet das früheste Fälligkeitsdatum (auch aus der Vergangenheit)
function findUrgentTaskWithNearestDeadline(tasksData) {
    const today = new Date();
    let selectedTask = null;
    let selectedDateDiff = null;

    const urgentUnfinishedTasks = tasksData.filter(task => task && task.priority === 'Urgent' && task.dueDate && task.status !== 'done');

    if (urgentUnfinishedTasks.length === 0) {
        return null;
    }

    urgentUnfinishedTasks.forEach(task => {
        // Hier wird das Datum korrekt in ein Date-Objekt umgewandelt (DD/MM/YYYY -> YYYY/MM/DD)
        const dueDateParts = task.dueDate.split('/');  // DD/MM/YYYY
        const dueDate = new Date(dueDateParts[2], dueDateParts[1] - 1, dueDateParts[0]); // YYYY, MM-1, DD

        const diffTime = dueDate - today;

        if (selectedDateDiff === null || diffTime < selectedDateDiff) {
            selectedTask = task;
            selectedDateDiff = diffTime;
        }
    });

    return selectedTask ? new Date(selectedTask.dueDate.split('/').reverse().join('/')) : null; // Wir geben das tatsächliche Date-Objekt zurück
}


// Zeigt das Fälligkeitsdatum der dringendsten Aufgabe an (mit korrekt formatiertem Datum)
// Zeigt das Fälligkeitsdatum der dringendsten Aufgabe an (mit korrekt formatiertem Datum)
function updateUrgentTaskDeadline(dueDate) {
    const deadlineElement = document.getElementById('next-deadline-date');
    
    if (!dueDate) {
        deadlineElement.textContent = '';
        return;
    }

    // Umwandlung der Fälligkeitsdaten und Formatierung
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // Formatierung des Datums im gewünschten Format "Month Day, Year"
    let formattedDate = dueDate.toLocaleDateString('en-US', options); // "Month Day, Year" Format

    deadlineElement.textContent = formattedDate;
}


// Zeigt die Gesamtzahl der Aufgaben an
function updateGeneralTasksCount(totalTasks) {
    document.getElementById('general-tasks-count').textContent = totalTasks;
}

// Zählt die gültigen Aufgaben (mit einem Status)
function countValidTasks(tasksData) {
    return tasksData.filter(task => task && task.status).length;
}

// Zeigt die Anzahl der Aufgaben und das Fälligkeitsdatum an
async function showCurrentTasksCount() {
    let tasksData = await loadTasks("tasks");
    if (tasksData && tasksData.length > 0) {
        updateSummaryStatusCount(tasksData);
        let totalTasks = countValidTasks(tasksData);
        updateGeneralTasksCount(totalTasks);
        
        const urgentUnfinishedTask = findUrgentTaskWithNearestDeadline(tasksData);
        if (urgentUnfinishedTask) {
            updateUrgentTaskDeadline(urgentUnfinishedTask); // Das am nächsten liegende Fälligkeitsdatum setzen
        }
    } else {
        console.warn('No valid tasks found');
        updateGeneralTasksCount(0);
        updateUrgentTaskDeadline(null); // Wenn keine Aufgaben vorhanden sind
    }
}


