function initBoard() {
    includeHTML()
    renderTasks();
    console.log(myTasks);
}

let myTasks = [
  {
      "title": "Projektplan erstellen",
      "description": "Einen vollständigen Projektplan für das neue IT-Projekt erstellen.",
      "assignedTo": [
          "Max Mustermann",
          "Cristiano Ronaldo",
          "Lionel Messi"
      ],
      "dueDate": "2024-12-15",
      "priority": "Urgent",
      "category": "User Story",
      "subtasks": [
          "Anforderungen sammeln",
          "Zeitplan erstellen",
          "Ressourcen planen"
      ],
      "status": "todo" // status möglichkeit sind vier stück "todo", "in-progress", "await-feedback" und "done"
  },
  {
      "title": "Kochwelt Page & Recipe Recommender",
      "description": "Build start page with recipe recommendation.",
      "assignedTo": [
          "Emmanuel Mauer",
          "Marcel Bauer",
          "Anton Mayer"
      ],
      "dueDate": "10/05/2023",
      "priority": "Medium",
      "category": "User Story",
      "subtasks": [
          "Implement Recipe Recommendation",
          "Start Page Layout"
      ],
      "status": "await-feedback"
  }
];

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

function renderAllTasks(statusContainers) {
  for (let i = 0; i < myTasks.length; i++) {
      const task = myTasks[i];
      if (statusContainers[task.status]) {
          statusContainers[task.status].innerHTML += getTaskCardTemplate(task);
      } else {
          console.warn(`Unbekannter Status: ${task.status}`);
      }
  }
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

function allowDrop(event) {
  event.preventDefault();

  const targetContainer = event.target.closest('.task-content-split');
  if (targetContainer) {
      targetContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
      targetContainer.style.borderRadius = '20px';
  }
}

function dragTask(event) {
  const taskId = event.target.getAttribute('data-task-id');
  event.dataTransfer.setData('taskId', taskId);
}

function dropTask(event, newStatus) {
  event.preventDefault();

  const taskId = event.dataTransfer.getData('taskId');
  const taskIndex = getTaskIndexById(taskId);
  
  if (taskIndex === -1) {
      console.warn(`Aufgabe mit ID ${taskId} nicht gefunden.`);
      return;
  }

  resetContainerHighlight(event);
  updateTaskStatus(taskIndex, newStatus);
  renderTaskInContainer(event, taskIndex);
  renderTasks();
}

function getTaskIndexById(taskId) {
  return myTasks.findIndex(task => task.title === taskId);
}

function resetContainerHighlight(event) {
  const targetContainer = event.target.closest('.task-content-split');
  if (targetContainer) {
      targetContainer.style.backgroundColor = '';
  }
}

function updateTaskStatus(taskIndex, newStatus) {
  myTasks[taskIndex].status = newStatus;
}

function renderTaskInContainer(event, taskIndex) {
  const targetTaskContainer = event.target.closest('.task-content-split');
  if (targetTaskContainer) {
      targetTaskContainer.innerHTML += getTaskCardTemplate(myTasks[taskIndex]);
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

function openTaskDetail(taskTitle) {
  // Aufgabe anhand des Titels finden
  const task = myTasks.find(t => t.title === taskTitle);

  if (!task) {
      console.warn(`Aufgabe mit Titel "${taskTitle}" nicht gefunden.`);
      return;
  }

  // Detailansicht befüllen
  const detailHTML = getDetailTaskCardTemplate(task);
  document.getElementById('taskDetail').innerHTML = detailHTML;

  // Modal anzeigen
  const modal = document.getElementById('taskDetailModal');
  modal.style.display = 'flex';
}


function closeTaskDetail() {
  const modal = document.getElementById('taskDetailModal');
  modal.style.display = 'none';
}

