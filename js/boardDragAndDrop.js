/**
 * Initiates the drag operation for a task.
 * 
 * @param {string} taskId - The ID of the task being dragged.
 */
function dragTask(taskId) {
  setDraggedElement(taskId);
  hideAllNoTasksMessages();
  highlightDropTargets(taskId);
}

/**
 * Sets the ID of the currently dragged element.
 * 
 * @param {string} taskId - The ID of the dragged task.
 */
function setDraggedElement(taskId) {
  draggedElementId = taskId;
}

/**
 * Hides all "No Tasks" messages in the UI.
 */
function hideAllNoTasksMessages() {
  const noTasksMessages = document.querySelectorAll('.no-tasks-message');
  noTasksMessages.forEach(message => {
      message.style.display = 'none';
  });
}

/**
 * Displays all "No Tasks" messages in the UI.
 */
function showAllNoTasksMessages() {
  const noTasksMessages = document.querySelectorAll('.no-tasks-message');
  noTasksMessages.forEach(message => {
      message.style.display = 'flex';
  });
}

/**
 * Highlights the drop targets for the dragged task, excluding its current status.
 * 
 * @param {string} taskId - The ID of the dragged task.
 */
function highlightDropTargets(taskId) {
  const task = findTaskById(taskId);
  if (task) {
      highlightContainersExceptCurrent(task.status);
  }
}

/**
 * Finds a task by its ID.
 * 
 * @param {string} taskId - The ID of the task.
 * @returns {object|null} The task object if found, otherwise null.
 */
function findTaskById(taskId) {
  return Object.values(tasksData).find(task => task.id === taskId);
}

/**
 * Highlights all status containers except the one corresponding to the current task's status.
 * 
 * This function performs the following actions:
 * 1. Adds a dashed border to all status containers except the current one.
 * 2. Attaches `dragover` and `dragleave` event listeners to the containers:
 *    - `dragover`: Highlights the container under the mouse by changing the border color.
 *    - `dragleave`: Resets the border color when the mouse leaves the container.
 * 
 * @param {string} currentStatus - The current status of the task that is being dragged.
 */
function highlightContainersExceptCurrent(currentStatus) {
  const statusContainers = getStatusContainers();
  statusOrder.forEach(status => {
      if (status !== currentStatus) {
          const container = statusContainers[status];
          if (container) {
              showDashedBox(container);
          }
      }
  });

  Object.values(statusContainers).forEach(container => {
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragleave', handleDragLeave);
  });
}


/**
 * Handles the dragover event to highlight the nearest drop target.
 * 
 * @param {DragEvent} event - The dragover event.
 */
function handleDragOver(event) {
  event.preventDefault();
  const container = event.currentTarget;

  const dashedBox = container.querySelector('.dashed-box');
  if (dashedBox) {
    dashedBox.style.borderColor = '#26ace3';
  }
}

/**
 * Handles the dragleave event to reset the border color of a drop target.
 * 
 * @param {DragEvent} event - The dragleave event.
 */
function handleDragLeave(event) {
  const container = event.currentTarget;

  const dashedBox = container.querySelector('.dashed-box');
  if (dashedBox) {
    dashedBox.style.borderColor = '#aaa';
  }
}

/**
 * Allows the drop operation by preventing the default dragover behavior.
 * 
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Displays a dashed box in the specified container to indicate a valid drop target.
 * 
 * @param {HTMLElement} container - The container element.
 */
function showDashedBox(container) {
  const dashedBox = document.createElement('div');
  dashedBox.className = 'dashed-box';
  dashedBox.style.border = '2px dashed #aaa';
  dashedBox.style.height = '100px';
  dashedBox.style.margin = '10px 0';
  dashedBox.dataset.dashedBox = 'true';
  container.appendChild(dashedBox);
}

/**
 * Removes all dashed boxes from the UI.
 */
function removeAllDashedBoxes() {
  const dashedBoxes = document.querySelectorAll('.dashed-box');
  dashedBoxes.forEach(box => box.remove());
}

/**
 * Handles the drop operation for a task, updating its status and DOM location.
 * 
 * @param {DragEvent} event - The drop event.
 * @param {string} newStatus - The new status of the task.
 */
function dropTask(event, newStatus) {
  event.preventDefault();
  
  const taskId = draggedElementId;
  const taskIndex = getTaskIndexById(taskId);
  const task = Object.values(tasksData)[taskIndex];
  updateTaskStatus(taskIndex, newStatus);
  updateTaskStatusInFirebase(taskId, newStatus);
  moveTaskCardInDOM(taskId, newStatus);

  const statusContainers = getStatusContainers();
  Object.keys(statusContainers).forEach(status => {
    checkAndUpdateNoTasksMessage(statusContainers[status]);
  });

  showAllNoTasksMessages();
}

/**
 * Checks if a status container has no tasks and updates the "No Tasks" message accordingly.
 * 
 * @param {HTMLElement} container - The container element.
 */
function checkAndUpdateNoTasksMessage(container) {
    const taskCards = container.querySelectorAll('.task-card');

    if (taskCards.length === 0) {
        addNoTasksMessageMoveTo(container);
    } else {
        removeNoTasksMessage(container);
    }
}

/**
 * Adds a "No Tasks" message to the specified container.
 * 
 * @param {HTMLElement} container - The container element.
 */
function addNoTasksMessageMoveTo(container) {
    const noTasksMessage = container.querySelector('.no-tasks-message');
    if (!noTasksMessage) {
        const readableStatus = getReadableStatus(container.id);
        container.innerHTML = getNoTasksTemplate(readableStatus);
    }
}

/**
 * Removes the "No Tasks" message from the specified container.
 * 
 * @param {HTMLElement} container - The container element.
 */
function removeNoTasksMessage(container) {
    const noTasksMessage = container.querySelector('.no-tasks-message');
    if (noTasksMessage) {
        noTasksMessage.remove();
    }
}

/**
 * Converts a status ID to a human-readable status name.
 * 
 * @param {string} statusId - The status ID.
 * @returns {string} The human-readable status name.
 */
function getReadableStatus(statusId) {
    const statusMapping = {
        toDo: "To Do",
        inProgress: "In Progress",
        awaitFeedback: "Await Feedback",
        done: "Done",
    };
    return statusMapping[statusId];
}

/**
 * Moves a task card to a new status container in the DOM.
 * 
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status of the task.
 */
function moveTaskCardInDOM(taskId, newStatus) {
  const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
  if (taskCard) {
    taskCard.remove();
  
    const statusContainers = getStatusContainers();
    const newContainer = statusContainers[newStatus];
  
    if (newContainer) {
      newContainer.appendChild(taskCard);
  
      const noTasksMessage = newContainer.querySelector('.no-tasks-message');
      if (noTasksMessage) {
        noTasksMessage.remove();
      }
    }
  }
}

document.addEventListener('dragend', () => {
  removeAllDashedBoxes();
});

/**
 * Updates the status of a task locally.
 * 
 * @param {number} taskIndex - The index of the task in the local data.
 * @param {string} newStatus - The new status of the task.
 */
function updateTaskStatus(taskIndex, newStatus) {
  const task = Object.values(tasksData)[taskIndex];
  task.status = newStatus;
}

/**
 * Updates the task status in Firebase Realtime Database.
 * 
 * @param {string} taskId - The ID of the task.
 * @param {string} newStatus - The new status of the task.
 */
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
