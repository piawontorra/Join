/**
 * Opens the task detail modal and displays the details of the specified task.
 * 
 * @param {number|string} taskId - The ID of the task to display.
 */
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

/**
 * Closes the task detail modal with a fade-out animation.
 */
function closeTaskDetail() {
  const modal = document.getElementById('taskDetailModal');
  const content = modal.querySelector('.task-detail-content');

  content.classList.add('hidden');

  setTimeout(() => {
      modal.style.display = 'none';
      content.classList.remove('hidden');
  }, 900);
}

/**
 * Handles changes to a subtask's checkbox and updates its completion status.
 * 
 * @param {Event} event - The checkbox change event.
 * @param {object} task - The task object containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask in the task's subtasks array.
 */
function handleSubtaskCheckboxChange(event, task, subtaskIndex) {
  const isChecked = event.target.checked;
  task.subtasks[subtaskIndex].completed = isChecked;

  updateSubtaskInFirebase(task.id, subtaskIndex, isChecked);
  updateProgressBar(task);
}

/**
 * Updates a subtask's completion status in Firebase.
 * 
 * @param {number} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask to update.
 * @param {boolean} completed - The new completion status of the subtask.
 */
async function updateSubtaskInFirebase(taskId, subtaskIndex, completed) {
  const path = buildFirebasePath(taskId, subtaskIndex);
  const updateData = buildUpdateData(completed);

  try {
      await sendFirebasePatchRequest(path, updateData);
  } catch (error) {
      logFirebaseUpdateError(error);
  }
}

/**
 * Builds the Firebase path for a specific subtask.
 * 
 * @param {number} taskId - The ID of the task.
 * @param {number} subtaskIndex - The index of the subtask.
 * @returns {string} The Firebase path for the subtask.
 */
function buildFirebasePath(taskId, subtaskIndex) {
  return `tasks/${taskId}/subtasks/${subtaskIndex}`;
}

/**
 * Builds the data payload for updating a subtask in Firebase.
 * 
 * @param {boolean} completed - The new completion status of the subtask.
 * @returns {object} The data payload for the update.
 */
function buildUpdateData(completed) {
  return { completed: completed };
}

/**
 * Sends a PATCH request to update a subtask in Firebase.
 * 
 * @param {string} path - The Firebase path for the subtask.
 * @param {object} updateData - The data payload for the update.
 * @throws Will throw an error if the request fails.
 */
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

/**
 * Logs an error when updating a subtask in Firebase fails.
 * 
 * @param {Error} error - The error object.
 */
function logFirebaseUpdateError(error) {
  console.error("Fehler beim Aktualisieren der Subtask in Firebase:", error);
}

/**
 * Deletes a task by removing it from Firebase and the local data, then closes the task detail modal.
 * 
 * @param {number} taskId - The ID of the task to delete.
 * @param {string} taskStatus - The current status of the task.
 */
async function deleteTask(taskId, taskStatus) {
  try {
      await deleteTaskFromFirebase(taskId);
      updateLocalDataAfterDeletion(taskId, taskStatus);
      closeTaskDetail();
  } catch (error) {
      logTaskDeletionError(error);
  }
}

/**
 * Deletes a task from Firebase.
 * 
 * @param {number} taskId - The ID of the task to delete.
 * @throws Will throw an error if the deletion fails.
 */
async function deleteTaskFromFirebase(taskId) {
  const taskPath = `${BASE_URL}tasks/${taskId}.json`;
  const response = await fetch(taskPath, { method: "DELETE" });
  if (!response.ok) {
      throw new Error("Fehler beim Löschen der Task in Firebase");
  }
}

/**
 * Updates local data after a task is deleted, removing it from the data and DOM.
 * 
 * @param {number} taskId - The ID of the deleted task.
 * @param {string} taskStatus - The status of the deleted task.
 */
function updateLocalDataAfterDeletion(taskId, taskStatus) {
  removeTaskFromLocalData(taskId);
  removeTaskCardFromDOM(taskId);

  const statusContainers = getStatusContainers();
  if (statusContainers && statusContainers[taskStatus]) {
      addNoTasksMessage(statusContainers);
  }
}

/**
 * Removes a task from the local data array.
 * 
 * @param {number} taskId - The ID of the task to remove.
 */
function removeTaskFromLocalData(taskId) {
  tasksData = tasksData.filter(task => task.id !== taskId);
}

/**
 * Removes a task card element from the DOM.
 * 
 * @param {number} taskId - The ID of the task card to remove.
 */
function removeTaskCardFromDOM(taskId) {
  const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (taskCard) {
      taskCard.remove();
  }
}

/**
 * Logs an error when task deletion fails.
 * 
 * @param {Error} error - The error object.
 */
function logTaskDeletionError(error) {
  console.error("Fehler beim Löschen der Task:", error);
}