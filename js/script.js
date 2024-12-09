const BASE_URL = "https://join-83911-default-rtdb.europe-west1.firebasedatabase.app";

let userArr = [];

const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
let msgBox = document.getElementById('msg-box');
// if (msg != 0) {
//     msgBox.innerHTML = msg;
// } else {
//     msgBox.classList.add('d_none');
// }

function init() {
    loadUsers("/users");
}

async function loadUsers(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseAsJson = await response.json();
    return responseAsJson;
}

function openRegistry() {
    window.location.href = 'register.html';
}

function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = userArr.find(user => user.email === email.value && user.password === password.value);
    console.log(user);
    if (user) {
        console.log('user gefunden');
        transferToSummary();
    }
}

function transferToSummary() {
    window.location.href = 'summary.html';
}