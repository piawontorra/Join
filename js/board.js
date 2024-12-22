async function initBoard() {
    includeHTML();
    await getTasksData();
    renderTasks();
    console.log(tasksData);  // Überprüfe, ob task.id korrekt vorhanden ist
}

let tasksData = {};
let draggedElementId;
let priorityIcons = {
  Urgent: "./assets/img/urgent_icon.png",
  Medium: "./assets/img/medium_icon.png",
  Low: "./assets/img/low_icon.png"
}

function renderTasks() {
  const statusContainers = getStatusContainers();
  clearAllContainers(statusContainers);
  renderAllTasks(statusContainers);
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

  // Bereinige die Daten, um ungültige oder leere Einträge zu entfernen
  tasksData = cleanTasksData(responseAsJson);

  console.log("Bereinigte Tasks Data:", tasksData);
  return tasksData || {};  // Rückgabe der bereinigten Daten
}

function cleanTasksData(tasksData) {
  // Filtere ungültige (null oder leere) Tasks heraus
  return Object.values(tasksData).filter(task => task !== null && task !== undefined && Object.keys(task).length > 0);
}

async function getUserDataById(userId) {
  const path = `contacts/${userId}`;  // Setze den Pfad für den Benutzer in der Firebase-Datenbank
  try {
    const response = await fetch(BASE_URL + path + ".json");
    const userData = await response.json();
    
    if (response.ok && userData) {
      return userData;  // Gibt die Benutzerdaten zurück
    } else {
      throw new Error('Benutzerdaten konnten nicht geladen werden.');
    }
  } catch (error) {
    console.error(`Fehler beim Laden der Benutzerdaten für die ID ${userId}:`, error);
    return null;  // Falls ein Fehler auftritt, gebe null zurück
  }
}

async function renderAllTasks(statusContainers) {
  const tasks = cleanTasksData(tasksData);

  for (let i = 0; i < tasks.length; i++) {
      const task = tasksData[i];
      if (statusContainers[task.status]) {
          statusContainers[task.status].innerHTML += await getTaskCardTemplate(task);
      } else {
          console.warn(`Unbekannter Status: ${task.status}`);
      }
  }
}

async function getAssignedUserInitialsAndColor(assignedUserIds) {
  const assignedUserData = [];

  for (let userId of assignedUserIds) {
      const userData = await getUserDataById(userId);
      const userInitials = getInitials(userData.name);
      const userColor = userData.userColor;
      const userName = userData.name;

      assignedUserData.push({ initials: userInitials, color: userColor, name: userName });
  }

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

function dragTask(taskId) {
  draggedElementId = taskId
}

function allowDrop(event) {
  event.preventDefault();

  const targetContainer = event.target.closest('.task-content-split');
  if (targetContainer) {
      targetContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
      targetContainer.style.borderRadius = '20px';
  }
}

function dropTask(event, newStatus) {
  event.preventDefault();

  const taskId = draggedElementId;
  const taskIndex = getTaskIndexById(taskId);

  if (taskIndex === -1) {
    console.warn(`Aufgabe mit ID ${taskId} nicht gefunden.`);
    return;
  }

  updateTaskStatus(taskIndex, newStatus);
  updateTaskStatusInFirebase(taskId, newStatus);
  resetContainerHighlight(event)
  renderTasks();
}

function getTaskIndexById(taskId) {
  return Object.values(tasksData).findIndex(task => task.id === taskId);
}

function resetContainerHighlight(event) {
  const targetContainer = event.target.closest('.task-content-split');
  if (targetContainer) {
      targetContainer.style.backgroundColor = '';
  }
}

function updateTaskStatus(taskIndex, newStatus) {
  const task = Object.values(tasksData)[taskIndex];
  task.status = newStatus;
}

async function updateTaskStatusInFirebase(taskId, newStatus) {
  const path = `tasks/${taskId}`;
  const updateData = { status: newStatus };

  try {
    const response = await fetch(BASE_URL + path + ".json", {
      method: 'PATCH',
      body: JSON.stringify(updateData),
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error(`Error updating status for task with ID "${taskId}": ${error.message}`);
  }
}

function renderTaskInContainer(event, taskIndex) {
  const targetTaskContainer = event.target.closest('.task-content-split');
  if (targetTaskContainer) {
      targetTaskContainer.innerHTML += getTaskCardTemplate(tasks[taskIndex]);
  }
}

function highlightDrag(event) {
  const targetContainer = event.target.closest('.task-content-split');
  if (targetContainer) {
      targetContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
      targetContainer.style.borderRadius = '20px';
  }
}

function removeHighlightDrag(event) {
  const targetContainer = event.target.closest('.task-content-split');
  if (targetContainer) {
      targetContainer.style.backgroundColor = '';
      targetContainer.style.borderRadius = '20px';
  }
}

async function openTaskDetail(taskId) {
  taskId = Number(taskId);

  const task = tasksData.find(t => t.id === taskId);

  if (!task) {
    console.warn(`Aufgabe mit ID "${taskId}" nicht gefunden.`);
    return;
  }

  const detailHTML = await getDetailTaskCardTemplate(task);
  document.getElementById('taskDetail').innerHTML = detailHTML;

  const modal = document.getElementById('taskDetailModal');
  modal.style.display = 'flex';
}


function closeTaskDetail() {
  const modal = document.getElementById('taskDetailModal');
  modal.style.display = 'none';
}

function updateProgressBar(task) {
  const taskCard = document.querySelector(`.task-card[data-task-id="${task.id}"]`);
  if (!taskCard) return;

  const progressBar = taskCard.querySelector('.task-progress-bar');
  const progressText = taskCard.querySelector('.task-subtask p');

  const completedCount = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;

  // Fortschritt berechnen
  const progressPercentage = totalSubtasks > 0 ? (completedCount / totalSubtasks) * 100 : 0;

  // Progress-Bar und Text aktualisieren
  if (progressBar) progressBar.style.width = `${progressPercentage}%`;
  if (progressText) progressText.textContent = `${completedCount}/${totalSubtasks} Subtasks`;
}

function handleSubtaskCheckboxChange(event, task, subtaskIndex) {
  const isChecked = event.target.checked;  // Hole den Status der Checkbox (true oder false)
  
  // Aktualisiere die completed-Eigenschaft der Subtask
  task.subtasks[subtaskIndex].completed = isChecked;
  
  // Patch die Änderung in Firebase
  updateSubtaskInFirebase(task.id, subtaskIndex, isChecked);

  // Synchronisiere die Fortschrittsanzeige
  updateProgressBar(task);
}


async function updateSubtaskInFirebase(taskId, subtaskIndex, completed) {
  const path = `tasks/${taskId}/subtasks/${subtaskIndex}`;  // Pfad zu der Subtask in der Firebase-Datenbank
  const updateData = {
    completed: completed,  // Setze die completed-Eigenschaft der Subtask
  };

  try {
    const response = await fetch(BASE_URL + path + ".json", {
      method: "PATCH",  // Verwende PATCH, um nur die Änderungen zu speichern
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Patchen der Subtask in Firebase');
    }

    console.log(`Subtask ${subtaskIndex} in Task ${taskId} erfolgreich aktualisiert.`);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Subtask in Firebase:", error);
  }
}


