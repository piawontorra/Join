async function initBoard() {
    includeHTML();
    await getTasksData();
    await initAddTask();
    renderTasks();
    // console.log(tasksData);  // Überprüfe, ob task.id korrekt vorhanden ist
}

let tasksData = {};
let draggedElementId;
let priorityIcons = {
  Urgent: "./assets/img/urgent_icon.png",
  Medium: "./assets/img/medium_icon.png",
  Low: "./assets/img/low_icon.png"
}
// Status-Mapping
const statusOrder = ['todo', 'in-progress', 'await-feedback', 'done'];

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

  // Bereinige die Daten, um ungültige oder leere Einträge zu entfernen
  tasksData = cleanTasksData(responseAsJson);

  // console.log("Bereinigte Tasks Data:", tasksData);
  return tasksData || {};  // Rückgabe der bereinigten Daten
}

// async function getTasksData() {
//   try {
//       const response = await fetch(BASE_URL + '/tasks.json'); // Hole die Daten
//       const tasksData = await response.json();

//       // Daten bereinigen und Standardwert nutzen, falls keine Tasks vorhanden
//       return cleanTasksData(tasksData || {});
//   } catch (error) {
//       console.error("Fehler beim Abrufen der Tasks:", error);
//       return {}; // Gib ein leeres Objekt zurück, wenn ein Fehler auftritt
//   }
// }

function cleanTasksData(tasksData) {
  if (!tasksData || Object.keys(tasksData).length === 0) {
      return []; // Gib ein leeres Array zurück, wenn keine Daten vorhanden sind
  }

  return Object.values(tasksData).filter(task => task); // Entferne undefinierte oder null-Werte
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
  if (!Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
      return []; // Rückgabe eines leeren Arrays, wenn keine User-IDs vorhanden sind
  }

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

function checkAndUpdateNoTasksMessage(container) {
  const statusMapping = {
    toDo: 'To Do',
    inProgress: 'In Progress',
    awaitFeedback: 'Await Feedback',
    done: 'Done',
  };

  const taskCards = container.querySelectorAll('.task-card');

  if (taskCards.length === 0) {
    const readableStatus = statusMapping[container.id];
    container.innerHTML = getNoTasksTemplate(readableStatus);
  }
}

function dragTask(taskId) {
  draggedElementId = taskId;

  // Verstecke alle "No Tasks"-Meldungen
  const noTasksMessages = document.querySelectorAll('.no-tasks-message');
  noTasksMessages.forEach(message => {
    message.style.display = 'none';
  });

  // Zeige die dashed-box in allen erlaubten Containern
  const task = Object.values(tasksData).find(task => task.id === taskId);
  if (task) {
    const currentStatus = task.status;
    const statusContainers = getStatusContainers();

    // Durchlaufe alle Status-Container, um die "dashed-box" anzuzeigen
    statusOrder.forEach(status => {
      if (status !== currentStatus) {
        const container = statusContainers[status];
        if (container) {
          showDashedBox(container);  // Funktion zum Anzeigen der dashed-box
        }
      }
    });
  }
}

function allowDrop(event) {
  event.preventDefault(); // Zulassen des Drops
}

function showDashedBox(container) {
  const dashedBox = document.createElement('div');
  dashedBox.className = 'dashed-box';
  dashedBox.style.border = '2px dashed #aaa';
  dashedBox.style.height = '100px'; // Höhe deiner Task-Karte
  dashedBox.style.margin = '10px 0';
  dashedBox.dataset.dashedBox = 'true'; // Markiere es zur späteren Identifikation
  container.appendChild(dashedBox);
}

function removeAllDashedBoxes() {
  const dashedBoxes = document.querySelectorAll('.dashed-box');
  dashedBoxes.forEach(box => box.remove());
}

function dropTask(event, newStatus) {
  event.preventDefault();

  const taskId = draggedElementId;
  const taskIndex = getTaskIndexById(taskId);
  const task = Object.values(tasksData)[taskIndex];
  const oldStatus = task.status;

  updateTaskStatus(taskIndex, newStatus);
  updateTaskStatusInFirebase(taskId, newStatus);
  moveTaskCardInDOM(taskId, newStatus);

  // Prüfe und aktualisiere "No Tasks"-Meldungen
  const statusContainers = getStatusContainers();
  Object.keys(statusContainers).forEach(status => {
    checkAndUpdateNoTasksMessage(statusContainers[status]);
  });

  resetContainerHighlight(event);
}

function moveTaskCardInDOM(taskId, newStatus) {
  const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (taskCard) {
    taskCard.remove();

    // Finde den neuen Container
    const statusContainers = getStatusContainers();
    const newContainer = statusContainers[newStatus];

    if (newContainer) {
      newContainer.appendChild(taskCard);

      // Leere Nachricht entfernen, falls vorhanden
      const noTasksMessage = newContainer.querySelector('.no-tasks-message');
      if (noTasksMessage) {
        noTasksMessage.remove();
      }
    }
  }
}

// Event, um beim Ende des Draggens alles zurückzusetzen
document.addEventListener('dragend', () => {
  removeAllDashedBoxes();
});

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
  const progressText = taskCard.querySelector('.taskcard-subtask p'); // Richtiges Element auswählen

  const completedCount = task.subtasks.filter(subtask => subtask.completed).length;
  const totalSubtasks = task.subtasks.length;

  const progressPercentage = totalSubtasks > 0 ? (completedCount / totalSubtasks) * 100 : 0;

  if (progressBar) progressBar.style.width = `${progressPercentage}%`;
  if (progressText) progressText.textContent = `${completedCount}/${totalSubtasks} Subtasks`;
}

function handleSubtaskCheckboxChange(event, task, subtaskIndex) {
  const isChecked = event.target.checked;
  task.subtasks[subtaskIndex].completed = isChecked;

  updateSubtaskInFirebase(task.id, subtaskIndex, isChecked);
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

function openAddTask(status) {
  selectedTaskStatus = status;
  let contentRef = document.getElementById('boardAddTask');
  contentRef.style.display = 'flex';
}

function closeAddTask() {
  let contentRef = document.getElementById('boardAddTask');
  
  contentRef.style.display = 'none';
}

async function deleteTask(taskId, taskStatus) {
  try {
    const taskPath = `${BASE_URL}tasks/${taskId}.json`;

    const response = await fetch(taskPath, {
      method: "DELETE",
    });

    tasksData = tasksData.filter(task => task.id !== taskId);

    const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
    if (taskCard) {
      taskCard.remove();
    }

    const statusContainers = getStatusContainers(); // Hole alle Status-Container
    if (statusContainers && statusContainers[taskStatus]) {
      addNoTasksMessage(statusContainers);
    }

    closeTaskDetail();
  } catch (error) {
    console.error("Fehler beim Löschen der Task:", error);
  }
}
