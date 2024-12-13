const BASE_URL = "https://join-83911-default-rtdb.europe-west1.firebasedatabase.app/";
let users = [];
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');


async function initLogin() {
    let userResponse = await loadUsers("users");
    console.log(userResponse);

    let userKeysArray = Object.keys(userResponse);
    for (let i = 0; i < userKeysArray.length; i++) {
        users.push(
            {
                id: userKeysArray[i],
                user: userResponse[userKeysArray[i]]
            }
        )
    }
}

async function loadUsers(path = "") {
    let response = await fetch(BASE_URL + path + ".json");
    return responseAsJson = await response.json();
}

function openRegistry() {
    window.location.href = 'register.html';
}

function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let user = users.find(user => user.user.email === email && user.user.password === password);

    if (user) {
        transferToSummary();
        document.getElementById('login-form').reset();
    } else {
        document.getElementById('msg-box').innerHTML = "Wrong email or assword";
    }
}

function transferToSummary() {
    window.location.href = 'summary.html';
}