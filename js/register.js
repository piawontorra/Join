function returnToLogIn() {
    window.location.href = 'index.html';
}

function addUser() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    putUser("/users", {"name": name.value, "email": email.value, "password": password.value});
    // users.push({ name: name.value, email: email.value, password: password.value });
    // window.location.href = 'index.html?msg=The registration was successful.';

}

async function putUser(path = "", user = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    });
    return response.json();
}