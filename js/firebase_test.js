const BASE_URL = "https://join-83911-default-rtdb.europe-west1.firebasedatabase.app/";

function init(){
    loadData();
    getUsers("users"); //output only on the console
}

async function loadData(){
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();
}

/**
 @description
 * This function collects user information (name, email, password and a User Color) from a form,
 * organizes it into an object, and stores it in the specified paths (`/users` and `/contacts`)
 * in the Firebase database. After the data is stored, the form is reset. 
 */
function newUser() {
    let userColor = randomColor();
    let email = document.getElementById('userMail');
    let password = document.getElementById('userPassword');
    let name = document.getElementById('userName');
    let key = name.value;

    let newData = {
        name: name.value, email: email.value,
        password: password.value, userColor: userColor
    };
    const paths = ["/users", "/contacts"];
    paths.forEach(path => addNewData(newData, path, key));
    document.getElementById('newUserForm').reset();
}

/**
 @description
 * This function gathers task information (title, description, and assigned person) from a form,
 * organizes it into an object, and saves it to the `/tasks` path in the Firebase database.
 * After storing the task, it resets the task form.
 */
function newTask(){
    let title = document.getElementById('taskTitle');
    let description = document.getElementById('taskDescription');
    let assignedTo = document.getElementById('taskAssignedTo');
    let key = title.value;

    newData = {
        title: title.value,
        description: description.value,
        assigned_to: assignedTo.value
    }
    addNewData(newData, "/tasks", key);
    document.getElementById('newTaskForm').reset();
}

/**
 @description
 * This function collects contact information (name, email, phone and a User Color) from the form,
 * structures it into an object, and saves it to the `/contacts` path in the Firebase database.
 * After saving, it resets the contact form.
 */
function newContact(){
    let userColor = randomColor();
    let name = document.getElementById('contactName');
    let email = document.getElementById('contactEmail');
    let phone = document.getElementById('contactPhone');
    let key = name.value;

    newData = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        userColor: userColor
    }
    addNewData(newData, "/contacts", key);
    document.getElementById('newContactForm').reset();
}

/**
 @param {Object} data - The data to be stored.
 * @param {string} path - The database path where the data should be stored.
 * @param {string} key - The unique key under which the data will be stored.
 * @returns {Promise<void>} A promise that resolves when the record is successfully added.
 */
async function addNewData(data, path, key){
    let response = await fetch(`${BASE_URL}${path}/${key}.json`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

async function getUsers(path){
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    
}

/**
 * 
 * @returns a randomly created User Color 
 */
function randomColor(){
    let letters = '89ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}
