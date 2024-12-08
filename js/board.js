function initBoard() {
    includeHTML()
    renderTasks();
    console.log(myTasks);
    
}

let myTasks = [
    {
      "title": "Projektplan erstellen",
      "description": "Einen vollständigen Projektplan für das neue IT-Projekt erstellen.",
      "assignedTo": "Max Mustermann",
      "dueDate": "2024-12-15",
      "priority": "Urgent",
      "category": "User Story",
      "subtasks": [
        "Anforderungen sammeln",
        "Zeitplan erstellen",
        "Ressourcen planen"
      ]
    },
    {
      "title": "Marketingstrategie entwickeln",
      "description": "Strategie für das neue Produkt ausarbeiten.",
      "assignedTo": "Anna Schmidt",
      "dueDate": "2024-12-20",
      "priority": "Medium",
      "category": "Marketing",
      "subtasks": [
        "Wettbewerbsanalyse",
        "Zielgruppen definieren",
        "Budgetplanung"
      ]
    }
  ]

  let priorityIcons = {
    Urgent: "./assets/img/urgent_icon.png",
    Medium: "./assets/img/medium_icon.png",
    Low: "./assets/img/low_icon.png"
  };

  function renderTasks() {
    let contentRef = document.getElementById('todo');
    contentRef.innerHTML = "";

    for (let indexTask = 0; indexTask < myTasks.length; indexTask++) {
        let task = myTasks[indexTask];
        contentRef.innerHTML += getTaskCardTemplate(task);
    }
  }