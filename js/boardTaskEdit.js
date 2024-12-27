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
}

function renderEditSubtasks() {
    let contentRef = document.getElementById('subtask');
    contentRef.innerHTML = "";

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


