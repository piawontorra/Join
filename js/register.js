function returnToLogIn() {
    window.location.href = 'index.html';
}

function initRegistry() {
    document.getElementById("registration-form").onsubmit = function (event) {
        event.preventDefault();

        let name = document.getElementById('name');
        let email = document.getElementById('email');
        let password = document.getElementById('password');

        let newUser = {
            name: name.value,
            email: email.value,
            password: password.value
        };
        addUser(newUser);
        document.getElementById('registration-form').reset();
    };
}

async function addUser(user) {
    let existingUsers = await loadUsers("users");

    if (!existingUsers) {
        existingUsers = {};
    }

    let newUserId = user.name;
    if (existingUsers[newUserId]) {
        console.log("Benutzer mit diesem Namen existiert bereits.");
        return;
        ;
    }
    existingUsers[newUserId] = user;
    await putUser("users", existingUsers);
    // window.location.href = 'login.html?msg=You Signed Up successfully.'
    returnToLogIn();
}

async function putUser(path = "", users = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(users)
    });

    return responseAsJson = await response.json();
}