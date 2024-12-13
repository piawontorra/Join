function returnToLogIn() {
    window.location.href = 'index.html';
}

function initRegistry() {
    includeHTML();
    registerUsers();
    // document.getElementById("registry").disabled = true;
}

function registerUsers() {
    document.getElementById("registration-form").onsubmit = function (event) {
        event.preventDefault();

        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let passwordConfirmation = document.getElementById('password-confirmation').value;
        checkPasswordCongruence(password, passwordConfirmation);
        if (checkPasswordCongruence(password, passwordConfirmation)) {
            let newUser = {
                name: name,
                email: email,
                password: password
            };
            // checkFormValidity(name, email, password, passwordConfirmation);

            addUser(newUser);
            document.getElementById('registration-form').reset();
        }
    };
}

// function checkFormValidity(name, email, password, passwordConfirmation) {
//     if (name && email && password && passwordConfirmation) {
//         document.getElementById('registry').disabled = false;
//     } else {
//         document.getElementById('registry').disabled = true;
//     }
// }

function checkPasswordCongruence(password, passwordConfirmation) {
    if (password !== passwordConfirmation) {
        document.getElementById('msg-box').innerHTML = "Your passwords don´t match. Please try again.";
        document.getElementById('input-password-confirmation').classList.add('red-border');
        return false;
    } else {
        return true;
    }
}

async function addUser(user) {
    let existingUsers = await loadUsers("users");

    if (!existingUsers) {
        existingUsers = {};
    }

    let newUserId = user.name;
    // nicht gefordert
    if (existingUsers[newUserId] && checkPasswordCongruence === false) {
        document.getElementById('msg-box').innerHTML = "User with this name already exists.";
        return;
        ;
    }
    existingUsers[newUserId] = user;

    await putUser("users", existingUsers);
    addGreyOverlay();
}

async function putUser(path = "", users = {}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(users)
    });

    let responseAsJson = await response.json();

    console.log("Benutzer gespeichert:", responseAsJson);
}

function addGreyOverlay() {
    let greyOverlayRef = document.getElementById('grey-overlay');
    greyOverlayRef.classList.remove('d-none');
    renderOverlay();
    handleScrollbar();
}

function renderOverlay() {
    let overlayRef = document.getElementById('success-msg');
    overlayRef.innerHTML = '';

    overlayRef.innerHTML = getRegistrySuccessTemplate();

    setTimeout(() => {
        returnToLogIn();
    }, 700);
}

function handleScrollbar() {
    let greyOverlayRef = document.getElementById('grey-overlay');
    greyOverlayRef.classList.contains('d-none') ?
        document.body.classList.remove('overlay-active') : document.body.classList.add('overlay-active');
}