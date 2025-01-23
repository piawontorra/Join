/**
 * Renders the task editor for a given task.
 * 
 * @param {string} stringTask - The stringified task object.
 */
async function renderTaskEditor(stringTask) {
    let task = JSON.parse(stringTask);
    currentTask = task;
    let contentRef = document.getElementById('editContainer');
    let taskCard = document.getElementById('taskDetailCard');
    contentRef.innerHTML = "";
    taskCard.style.display = 'none';
    contentRef.style.display = 'flex';
    await initAddTask();
    contentRef.innerHTML = getTaskEditorTemplate(task);

    await renderEditorAssignedUsers(task);
    await renderEditorSubtasks();
    initializeDatepicker();
}

/**
 * Loads contact data and prepares the editor with assigned users.
 * 
 * @param {object} task - The current task object.
 */
async function loadEditorContactData(task) {
    try {
        let assignedUserIds = [];

        if (currentTask.assignedTo && currentTask.assignedTo.length > 0) {
            assignedUserIds = currentTask.assignedTo.map(id => String(id));
        }

        renderEditorUsers(contacts, assignedUserIds);
        renderEditorAssignedUsers(currentTask);
    } catch (error) {
        console.error("Error loading contact data:", error);
    }
}

/**
 * Updates the assigned users list based on user selection.
 * 
 * @param {number} userId - The ID of the user.
 * @param {boolean} isChecked - Whether the user is selected or not.
 */
function updateAssignedUsers(userId, isChecked) {
    if (isChecked) {
        if (!currentTask.assignedTo.includes(userId)) {
            currentTask.assignedTo.push(userId);
        }
    } else {
        currentTask.assignedTo = currentTask.assignedTo.filter(id => id !== userId);
    }
}

/**
 * Updates the visual class of a user element based on selection.
 * 
 * @param {number} userId - The ID of the user.
 * @param {boolean} isChecked - Whether the user is selected or not.
 */
function updateUserElementClass(userId, isChecked) {
    const userElement = document.getElementById(`user-${userId}`);
    if (userElement) {
        if (isChecked) {
            userElement.classList.add('selected');
        } else {
            userElement.classList.remove('selected');
        }
    }
}

/**
 * Renders the list of users in the task editor.
 * 
 * @param {object} contacts - The list of contact objects.
 * @param {Array<string>} assignedUserIds - The IDs of assigned users.
 */
function renderEditorUsers(contacts, assignedUserIds) {
    let usersRef = document.getElementById('users');
    usersRef.innerHTML = '';

    let contactKeys = Object.keys(contacts);

    for (let i = 0; i < contactKeys.length; i++) {
        let key = contactKeys[i];
        let contact = contacts[key];
        let isChecked = assignedUserIds.includes(String(contact.userId));
        let contactTemplate = getEditorAssignedToTemplate(contact, isChecked);
        usersRef.innerHTML += contactTemplate;
    }
}

/**
 * Renders the assigned users in the task editor.
 * 
 * @param {object} task - The current task object.
 */
async function renderEditorAssignedUsers(task) {
    const assignedUserData = await getEditorAssignedUserInitialsAndColor(task.assignedTo || []);
    const assignedToHTML = generateAssignedUsersHTML(assignedUserData);
    document.getElementById("assignedUsers").innerHTML = assignedToHTML;
}

/**
 * Generates the HTML for the assigned users, including a "+X" badge if there are more than 4.
 * 
 * @param {Array} assignedUserData - List of user data with initials and color.
 * @returns {string} HTML string for the assigned users.
 */
function generateAssignedUsersHTML(assignedUserData) {
    return assignedUserData.length > 4
        ? generateLimitedUsersHTML(assignedUserData)
        : generateAllUsersHTML(assignedUserData);
}

/**
 * Generates the HTML for up to 4 assigned users with a "+X" badge for the rest.
 * 
 * @param {Array} assignedUserData - List of user data with initials and color.
 * @returns {string} HTML string for the first 4 users and the "+X" badge.
 */
function generateLimitedUsersHTML(assignedUserData) {
    const firstFourUsers = assignedUserData.slice(0, 4).map(generateUserHTML).join("");
    const remainingCount = assignedUserData.length - 4;
    const remainingBadge = generateRemainingBadgeHTML(remainingCount);
    return firstFourUsers + remainingBadge;
}

/**
 * Generates the HTML for all assigned users if there are 4 or fewer.
 * 
 * @param {Array} assignedUserData - List of user data with initials and color.
 * @returns {string} HTML string for all users.
 */
function generateAllUsersHTML(assignedUserData) {
    return assignedUserData.map(generateUserHTML).join("");
}

/**
 * Generates the HTML for a single user icon.
 * 
 * @param {object} user - User object containing initials and color.
 * @returns {string} HTML string for the user icon.
 */
function generateUserHTML(user) {
    return `
        <div class="editor-task-assigned-to">
            <div class="detail-task-user-icon" style="background-color: ${user.color};">
                ${user.initials}
            </div>
        </div>`;
}

/**
 * Generates the HTML for the "+X" badge showing the number of remaining users.
 * 
 * @param {number} remainingCount - Number of users beyond the first 4.
 * @returns {string} HTML string for the "+X" badge.
 */
function generateRemainingBadgeHTML(remainingCount) {
    return `
        <div class="editor-task-assigned-to">
            <div class="detail-task-user-icon" style="background-color: grey;">
                +${remainingCount}
            </div>
        </div>`;
}

/**
 * Renders the subtasks in the task editor.
 */
async function renderEditorSubtasks() {
    const subtaskContainer = document.getElementById('subtask');
    subtaskContainer.innerHTML = '';

    if (currentTask.subtasks && currentTask.subtasks.length > 0) {
        for (let i = 0; i < currentTask.subtasks.length; i++) {
            const subtask = currentTask.subtasks[i];
            subtaskContainer.innerHTML += getEditorSubtaskTemplate(subtask, i);
        }
    }
}

/**
 * Updates the current task with edited details.
 * 
 * @param {Event} event - The event triggered by form submission.
 */
function updateCurrentTask(event) {
    event.preventDefault();

    if (!validateInputs()) return;

    const subtasks = getSubtasks();
    assignTaskProperties(subtasks);
    updateTaskInFirebase(currentTask);
}

/**
 * Updates the task in Firebase Realtime Database.
 * 
 * @param {object} task - The task object to update.
 */
async function updateTaskInFirebase(task) {
    try {
        const taskUrl = `${BASE_URL}tasks/${task.id}.json`;
        await sendTaskToFirebase(taskUrl, task);
        updateLocalTasksData(task);
        postUpdateActions(task);
    } catch (error) {
        console.error('Error updating task in Firebase Realtime Database:', error);
    }
}

/**
 * Sends the updated task data to Firebase.
 * 
 * @param {string} url - The Firebase URL for the task.
 * @param {object} task - The task object to update.
 */
async function sendTaskToFirebase(url, task) {
    await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            category: task.category,
            priority: task.priority,
            assignedTo: task.assignedTo,
            subtasks: task.subtasks,
            status: task.status,
            id: task.id
        })
    });
}

/**
 * Updates the local tasks data with the updated task details.
 * 
 * @param {object} task - The updated task object.
 */
function updateLocalTasksData(task) {
    const existingTask = tasksData.find(t => t.id === task.id);
    if (existingTask) {
        Object.assign(existingTask, task);
    } else {
        console.warn(`Task with ID ${task.id} not found in tasksData.`);
    }
}

/**
 * Executes post-update actions such as refreshing the UI.
 * 
 * @param {object} task - The updated task object.
 */
function postUpdateActions(task) {
    refreshTaskCard(task);
    openTaskDetail(task.id);
    closeTaskEditorSubmit();
}

/**
 * Refreshes the task card in the UI after updating.
 * 
 * @param {object} task - The updated task object.
 */
async function refreshTaskCard(task) {
    const taskCard = document.querySelector(`.task-card[data-task-id="${task.id}"]`);
    const newTaskCardHTML = await getTaskCardTemplate(task);
    taskCard.outerHTML = newTaskCardHTML;
}
