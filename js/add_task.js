let tasks = [];
let subtasks = [];
let contacts = {};
let assignedTo = [];
let selectedCategory = "Select task category";
let selectedPriority = "Medium"; // Standardpriorität

window.onload = function () {
    selectPriority(selectedPriority);
    newTask();
};

async function initAddTask() {
    includeHTML();
    initializeCategory();
    await loadData();
    console.log(selectedCategory);
}

async function loadTasks(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseAsJson = await response.json();

    return responseAsJson || {};
}

async function getCardID() {
    try {
        let response = await fetch(`${BASE_URL}/nextCardID.json`);
        let nextCardID = await response.json();

        if (nextCardID === null) {
            nextCardID = 0;
        }

        await fetch(`${BASE_URL}/nextCardID.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nextCardID + 1),
        });

        return nextCardID;
    } catch (error) {
        console.error("Fehler beim Abrufen oder Aktualisieren der nextCardID:", error);
        throw error;
    }
}

async function newTask(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite

    const titleInput = document.getElementById('inputTitle');
    const dueDateInput = document.getElementById('inputDueDate');

    if (!validateTitle() || !validateDueDate() || !validateCategory()) {
        return; // Abbruch, wenn irgendeine Validierung fehlschlägt
    }

    let title = titleInput.value;
    let description = document.getElementById('inputDescription').value;
    let assignedId = assignedTo;
    let dueDate = dueDateInput.value;
    let priority = selectedPriority || 'Medium'; // Fallback-Priorität

    try {
        const cardID = await getCardID();

        let newTask = {
            title: title,
            description: description,
            assignedTo: assignedId,
            dueDate: dueDate,
            priority: priority,
            category: selectedCategory,
            subtasks: subtasks,
            status: 'todo',
            id: cardID,
        };

        console.log("Neuer Task wird erstellt:", newTask);

        addTask(newTask);
        resetErrorState();
        clearAddTask();
    } catch (error) {
        console.error("Fehler beim Erstellen des Tasks:", error);
    }
}

async function addTask(task) {
    let existingTasks = await loadTasks("tasks");
    let newTaskId = task.id;

    existingTasks[newTaskId] = task;

    await putTask("tasks", existingTasks);
}

async function putTask(path = "", tasks = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks)
    });
    return responseAsJson = await response.json();
}

async function loadData() {
    try {
        let response = await fetch(BASE_URL + "/contacts.json");
        let responseToJson = await response.json();
        console.log(responseToJson);
        
        contacts = responseToJson;

        renderUsers(contacts);
        showAssignedUsers();
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

function renderUsers(contacts) {
    let usersRef = document.getElementById('users');
    usersRef.innerHTML = '';

    let contactKeys = Object.keys(contacts);

    for (let i = 0; i < contactKeys.length; i++) {
        let key = contactKeys[i];
        let contact = contacts[key];

        let contactTemplate = getAssignedToTemplate(contact);

        usersRef.innerHTML += contactTemplate;
    }
}

function showUsers() {
    const usersElement = document.getElementById('users');
    const arrowDown = document.getElementById('userArrowDown');
    const arrowUp = document.getElementById('userArrowUp');
    const border = document.getElementsByClassName('add-task-assigned-to-input-field')[0];
    const selectedUsers = document.getElementById('assignedUsers');

    if (usersElement.style.display === 'none' || usersElement.style.display === '') {
        usersElement.style.display = 'block';
        arrowDown.style.display = 'none';
        arrowUp.style.display = 'block';
        selectedUsers.style.display = 'none';
        if (border) {
            border.style.border = '1px solid #26ace3';
        }
    } else {
        usersElement.style.display = 'none';
        arrowDown.style.display = 'block';
        arrowUp.style.display = 'none';
        selectedUsers.style.display = 'flex';
        if (border) {
            border.style.border = '';
        }
    }
}

function getInitials(name) {
    let nameParts = name.split(" ");
    let initials = nameParts.map(part => part[0].toUpperCase()).join("");
    return initials;
}

function handleUserClick(userId) {
    const userElement = document.getElementById(`user-${userId}`);
    const checkbox = document.getElementById(`select-${userId}`);

    if (userElement.classList.contains("selected")) {
        userElement.classList.remove("selected");
        checkbox.checked = false;

        assignedTo = assignedTo.filter(id => id !== userId);
    } else {
        userElement.classList.add("selected");
        checkbox.checked = true;

        if (!assignedTo.includes(userId)) {
            assignedTo.push(userId);
        }
    }

    showAssignedUsers();
}

function handleCheckboxChange(userId) {
    const userElement = document.getElementById(`user-${userId}`);
    const checkbox = document.getElementById(`select-${userId}`);

    if (checkbox.checked) {
        userElement.classList.add("selected");

        if (!assignedTo.includes(userId)) {
            assignedTo.push(userId);
        }
    } else {
        userElement.classList.remove("selected");

        assignedTo = assignedTo.filter(id => id !== userId);
    }

    console.log(assignedTo);
    

    showAssignedUsers();
}

function showAssignedUsers() {
    const assignedUsersElement = document.getElementById('assignedUsers');
    assignedUsersElement.innerHTML = '';

    assignedTo.forEach(userId => {
        const user = contacts[userId];
        if (user) {
            assignedUsersElement.innerHTML += getAssignedUsersTemplate(user);
        }
    });
}

function selectPriority(priority) {
    document.querySelectorAll('.prio-button').forEach(button => {
        button.classList.remove('selected');
    });

    const selectedButton = document.getElementById(priority.toLowerCase() + "Prio");
    selectedButton.classList.add('selected');

    selectedPriority = priority;
}

function initializeCategory() {
    const selectedCategoryElement = document.getElementById('selectedCategory');
    selectedCategoryElement.textContent = selectedCategory;
}

function showCategorys() {
    const categorysElement = document.getElementById('category')
    const arrowDown = document.getElementById('categoryArrowDown');
    const arrowUp = document.getElementById('categoryArrowUp');
    const border = document.getElementsByClassName('add-task-assigned-to-input-field')[1];

    if (categorysElement.style.display === 'none' || categorysElement.style.display === '') {
        categorysElement.style.display = 'block';
        arrowDown.style.display = 'none';
        arrowUp.style.display = 'block';
        if (border) {
            border.style.border = '1px solid #26ace3';
        }
    } else {
        categorysElement.style.display = 'none';
        arrowDown.style.display = 'block';
        arrowUp.style.display = 'none';
        if (border) {
            border.style.border = '';
        }
    }
}

function selectCategory(event, category) {
    event.stopPropagation();

    selectedCategory = category;

    const selectedCategoryElement = document.getElementById('selectedCategory');
    selectedCategoryElement.textContent = selectedCategory;

    const categorysElement = document.getElementById('category');
    categorysElement.style.display = 'none';

    const arrowDown = document.getElementById('categoryArrowDown');
    const arrowUp = document.getElementById('categoryArrowUp');
    arrowDown.style.display = 'block';
    arrowUp.style.display = 'none';

    console.log(`Selected category: ${selectedCategory}`); // Optional: Zur Überprüfung in der Konsole
}



