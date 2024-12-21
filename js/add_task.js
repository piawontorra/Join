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
    await fetchTasks();
    await loadData();
    console.log(selectedCategory);
}

async function fetchTasks() {
    let taskResponse = await loadTasks("tasks");
    let tasksKeysArray = Object.keys(taskResponse);
    for (let i = 0; i < tasksKeysArray.length; i++) {
        tasks.push({
            id: tasksKeysArray[i],
            tasks: taskResponse[tasksKeysArray[i]]
        });
    }
}

async function loadTasks(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseAsJson = await response.json();
}

// function newTask() {
//     document.getElementById("add-task-form").onsubmit = function (event) {
//         event.preventDefault();

//         let title = document.getElementById('inputTitle').value;
//         let description = document.getElementById('inputDescription').value;
//         // würde contacts als Bearbeiter nehmen (Video von Kevin)
//         let dueDate = document.getElementById('inputDueDate').value;
//         let priority = selectedPriority;
//         let selectedCategoryElement = document.getElementById('selectedCategory');
//         let category = selectedCategoryElement.textContent;

//         // Validierung der Kategorie
//         if (category === 'Select task category') {
//             alert("Bitte wählen Sie eine Kategorie aus, bevor Sie die Aufgabe erstellen.");
//             selectedCategoryElement.style.border = "2px solid red"; // Zeigt ein visuelles Feedback an
//             setTimeout(() => {
//                 selectedCategoryElement.style.border = ""; // Entfernt den Rahmen nach 2 Sekunden
//             }, 2000);
//             return; // Bricht die Formularverarbeitung ab
//         }

//         let newTask = {
//             title: title,
//             description: description,
//             dueDate: dueDate,
//             priority: priority,
//             category: category,
//         };
        
//         addTask(newTask);

//         document.getElementById('add-task-form').reset();

//         selectedCategoryElement.textContent = "Select task category";
//     }
// }

function newTask() {
    const form = document.getElementById("add-task-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Verhindert das Neuladen der Seite

        const titleInput = document.getElementById('inputTitle');
        const dueDateInput = document.getElementById('inputDueDate');

        // Validierung des Title-Feldes
        if (!validateTitle()) {
            return; // Abbruch, wenn Title ungültig
        }

        if (!validateDueDate()) {
            return;
        }

        if (!validateCategory()) {
            return;
        }

        let title = titleInput.value;
        let description = document.getElementById('inputDescription').value;
        let assignedId = assignedTo;
        let dueDate = dueDateInput.value;
        let priority = selectedPriority || 'Medium'; // Fallback-Priorität

        let newTask = {
            title: title,
            description: description,
            assignedTo: assignedId,
            dueDate: dueDate,
            priority: priority,
            category: selectedCategory,
            subtask: subtasks,
        };

        console.log("Neuer Task wird erstellt:", newTask);

        addTask(newTask);

        resetErrorState();

        // Felder zurücksetzen, aber Fehlerzustände beibehalten
        clearAddTask();
    });
}

async function addTask(task) {
    let existingTasks = await loadTasks("tasks");
    let newTaskId = task.title;

    existingTasks[newTaskId] = task;

    await putTask("tasks", existingTasks);
}

async function putTask(path = "", tasks = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks)
    });
    return responseAsJson = await response.json();
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

function selectPriority(priority) {
    document.querySelectorAll('.prio-button').forEach(button => {
        button.classList.remove('selected');
    });

    const selectedButton = document.getElementById(priority.toLowerCase() + "Prio");
    selectedButton.classList.add('selected');

    selectedPriority = priority;

    console.log("Selected Priority:", selectedPriority);
}




