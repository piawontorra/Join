/**
 * Toggles the visibility of the "Move To" menu popup for a task card.
 * Hides other open popups when displaying the selected one.
 *
 * @param {Event} event - The event object triggered by user interaction.
 */
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
        menuPopUp.addEventListener("click", (e) => e.stopPropagation());
    }
}

document.addEventListener("click", () => {
    document.querySelectorAll(".task-card-menu-pop-up").forEach(popup => {
        popup.style.display = "none";
    });
});

/**
 * Moves a task to a new category and updates its status in the backend.
 *
 * @param {Event} event - The event object triggered by user interaction.
 * @param {string} taskId - The ID of the task to be moved.
 * @param {string} newStatus - The new status/category to move the task to.
 */
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

/**
 * Retrieves the DOM element representing the task card with the given ID.
 *
 * @param {string} taskId - The ID of the task.
 * @returns {Element|null} The task card element or null if not found.
 */
function getTaskCard(taskId) {
    return document.querySelector(`.task-card[data-task-id="${taskId}"]`);
}

/**
 * Retrieves the container of the specified task card.
 *
 * @param {Element} taskCard - The task card DOM element.
 * @returns {Element|null} The container of the task card or null if not found.
 */
function getTaskContainer(taskCard) {
    return taskCard.closest('.task-content-split');
}

/**
 * Retrieves the container element for the given status.
 *
 * @param {string} newStatus - The new status/category.
 * @returns {Element|null} The container element for the given status or null if not found.
 */
function getNewContainer(newStatus) {
    const statusContainers = getStatusContainers();
    return statusContainers[newStatus];
}

/**
 * Updates the task's status in the backend and moves it to the new container.
 *
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStatus - The new status/category for the task.
 * @param {Element} taskCard - The task card DOM element.
 * @param {Element} currentContainer - The current container of the task card.
 * @param {Element} newContainer - The new container for the task card.
 */
async function updateTaskStatusAndMove(taskId, newStatus, taskCard, currentContainer, newContainer) {
    await updateTaskStatusInFirebase(taskId, newStatus);
    moveTaskCardToContainer(taskCard, newContainer);
    updateNoTasksMessages(currentContainer, newContainer);
}

/**
 * Moves a task card to the specified container.
 *
 * @param {Element} taskCard - The task card DOM element.
 * @param {Element} newContainer - The new container for the task card.
 */
function moveTaskCardToContainer(taskCard, newContainer) {
    newContainer.appendChild(taskCard);
}

/**
 * Updates the "No Tasks" messages for the current and new containers, if necessary.
 *
 * @param {Element} currentContainer - The current container of the task card.
 * @param {Element} newContainer - The new container for the task card.
 */
function updateNoTasksMessages(currentContainer, newContainer) {
    checkAndUpdateNoTasksMessage(currentContainer);
    checkAndUpdateNoTasksMessage(newContainer);
}

/**
 * Closes the "Move To" menu popup for a task card.
 *
 * @param {Event} event - The event object triggered by user interaction.
 */
function closeTaskCardMenu(event) {
    const taskCardMenu = event.target.closest(".task-card-menu-pop-up");
    if (taskCardMenu) {
        taskCardMenu.style.display = "none";
    }
}

