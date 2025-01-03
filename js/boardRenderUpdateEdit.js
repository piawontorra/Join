async function renderTaskEditor(stringTask) {
    let task = JSON.parse(stringTask);
    currentTask = task;
    console.log(currentTask);

    let contentRef = document.getElementById('editContainer');
    let taskCard = document.getElementById('taskDetailCard');
    contentRef.innerHTML = "";
    taskCard.style.display = 'none';
    contentRef.style.display = 'flex';
    await initAddTask();
    contentRef.innerHTML = getTaskEditorTemplate(task);

    await renderEditorAssignedUsers(task);
    await renderEditorSubtasks();
}

async function loadEditorContactData(task) {
    try {
        let assignedUserIds = [];

        if (currentTask.assignedTo && currentTask.assignedTo.length > 0) {
            assignedUserIds = currentTask.assignedTo.map(id => String(id));
        }

        renderEditorUsers(contacts, assignedUserIds);
        renderEditorAssignedUsers(currentTask);
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

function updateAssignedUsers(userId, isChecked) {
    if (isChecked) {
        if (!currentTask.assignedTo.includes(userId)) {
            currentTask.assignedTo.push(userId);
        }
    } else {
        currentTask.assignedTo = currentTask.assignedTo.filter(id => id !== userId);
    }
}

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

async function renderEditorAssignedUsers(task) {
    const assignedUserData = await getEditorAssignedUserInitialsAndColor(task.assignedTo || []);
    let assignedToHTML = assignedUserData.length > 0
        ? assignedUserData
            .map(user =>
                `<div class="editor-task-assigned-to">
                    <div class="detail-task-user-icon" style="background-color: ${user.color};">
                        ${user.initials}
                    </div>
                </div>`
            )
            .join("")
        : "";

    document.getElementById("assignedUsers").innerHTML = assignedToHTML;
}

async function renderEditorSubtasks() {
    const subtaskContainer = document.getElementById('subtask');
    subtaskContainer.innerHTML = '';

    if (currentTask.subtasks && currentTask.subtasks.length > 0) {
        for (let i = 0; i < currentTask.subtasks.length; i++) {
            const subtask = currentTask.subtasks[i];
            console.log(subtask);
            
            subtaskContainer.innerHTML += getEditorSubtaskTemplate(subtask, i);
        }
    }
}

function updateCurrentTask(event) {
    console.log("updateCurrentTask triggered");
    event.preventDefault();

    if (!validateInputs()) return;

    const subtasks = getSubtasks();
    assignTaskProperties(subtasks);
    updateTaskInFirebase(currentTask);
}

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

function updateLocalTasksData(task) {
    const existingTask = tasksData.find(t => t.id === task.id);
    if (existingTask) {
        Object.assign(existingTask, task);
    } else {
        console.warn(`Task with ID ${task.id} not found in tasksData.`);
    }
}

function postUpdateActions(task) {
    refreshTaskCard(task);
    openTaskDetail(task.id);
    closeTaskEditor();
}

async function refreshTaskCard(task) {
    const taskCard = document.querySelector(`.task-card[data-task-id="${task.id}"]`);
    const newTaskCardHTML = await getTaskCardTemplate(task);
    taskCard.outerHTML = newTaskCardHTML;
}