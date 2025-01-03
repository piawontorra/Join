let currentTask = null;

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

    await renderEditorAssignedUsers(task); // Zeige die zugewiesenen Benutzer an
    await renderEditorSubtasks(); // Zeige die Subtasks an
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

function handleEditorUserClick(userId) {
    const userElement = document.getElementById(`user-${userId}`);
    const checkbox = document.getElementById(`select-${userId}`);

    if (!currentTask.assignedTo) {
        currentTask.assignedTo = [];
    }

    if (userElement.classList.contains("selected")) {
        userElement.classList.remove("selected");
        checkbox.checked = false;
        currentTask.assignedTo = currentTask.assignedTo.filter(id => id !== userId);
    } else {
        userElement.classList.add("selected");
        checkbox.checked = true;

        if (!currentTask.assignedTo.includes(userId)) {
            currentTask.assignedTo.push(userId);
        }
    }

    renderEditorAssignedUsers(currentTask);
}

function handleEditorCheckboxChange(userId, isChecked) {
    userId = Number(userId);

    if (!currentTask.assignedTo) {
        currentTask.assignedTo = [];
    }
    if (isChecked) {
        if (!currentTask.assignedTo.includes(userId)) {
            currentTask.assignedTo.push(userId);
        }
    } else {
        currentTask.assignedTo = currentTask.assignedTo.filter(id => id !== userId);
    }

    const userElement = document.getElementById(`user-${userId}`);
    if (userElement) {
        if (isChecked) {
            userElement.classList.add('selected');
        } else {
            userElement.classList.remove('selected');
        }
    }

    renderEditorAssignedUsers(currentTask);
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

async function getEditorAssignedUserInitialsAndColor(assignedUserIds) {
    return assignedUserIds.map(userId => {
        const contact = contacts[userId]; // Kontakte aus der globalen Variable

        if (!contact) return null; // Falls der Benutzer nicht existiert

        return {
            initials: getInitials(contact.name), // Initialen berechnen
            color: contact.userColor, // Farbe des Kontakts
            name: contact.name // Vollständiger Name (optional)
        };
    }).filter(Boolean); // Entferne alle `null`-Werte
}

async function renderEditorSubtasks() {
    const subtaskContainer = document.getElementById('subtask');
    subtaskContainer.innerHTML = '';

    // Überprüfen, ob subtasks existieren und nicht leer sind
    if (currentTask.subtasks && currentTask.subtasks.length > 0) {
        for (let i = 0; i < currentTask.subtasks.length; i++) {
            const subtask = currentTask.subtasks[i];
            console.log(subtask);
            
            subtaskContainer.innerHTML += getEditorSubtaskTemplate(subtask, i);
        }
    }
}

function toggleEditorSubtaskCompletion(index) {
    currentTask.subtasks[index].completed = !currentTask.subtasks[index].completed;
    renderEditorSubtasks(); // Aktualisiere die Anzeige
}

function deleteEditorSubtask(i) {
    currentTask.subtasks.splice(i, 1); // Entferne Subtask
    renderEditorSubtasks(); // Aktualisiere die Anzeige
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

    currentTask.subtasks.push({ text: input, completed: false }); // Füge die Subtask hinzu
    renderEditorSubtasks(); // Aktualisiere die Anzeige
    document.getElementById('inputSubtask').value = ''; // Leere das Eingabefeld
    resetButtons(); // Setze die Buttons zurück
}

function closeTaskEditor() {
    let contentRef = document.getElementById('editContainer');
    let taskCard = document.getElementById('taskDetailCard');
    contentRef.innerHTML = "";
    taskCard.style.display = 'block';
    contentRef.style.display = 'none';
}

function updateCurrentTask(event) {
    event.preventDefault();

    const title = document.getElementById('inputTitle').value.trim();
    const description = document.getElementById('inputDescription').value.trim();
    const dueDate = document.getElementById('inputDueDate').value.trim();
    const priority = getSelectedPriority();
    const assignedTo = currentTask.assignedTo && currentTask.assignedTo.length > 0 
        ? currentTask.assignedTo 
        : [];

    if (!title) {
        document.getElementById('inputTitleError').style.display = 'block';
        return;
    } else {
        document.getElementById('inputTitleError').style.display = 'none';
    }

    if (!dueDate) {
        document.getElementById('inputDueDateError').style.display = 'block'; // Fehleranzeige aktivieren
        return; // Stoppt den Vorgang, wenn dueDate leer ist
    } else {
        document.getElementById('inputDueDateError').style.display = 'none'; // Fehleranzeige deaktivieren
    }

    if (category === 'Select category') {
        alert('Please select a category.');
        return;
    }

    const subtasks = [];
    document.querySelectorAll('.created-subtasks-container input').forEach((input, index) => {
        subtasks.push({
            completed: currentTask.subtasks[index]?.completed || false, // Falls bereits Subtasks vorhanden sind
            text: input.value.trim()
        });
    });

    // Aktualisiere currentTask
    currentTask.title = title;
    currentTask.description = description;
    currentTask.dueDate = dueDate;
    currentTask.priority = priority;
    currentTask.assignedTo = assignedTo; // Prüfen, ob assignedTo existiert
    currentTask.subtasks = subtasks;

    // Schließe den Editor oder speichere die Änderungen
    console.log('Updated Task:', currentTask);

    // Task in Firebase überschreiben
    updateTaskInFirebase(currentTask);
}

async function updateTaskInFirebase(task) {
    try {
        const taskUrl = `${BASE_URL}tasks/${task.id}.json`;
        const response = await fetch(taskUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
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

        // Aktualisiere die globale Variable tasksData basierend auf der ID
        const existingTask = tasksData.find(t => t.id === task.id);

        if (existingTask) {
            // Überschreibe das bestehende Objekt mit den neuen Werten
            Object.assign(existingTask, task);
            console.log('Updated tasksData:', tasksData);
        } else {
            console.warn(`Task with ID ${task.id} not found in tasksData.`);
        }
        // Karte neu rendern
        refreshTaskCard(task);
        openTaskDetail(task.id);
        closeTaskEditor();
    } catch (error) {
        console.error('Error updating task in Firebase Realtime Database:', error);
    }
}

async function refreshTaskCard(task) {
    const taskCard = document.querySelector(`.task-card[data-task-id="${task.id}"]`);

    const newTaskCardHTML = await getTaskCardTemplate(task);

    taskCard.outerHTML = newTaskCardHTML;
}

function getSelectedPriority() {
    if (document.getElementById('urgentPrio').classList.contains('selected')) {
        return 'Urgent';
    }
    if (document.getElementById('mediumPrio').classList.contains('selected')) {
        return 'Medium';
    }
    if (document.getElementById('lowPrio').classList.contains('selected')) {
        return 'Low';
    }
    return null;
}
