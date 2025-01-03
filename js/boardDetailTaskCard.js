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

function handleSubtaskCheckboxChange(event, task, subtaskIndex) {
  const isChecked = event.target.checked;
  task.subtasks[subtaskIndex].completed = isChecked;
  
  updateSubtaskInFirebase(task.id, subtaskIndex, isChecked);
  updateProgressBar(task);
}

async function updateSubtaskInFirebase(taskId, subtaskIndex, completed) {
  const path = buildFirebasePath(taskId, subtaskIndex);
  const updateData = buildUpdateData(completed);

  try {
      await sendFirebasePatchRequest(path, updateData);
  } catch (error) {
      logFirebaseUpdateError(error);
  }
}

function buildFirebasePath(taskId, subtaskIndex) {
  return `tasks/${taskId}/subtasks/${subtaskIndex}`;
}

function buildUpdateData(completed) {
  return { completed: completed };
}

async function sendFirebasePatchRequest(path, updateData) {
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
}

function logFirebaseUpdateError(error) {
  console.error("Fehler beim Aktualisieren der Subtask in Firebase:", error);
}

// Hauptfunktion: Löscht eine Aufgabe in Firebase
async function deleteTask(taskId, taskStatus) {
  try {
      await deleteTaskFromFirebase(taskId);
      updateLocalDataAfterDeletion(taskId, taskStatus);
      closeTaskDetail();
  } catch (error) {
      logTaskDeletionError(error);
  }
}

// Hilfsfunktion: Löscht eine Aufgabe in Firebase
async function deleteTaskFromFirebase(taskId) {
  const taskPath = `${BASE_URL}tasks/${taskId}.json`;
  const response = await fetch(taskPath, { method: "DELETE" });
  if (!response.ok) {
      throw new Error("Fehler beim Löschen der Task in Firebase");
  }
}

// Hilfsfunktion: Aktualisiert lokale Daten und das DOM nach dem Löschen
function updateLocalDataAfterDeletion(taskId, taskStatus) {
  removeTaskFromLocalData(taskId);
  removeTaskCardFromDOM(taskId);

  const statusContainers = getStatusContainers();
  if (statusContainers && statusContainers[taskStatus]) {
      addNoTasksMessage(statusContainers);
  }
}

// Hilfsfunktion: Entfernt eine Aufgabe aus den lokalen Daten
function removeTaskFromLocalData(taskId) {
  tasksData = tasksData.filter(task => task.id !== taskId);
}

// Hilfsfunktion: Entfernt die Task-Karte aus dem DOM
function removeTaskCardFromDOM(taskId) {
  const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (taskCard) {
      taskCard.remove();
  }
}

// Hilfsfunktion: Loggt Fehler beim Löschen der Aufgabe
function logTaskDeletionError(error) {
  console.error("Fehler beim Löschen der Task:", error);
}