function dragTask(taskId) {
  setDraggedElement(taskId);
  hideAllNoTasksMessages();
  highlightDropTargets(taskId);
}

function setDraggedElement(taskId) {
  draggedElementId = taskId;
}

function hideAllNoTasksMessages() {
  const noTasksMessages = document.querySelectorAll('.no-tasks-message');
  noTasksMessages.forEach(message => {
      message.style.display = 'none';
  });
}

function highlightDropTargets(taskId) {
  const task = findTaskById(taskId);
  if (task) {
      highlightContainersExceptCurrent(task.status);
  }
}

function findTaskById(taskId) {
  return Object.values(tasksData).find(task => task.id === taskId);
}

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
}
  
function allowDrop(event) {
  event.preventDefault();
}
  
function showDashedBox(container) {
  const dashedBox = document.createElement('div');
  dashedBox.className = 'dashed-box';
  dashedBox.style.border = '2px dashed #aaa';
  dashedBox.style.height = '100px';
  dashedBox.style.margin = '10px 0';
  dashedBox.dataset.dashedBox = 'true';
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
  updateTaskStatus(taskIndex, newStatus);
  updateTaskStatusInFirebase(taskId, newStatus);
  moveTaskCardInDOM(taskId, newStatus);

  const statusContainers = getStatusContainers();
  Object.keys(statusContainers).forEach(status => {
    checkAndUpdateNoTasksMessage(statusContainers[status]);
  });
  resetContainerHighlight(event);
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

function resetContainerHighlight(event) {
  const targetContainer = event.target.closest('.task-content-split');
  if (targetContainer) {
      targetContainer.style.backgroundColor = '';
  }
}
  
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