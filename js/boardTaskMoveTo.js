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
    event.stopPropagation(); // Verhindert unerwünschte Ereignisweiterleitung
    
    // Task verschieben
    const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
    if (taskCard) {
        const currentContainer = taskCard.closest('.task-content-split');
        const statusContainers = getStatusContainers();
        const newContainer = statusContainers[newStatus];

        if (newContainer) {
            await updateTaskStatusInFirebase(taskId, newStatus);

            newContainer.appendChild(taskCard);

            checkAndUpdateNoTasksMessage(currentContainer);
            checkAndUpdateNoTasksMessage(newContainer);
        }
    }

    // Menü schließen
    const taskCardMenu = event.target.closest(".task-card-menu-pop-up");
    if (taskCardMenu) {
        taskCardMenu.style.display = "none";
    }
}
