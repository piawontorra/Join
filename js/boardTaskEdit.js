let currentTask = null;

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

function getUserElement(userId) {
    return document.getElementById(`user-${userId}`);
}

function getCheckbox(userId) {
    return document.getElementById(`select-${userId}`);
}

function ensureAssignedToExists() {
    if (!currentTask.assignedTo) {
        currentTask.assignedTo = [];
    }
}

function isUserSelected(userElement) {
    return userElement.classList.contains("selected");
}

function deselectUser(userElement, checkbox, userId) {
    userElement.classList.remove("selected");
    checkbox.checked = false;
    currentTask.assignedTo = currentTask.assignedTo.filter(id => id !== userId);
}

function selectUser(userElement, checkbox, userId) {
    userElement.classList.add("selected");
    checkbox.checked = true;
    if (!currentTask.assignedTo.includes(userId)) {
        currentTask.assignedTo.push(userId);
    }
}

function handleEditorCheckboxChange(userId, isChecked) {
    userId = Number(userId);
    ensureAssignedToExists();
    updateAssignedUsers(userId, isChecked);
    updateUserElementClass(userId, isChecked);
    renderEditorAssignedUsers(currentTask);
}

function ensureAssignedToExists() {
    if (!currentTask.assignedTo) {
        currentTask.assignedTo = [];
    }
}

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

function toggleEditorSubtaskCompletion(index) {
    currentTask.subtasks[index].completed = !currentTask.subtasks[index].completed;
    renderEditorSubtasks();
}

function deleteEditorSubtask(i) {
    currentTask.subtasks.splice(i, 1);
    renderEditorSubtasks();
}

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

function checkEditorSubtask(i) {
    const subtaskInput = document.getElementById(`subtaskList${i}`);
    currentTask.subtasks[i].text = subtaskInput.value; // Speichere Änderungen
    renderEditorSubtasks(); // Aktualisiere die Anzeige
}

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

function handleKeyPressEditor(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addEditorSubtask();
    }
}
  
function handleKeyPressEditEditor(event, i) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkEditorSubtask(i);
    }
}

function closeTaskEditor() {
    let contentRef = document.getElementById('editContainer');
    let taskCard = document.getElementById('taskDetailCard');
    contentRef.innerHTML = "";
    taskCard.style.display = 'block';
    contentRef.style.display = 'none';
}

function validateInputs() {
    const title = document.getElementById('inputTitle').value.trim();
    const dueDate = document.getElementById('inputDueDate').value.trim();
    
    const isValidTitle = validateTitle(title);
    const isValidDueDate = validateDueDate(dueDate);

    return isValidTitle && isValidDueDate;
}

function validateTitle(title) {
    const titleError = document.getElementById('inputTitleError');
    if (!title) {
        titleError.style.display = 'block';
        return false;
    }
    titleError.style.display = 'none';
    return true;
}

function validateDueDate(dueDate) {
    const dueDateError = document.getElementById('inputDueDateError');
    if (!dueDate) {
        dueDateError.style.display = 'block';
        return false;
    }
    dueDateError.style.display = 'none';
    return true;
}

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

function assignTaskProperties(subtasks) {
    currentTask.title = document.getElementById('inputTitle').value.trim();
    currentTask.description = document.getElementById('inputDescription').value.trim();
    currentTask.dueDate = document.getElementById('inputDueDate').value.trim();
    currentTask.priority = getSelectedPriority();
    currentTask.assignedTo = getAssignedTo();
    currentTask.subtasks = subtasks;
}

function getAssignedTo() {
    return currentTask.assignedTo && currentTask.assignedTo.length > 0
        ? currentTask.assignedTo
        : [];
}

function getSelectedPriority() {
    if (document.getElementById('urgentPrio').classList.contains('selected')) return 'Urgent';
    if (document.getElementById('mediumPrio').classList.contains('selected')) return 'Medium';
    if (document.getElementById('lowPrio').classList.contains('selected')) return 'Low';
    return null;
}
