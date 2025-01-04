let tasks = [];
let subtasks = [];
let contacts = {};
let assignedTo = [];
let selectedTaskStatus = 'todo';
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
}

async function loadTasks(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseAsJson = await response.json();

    return responseAsJson || {};
}

async function getCardID() {
    try {
        const nextCardID = await fetchNextCardID();
        await updateNextCardID(nextCardID + 1);
        return nextCardID;
    } catch (error) {
        handleCardIDError(error);
        throw error;
    }
}

async function fetchNextCardID() {
    const response = await fetch(`${BASE_URL}/nextCardID.json`);
    const nextCardID = await response.json();
    return nextCardID === null ? 1 : nextCardID;
}

async function updateNextCardID(newCardID) {
    await fetch(`${BASE_URL}/nextCardID.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCardID),
    });
}

function handleCardIDError(error) {
    console.error("Fehler beim Abrufen oder Aktualisieren der nextCardID:", error);
}

async function newTask(event) {
    event.preventDefault();
    if (!validateTitle() || !validateDueDate() || !validateCategory()) {
        return;
    }
    try {
        const newTask = await createNewTask();
        console.log("Neuer Task wird erstellt:", newTask);
        addTask(newTask);
        showTaskAddedToBoard();
        resetErrorState();
        redirectToBoard();
    } catch (error) {
        console.error("Fehler beim Erstellen des Tasks:", error);
    }
}

async function createNewTask() {
    const cardID = await getCardID();
    const taskDetails = getTaskDetails();
    return { ...taskDetails, id: cardID };
}

function getTaskDetails() {
    return {
        title: getTitle(),
        description: getDescription(),
        assignedTo: getAssignedId(),
        dueDate: getDueDate(),
        priority: getPriority(),
        category: selectedCategory,
        subtasks: subtasks,
        status: selectedTaskStatus,
    };
}

function getTitle() {
    return document.getElementById('inputTitle').value;
}

function getDescription() {
    return document.getElementById('inputDescription').value;
}

function getAssignedId() {
    return assignedTo;
}

function getDueDate() {
    return document.getElementById('inputDueDate').value;
}

function getPriority() {
    return selectedPriority || 'Medium';
}

function redirectToBoard() {
    setTimeout(function () {
        clearAddTask();
        location.href = 'board.html';
    }, 3000);
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

    if (isUsersElementHidden(usersElement)) {
        showUserList(usersElement, arrowDown, arrowUp, selectedUsers, border);
    } else {
        hideUserList(usersElement, arrowDown, arrowUp, selectedUsers, border);
    }
}

function isUsersElementHidden(usersElement) {
    return usersElement.style.display === 'none' || usersElement.style.display === '';
}

function showUserList(usersElement, arrowDown, arrowUp, selectedUsers, border) {
    usersElement.style.display = 'block';
    arrowDown.style.display = 'none';
    arrowUp.style.display = 'block';
    selectedUsers.style.display = 'none';
    if (border) {
        border.style.border = '1px solid #26ace3';
    }
}

function hideUserList(usersElement, arrowDown, arrowUp, selectedUsers, border) {
    usersElement.style.display = 'none';
    arrowDown.style.display = 'block';
    arrowUp.style.display = 'none';
    selectedUsers.style.display = 'flex';
    if (border) {
        border.style.border = '';
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
    const categorysElement = document.getElementById('category');
    const arrowDown = document.getElementById('categoryArrowDown');
    const arrowUp = document.getElementById('categoryArrowUp');
    const border = document.getElementsByClassName('add-task-assigned-to-input-field')[1];

    if (categorysElement.style.display === 'none' || categorysElement.style.display === '') {
        showCategorysList(categorysElement, arrowDown, arrowUp, border);
    } else {
        hideCategorysList(categorysElement, arrowDown, arrowUp, border);
    }
}

function showCategorysList(categorysElement, arrowDown, arrowUp, border) {
    categorysElement.style.display = 'block';
    arrowDown.style.display = 'none';
    arrowUp.style.display = 'block';
    if (border) {
        border.style.border = '1px solid #26ace3';
    }
}

function hideCategorysList(categorysElement, arrowDown, arrowUp, border) {
    categorysElement.style.display = 'none';
    arrowDown.style.display = 'block';
    arrowUp.style.display = 'none';
    if (border) {
        border.style.border = '';
    }
}

function selectCategory(event, category) {
    event.stopPropagation();
    selectedCategory = category;

    const border = document.getElementsByClassName('add-task-assigned-to-input-field')[1];
    border.style.border = '';
    const selectedCategoryElement = document.getElementById('selectedCategory');
    selectedCategoryElement.textContent = selectedCategory;
    const categorysElement = document.getElementById('category');
    categorysElement.style.display = 'none';
    const arrowDown = document.getElementById('categoryArrowDown');
    const arrowUp = document.getElementById('categoryArrowUp');
    arrowDown.style.display = 'block';
    arrowUp.style.display = 'none';
}

function showTaskAddedToBoard() {
    let taskAddedToBoard = document.getElementById('taskAddedToBoard');
    let taskAddedToBoardModal = document.getElementById('taskAddedToBoardModal');

    taskAddedToBoard.style.display = 'flex';
    taskAddedToBoard.classList.add('task-added-to-board');
    taskAddedToBoardModal.classList.add('task-added-to-board-modal');
    setTimeout(function () {
        taskAddedToBoard.style.display = 'none';
        taskAddedToBoard.classList.remove('task-added-to-board');
        taskAddedToBoardModal.classList.remove('task-added-to-board-modal');
      }, 3000);
}

