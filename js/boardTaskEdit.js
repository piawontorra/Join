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
        console.log("Task Daten:", currentTask); // Zeigt die gesamte Task
        console.log("AssignedTo Typ:", typeof currentTask.assignedTo);
        console.log("AssignedTo Daten:", currentTask.assignedTo);

        let assignedUserIds = currentTask.assignedTo.map(id => String(id));
        console.log("Assigned User IDs:", assignedUserIds);

        renderEditorUsers(contacts, assignedUserIds); // Übergibt die Kontakte und die zugewiesenen User-IDs
        renderEditorAssignedUsers(currentTask); // Aktualisiere die Anzeige der zugewiesenen Benutzer
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

function handleEditorCheckboxChange(userId, isChecked) {
    // Aktualisiere `task.assignedTo`
    if (isChecked) {
        if (!currentTask.assignedTo.includes(userId)) {
            currentTask.assignedTo.push(userId);
        }
    } else {
        currentTask.assignedTo = currentTask.assignedTo.filter(id => id !== userId);
    }

    // Aktualisiere die Klasse 'selected' im DOM
    const userElement = document.getElementById(`user-${userId}`);
    if (isChecked) {
        userElement.classList.add('selected');
    } else {
        userElement.classList.remove('selected');
    }

    console.log("Aktualisierte Task assignedTo:", currentTask.assignedTo);

    // Optional: Aktualisiere die Anzeige der zugewiesenen Benutzer
    renderEditorAssignedUsers(currentTask);
}

function renderEditorUsers(contacts, assignedUserIds) {
    console.log("Render Editor Users: Assigned User IDs:", assignedUserIds); // Debugging
    console.log("Render Editor Users: Contacts:", contacts); // Debugging

    let usersRef = document.getElementById('users');
    usersRef.innerHTML = '';

    let contactKeys = Object.keys(contacts);

    for (let i = 0; i < contactKeys.length; i++) {
        let key = contactKeys[i];
        let contact = contacts[key];

        // Überprüfen, ob der Benutzer bereits zugewiesen ist
        let isChecked = assignedUserIds.includes(String(contact.userId)); // Konvertiere zu String, falls nötig

        // Debugging: Log für jeden Kontakt
        console.log(`Kontakt: ${contact.name}, ID: ${contact.userId}, Checked: ${isChecked}`);

        let contactTemplate = getEditorAssignedToTemplate(contact, isChecked); // Übergibt den Zustand der Checkbox

        usersRef.innerHTML += contactTemplate;
    }
}

async function renderEditorAssignedUsers(task) {
    const assignedUserData = await getEditorAssignedUserInitialsAndColor(task.assignedTo || []); // Daten der zugewiesenen Benutzer abrufen

    // Generiere HTML für jeden Benutzer
    let assignedToHTML = assignedUserData.length > 0
        ? assignedUserData
            .map(user =>
                `<div class="detail-task-assigned-to">
                    <div class="detail-task-user-icon" style="background-color: ${user.color};">
                        ${user.initials}
                    </div>
                </div>`
            )
            .join("")
        : ""; // Wenn keine Benutzer zugewiesen sind, bleibt es leer

    // Füge das generierte HTML in die `assignedUsers`-Div ein
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

    for (let i = 0; i < currentTask.subtasks.length; i++) {
        const subtask = currentTask.subtasks[i];
        console.log(subtask);
        
        subtaskContainer.innerHTML += getEditorSubtaskTemplate(subtask, i);
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

    // Mache das Subtask-Feld bearbeitbar
    subtaskInput.readOnly = false;
    subtaskInput.focus();

    // Ändere den Stil ähnlich wie in `editSubtask`
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

    currentTask.subtasks.push({ text: input, completed: false }); // Füge die Subtask hinzu
    renderEditorSubtasks(); // Aktualisiere die Anzeige
    document.getElementById('inputSubtask').value = ''; // Leere das Eingabefeld
    resetButtons(); // Setze die Buttons zurück
}

function closeTaskEditor() {
    let contentRef = document.getElementById('editContainer');
    let taskCard = document.getElementById('taskDetailCard');
    contentRef.innerHTML = "";
    taskCard.style.display = 'flex';
    contentRef.style.display = 'none';
}

function updateCurrentTask(event) {
    // Verhindere, dass das Formular neu geladen wird
    event.preventDefault();

    // Werte aus den Eingabefeldern abrufen
    const title = document.getElementById('inputTitle').value.trim();
    const description = document.getElementById('inputDescription').value.trim();
    const dueDate = document.getElementById('inputDueDate').value.trim();
    const category = document.getElementById('selectedCategory').innerText.trim();
    const priority = getSelectedPriority();
    const assignedTo = getSelectedContacts();

    // Validierung der Pflichtfelder
    if (!title) {
        document.getElementById('inputTitleError').style.display = 'block';
        return;
    } else {
        document.getElementById('inputTitleError').style.display = 'none';
    }

    if (!dueDate) {
        document.getElementById('inputDueDateError').style.display = 'block';
        return;
    } else {
        document.getElementById('inputDueDateError').style.display = 'none';
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
    currentTask.category = category;
    currentTask.priority = priority;
    currentTask.assignedTo = assignedTo;
    currentTask.subtasks = subtasks;

    // Schließe den Editor oder speichere die Änderungen
    console.log('Updated Task:', currentTask);
    closeTaskEditor();
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

function getSelectedContacts() {
    const checkboxes = document.querySelectorAll('#users input[type="checkbox"]:checked');
    const selectedIds = Array.from(checkboxes).map(checkbox => {
        // Hole das 'value'-Attribut und versuche es in eine Zahl umzuwandeln
        const userId = parseInt(checkbox.value);
        
        // Stelle sicher, dass der Wert eine gültige Zahl ist
        if (!isNaN(userId)) {
            return userId;
        } else {
            console.warn(`Ungültige Benutzer-ID: ${checkbox.value}`);
            return null;
        }
    }).filter(id => id !== null);  // Entferne ungültige IDs (null)

    return selectedIds;
}

