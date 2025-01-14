function showMoveTo(event) {
    event.stopPropagation();
    const taskCard = event.target.closest(".task-card");
    const menuPopUp = taskCard.querySelector(".task-card-menu-pop-up");

    if (menuPopUp.style.display === "flex") {
        menuPopUp.style.display = "none";
    } else {
        document.querySelectorAll(".task-card-menu-pop-up").forEach(popup => {
            popup.style.display = "none";
        });

        menuPopUp.style.display = "flex";
    }
}

async function moveTaskToCategory(event, taskId, newStatus) {
    event.stopPropagation();
    
    const taskCard = getTaskCard(taskId);
    if (taskCard) {
        const currentContainer = getTaskContainer(taskCard);
        const newContainer = getNewContainer(newStatus);

        if (newContainer) {
            await updateTaskStatusAndMove(taskId, newStatus, taskCard, currentContainer, newContainer);
        }
    }

    closeTaskCardMenu(event);
}

function getTaskCard(taskId) {
    return document.querySelector(`.task-card[data-task-id="${taskId}"]`);
}

function getTaskContainer(taskCard) {
    return taskCard.closest('.task-content-split');
}

function getNewContainer(newStatus) {
    const statusContainers = getStatusContainers();
    return statusContainers[newStatus];
}

async function updateTaskStatusAndMove(taskId, newStatus, taskCard, currentContainer, newContainer) {
    await updateTaskStatusInFirebase(taskId, newStatus);
    moveTaskCardToContainer(taskCard, newContainer);
    updateNoTasksMessages(currentContainer, newContainer);
}

function moveTaskCardToContainer(taskCard, newContainer) {
    newContainer.appendChild(taskCard);
}

function updateNoTasksMessages(currentContainer, newContainer) {
    checkAndUpdateNoTasksMessage(currentContainer);
    checkAndUpdateNoTasksMessage(newContainer);
}

function closeTaskCardMenu(event) {
    const taskCardMenu = event.target.closest(".task-card-menu-pop-up");
    if (taskCardMenu) {
        taskCardMenu.style.display = "none";
    }
}
