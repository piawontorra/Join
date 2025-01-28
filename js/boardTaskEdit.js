let currentTask = null;

/**
 * Handles user click events in the editor, toggling selection of a user for task assignment.
 *
 * @param {number} userId - The ID of the user being clicked.
 */
function handleEditorUserClick(userId) {
    const userElement = getUserElement(userId);
    const checkbox = getCheckbox(userId);

    ensureAssignedToExists();

    if (isUserSelected(userElement)) {
        deselectUser(userElement, checkbox, userId);
    } else {
        selectUser(userElement, checkbox, userId);
    }

    renderEditorAssignedUsers(currentTask);
}

/**
 * Retrieves the DOM element of a user by their ID.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Element|null} The DOM element of the user, or null if not found.
 */
function getUserElement(userId) {
    return document.getElementById(`user-${userId}`);
}

/**
 * Retrieves the checkbox element of a user by their ID.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Element|null} The checkbox element of the user, or null if not found.
 */
function getCheckbox(userId) {
    return document.getElementById(`select-${userId}`);
}

/**
 * Ensures the `assignedTo` property exists in the `currentTask` object.
 */
function ensureAssignedToExists() {
    if (!currentTask.assignedTo) {
        currentTask.assignedTo = [];
    }
}

/**
 * Checks if a user is currently selected.
 *
 * @param {Element} userElement - The DOM element of the user.
 * @returns {boolean} True if the user is selected, false otherwise.
 */
function isUserSelected(userElement) {
    return userElement.classList.contains("selected");
}

/**
 * Deselects a user, removing them from the task's assigned list.
 *
 * @param {Element} userElement - The DOM element of the user.
 * @param {Element} checkbox - The checkbox element of the user.
 * @param {number} userId - The ID of the user.
 */
function deselectUser(userElement, checkbox, userId) {
    userElement.classList.remove("selected");
    checkbox.checked = false;
    currentTask.assignedTo = currentTask.assignedTo.filter(id => id !== userId);
}

/**
 * Selects a user, adding them to the task's assigned list.
 *
 * @param {Element} userElement - The DOM element of the user.
 * @param {Element} checkbox - The checkbox element of the user.
 * @param {number} userId - The ID of the user.
 */
function selectUser(userElement, checkbox, userId) {
    userElement.classList.add("selected");
    checkbox.checked = true;
    if (!currentTask.assignedTo.includes(userId)) {
        currentTask.assignedTo.push(userId);
    }
}

/**
 * Handles checkbox state changes for user assignment.
 *
 * @param {number} userId - The ID of the user.
 * @param {boolean} isChecked - Whether the checkbox is checked.
 */
function handleEditorCheckboxChange(userId, isChecked) {
    userId = Number(userId);
    ensureAssignedToExists();
    updateAssignedUsers(userId, isChecked);
    updateUserElementClass(userId, isChecked);
    renderEditorAssignedUsers(currentTask);
}

/**
 * Retrieves user initials and color for assigned users.
 *
 * @param {number[]} assignedUserIds - The IDs of the assigned users.
 * @returns {Object[]} An array of objects containing initials, color, and name for each user.
 */
async function getEditorAssignedUserInitialsAndColor(assignedUserIds) {
    return assignedUserIds.map(userId => {
        const contact = contacts[userId];

        if (!contact) return null;

        return {
            initials: getInitials(contact.name),
            color: contact.userColor,
            name: contact.name
        };
    }).filter(Boolean);
}

/**
 * Toggles the completion status of a subtask.
 *
 * @param {number} index - The index of the subtask to toggle.
 */
function toggleEditorSubtaskCompletion(index) {
    currentTask.subtasks[index].completed = !currentTask.subtasks[index].completed;
    renderEditorSubtasks();
}

/**
 * Deletes a subtask at the specified index.
 *
 * @param {number} i - The index of the subtask to delete.
 */
function deleteEditorSubtask(i) {
    currentTask.subtasks.splice(i, 1);
    renderEditorSubtasks();
}

/**
 * Enables editing mode for a specific subtask.
 *
 * @param {number} i - The index of the subtask to edit.
 */
function editEditorSubtask(i) {
    const subtaskInput = document.getElementById(`subtaskList${i}`);
    const editContainer = document.getElementById(`edit-images${i}`);
    const mainContainer = document.getElementById(`mainSubtask-container${i}`);

    subtaskInput.readOnly = false;
    subtaskInput.focus();

    editContainer.innerHTML = editEditorSubtaskHTML(i);
    mainContainer.classList.remove('subtask-list');
    mainContainer.classList.add('edit-subtask-list');
    editContainer.classList.add('flex');
}

/**
* Saves the edited subtask and re-renders the subtasks list.
* 
* @param {number} i - The index of the subtask to be updated.
*/
function checkEditorSubtask(i) {
    const subtaskInputContainer = document.getElementById(`mainSubtask-container${i}`)
    const subtaskInput = document.getElementById(`subtaskList${i}`);
    const subtaskText = subtaskInput.value;
  
    if (subtaskText.trim() === '') {
      subtaskInputContainer.style.borderColor = 'red';
    } else {
      subtaskInputContainer.style.borderColor = '';
      currentTask.subtasks[i].text = subtaskInput.value;
      renderEditorSubtasks();
    }
  }

/**
 * Adds a new subtask to the task.
 */
function addEditorSubtask() {
    const input = document.getElementById('inputSubtask').value;
    if (input.trim() === '') {
        document.getElementById('inputSubtask').placeholder = 'Please enter text!';
        return;
    }

    if (!currentTask.subtasks) {
        currentTask.subtasks = [];
    }

    currentTask.subtasks.push({ text: input, completed: false });
    renderEditorSubtasks();
    document.getElementById('inputSubtask').value = '';
    resetButtons();
}

/**
 * Handles the "Enter" key press for adding a new subtask.
 *
 * @param {Event} event - The keypress event.
 */
function handleKeyPressEditor(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addEditorSubtask();
    }
}

/**
 * Handles the "Enter" key press for editing a subtask.
 *
 * @param {Event} event - The keypress event.
 * @param {number} i - The index of the subtask being edited.
 */
function handleKeyPressEditEditor(event, i) {
    if (event.key === "Enter") {
        event.preventDefault();
        checkEditorSubtask(i);
    }
}

/**
 * Closes the task editor and resets the UI.
 */
function closeTaskEditorSubmit() {
    const contentRef = document.getElementById('editContainer');
    const taskCard = document.getElementById('taskDetailCard');
    contentRef.innerHTML = "";
    taskCard.style.display = 'block';
    contentRef.style.display = 'none';
}

/**
 * Closes the task editor with an animation and also closes the task detail view.
 */
function closeTaskEditor() {
    const contentRef = document.getElementById('editContainer');
    const taskCard = document.getElementById('taskDetailCard');
    const modal = document.getElementById('taskDetailModal');
    const content = modal.querySelector('.task-detail-content');

    animateTaskEditorClose(contentRef);
    closeTaskDetailView(modal, content);
    resetTaskEditorAfterAnimation(contentRef, taskCard, 900);
}

/**
 * Animates the closing of the task editor.
 * 
 * @param {HTMLElement} contentRef - The content container of the task editor.
 */
function animateTaskEditorClose(contentRef) {
    contentRef.style.animation = "myAnimOut 1s ease 0s 1 normal forwards";
}

/**
 * Closes the task detail view with a delay to match the animation.
 * 
 * @param {HTMLElement} modal - The modal element containing the task details.
 * @param {HTMLElement} content - The content element inside the modal.
 */
function closeTaskDetailView(modal, content) {
    content.classList.add('hidden');
    setTimeout(() => {
        modal.style.display = 'none';
        content.classList.remove('hidden');
    }, 900);
}

/**
 * Resets the task editor UI after the closing animation finishes.
 * 
 * @param {HTMLElement} contentRef - The content container of the task editor.
 * @param {HTMLElement} taskCard - The task card element to reset.
 * @param {number} delay - The delay in milliseconds before resetting the UI.
 */
function resetTaskEditorAfterAnimation(contentRef, taskCard, delay) {
    setTimeout(() => {
        contentRef.style.animation = "";
        contentRef.innerHTML = "";
        taskCard.style.display = 'block';
        contentRef.style.display = 'none';
    }, delay);
}

/**
 * Validates task input fields for title and due date.
 *
 * @returns {boolean} True if all inputs are valid, false otherwise.
 */
function validateInputs() {
    const title = document.getElementById('inputTitle').value.trim();
    const dueDate = document.getElementById('inputDueDate').value.trim();
    
    const isValidTitle = validateTitle(title);
    const isValidDueDate = validateDueDate(dueDate);

    return isValidTitle && isValidDueDate;
}

/**
 * Validates the task title input field.
 *
 * @param {string} title - The task title.
 * @returns {boolean} True if the title is valid, false otherwise.
 */
function validateTitle(title) {
    const titleError = document.getElementById('inputTitleError');
    if (!title) {
        titleError.style.display = 'block';
        return false;
    }
    titleError.style.display = 'none';
    return true;
}

/**
 * Validates the due date input field.
 *
 * @param {string} dueDate - The task due date.
 * @returns {boolean} True if the due date is valid, false otherwise.
 */
function validateDueDate(dueDate) {
    const dueDateError = document.getElementById('inputDueDateError');
    if (!dueDate) {
        dueDateError.style.display = 'block';
        return false;
    }
    dueDateError.style.display = 'none';
    return true;
}

/**
 * Retrieves all subtasks from the DOM.
 *
 * @returns {Object[]} An array of subtask objects containing text and completion status.
 */
function getSubtasks() {
    const subtasks = [];
    document.querySelectorAll('.created-subtasks-container input').forEach((input, index) => {
        subtasks.push({
            completed: currentTask.subtasks[index]?.completed || false,
            text: input.value.trim()
        });
    });
    return subtasks;
}

/**
 * Assigns updated properties to the current task object.
 *
 * @param {Object[]} subtasks - The subtasks to assign to the task.
 */
function assignTaskProperties(subtasks) {
    currentTask.title = document.getElementById('inputTitle').value.trim();
    currentTask.description = document.getElementById('inputDescription').value.trim();
    currentTask.dueDate = document.getElementById('inputDueDate').value.trim();
    currentTask.priority = getSelectedPriority();
    currentTask.assignedTo = getAssignedTo();
    currentTask.subtasks = subtasks;
}

/**
 * Retrieves the list of assigned users for the current task.
 *
 * @returns {number[]} An array of user IDs.
 */
function getAssignedTo() {
    return currentTask.assignedTo && currentTask.assignedTo.length > 0
        ? currentTask.assignedTo
        : [];
}

/**
 * Determines the selected priority level for the task.
 *
 * @returns {string|null} The selected priority level ("Urgent", "Medium", "Low"), or null if none is selected.
 */
function getSelectedPriority() {
    if (document.getElementById('urgentPrio').classList.contains('selected')) return 'Urgent';
    if (document.getElementById('mediumPrio').classList.contains('selected')) return 'Medium';
    if (document.getElementById('lowPrio').classList.contains('selected')) return 'Low';
    return null;
}