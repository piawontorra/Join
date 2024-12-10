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
      "title": "Marketingstrategie entwickeln",
      "description": "Strategie für das neue Produkt ausarbeiten.",
      "assignedTo": [
          "Anna Schmidt",
          "Marco Reus"
      ],
      "dueDate": "2024-12-20",
      "priority": "Medium",
      "category": "Marketing",
      "subtasks": [
          "Wettbewerbsanalyse",
          "Zielgruppen definieren",
          "Budgetplanung"
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


