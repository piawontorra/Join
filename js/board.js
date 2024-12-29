let tasksData = [];
let draggedElementId;
let priorityIcons = {
  Urgent: "./assets/img/urgent_icon.png",
  Medium: "./assets/img/medium_icon.png",
  Low: "./assets/img/low_icon.png"
}
const statusOrder = ['todo', 'in-progress', 'await-feedback', 'done'];

async function initBoard() {
    includeHTML();
    await getTasksData();
    await initAddTask();
    await renderTasks();
}

async function renderTasks() {
  const statusContainers = getStatusContainers();
  clearAllContainers(statusContainers);
  await renderAllTasks(statusContainers);
  addNoTasksMessage(statusContainers);
}

function getStatusContainers() {
  return {
      'todo': document.getElementById('toDo'),
      'in-progress': document.getElementById('inProgress'),
      'await-feedback': document.getElementById('awaitFeedback'),
      'done': document.getElementById('done')
  };
}

function clearAllContainers(statusContainers) {
  for (let container of Object.values(statusContainers)) {
      container.innerHTML = '';
  }
}

async function getTasksData() {
  const path = "tasks";
  let response = await fetch(BASE_URL + path + ".json");
  let responseAsJson = await response.json();

  tasksData = cleanTasksData(responseAsJson);

  return tasksData || {};
}

function cleanTasksData(tasksData) {
  if (!tasksData || Object.keys(tasksData).length === 0) {
      return [];
  }

  return Object.values(tasksData).filter(task => task);
}

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

async function renderAllTasks(statusContainers) {
  const tasks = cleanTasksData(tasksData);

  for (let i = 0; i < tasks.length; i++) {
      const task = tasksData[i];
      if (statusContainers[task.status]) {
          statusContainers[task.status].innerHTML += await getTaskCardTemplate(task);
      }
  }
}

async function getAssignedUserInitialsAndColor(assignedUserIds) {
  if (!Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
    return [];
  }

  // Alle Benutzer-Daten parallel abrufen
  const userPromises = assignedUserIds.map(userId => getUserDataById(userId));

  // Warten, bis alle Promises abgeschlossen sind
  const userDataList = await Promise.all(userPromises);

  // Extrahiere die notwendigen Informationen aus den Benutzerdaten
  const assignedUserData = userDataList.map(userData => {
    if (userData) {
      const userInitials = getInitials(userData.name);
      const userColor = userData.userColor;
      const userName = userData.name;

      return { initials: userInitials, color: userColor, name: userName };
    }
    return null; // Falls userData null ist
  }).filter(user => user !== null); // Entferne null-Werte, falls kein userData zurückgegeben wurde

  return assignedUserData;
}

function getInitials(name) {
  let parts = name.split(" ");
  if (parts.length < 2) return name.charAt(0).toUpperCase();
  return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
}

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

function isContainerEmpty(container) {
  return container.innerHTML.trim() === '';
}

function getTaskIndexById(taskId) {
  return Object.values(tasksData).findIndex(task => task.id === taskId);
}

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

async function updateSubtaskInFirebase(taskId, subtaskIndex, completed) {
  const path = `tasks/${taskId}/subtasks/${subtaskIndex}`;
  const updateData = {
    completed: completed,
  };

  try {
    const response = await fetch(BASE_URL + path + ".json", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Patchen der Subtask in Firebase');
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Subtask in Firebase:", error);
  }
}

function openAddTask(status) {
  selectedTaskStatus = status;
  let contentRef = document.getElementById('boardAddTask');
  contentRef.style.display = 'flex';
}

function closeAddTask() {
  let contentRef = document.getElementById('boardAddTask');
  
  contentRef.style.display = 'none';
}


