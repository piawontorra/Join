function initRegistry() {
    includeHTML();
    registerUsers();
}

function returnToLogIn() {
    window.location.href = 'index.html';
}

async function registerUsers() {
    document.getElementById("registration-form").onsubmit = async function (event) {
        event.preventDefault();

        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let passwordConfirmation = document.getElementById('password-confirmation').value;

        if (checkPasswordCongruence(password, passwordConfirmation)) {
            let newUser = {
                "name": name,
                "email": email,
                "password": password
            };
            await addUser(newUser);
            document.getElementById('registration-form').reset();
        };
    }
}

function checkPasswordCongruence(password, passwordConfirmation) {
    if (password !== passwordConfirmation) {
        document.getElementById('msg-box').innerText = "Your passwords don´t match. Please try again.";
        document.getElementById('input-password-confirmation').classList.add('red-border');
        return false;
    } else {
        return true;
    }
}

function toggleCheckboxImg() {
    let checkboxRef = document.getElementById('accepted-policy');
    let checkboxImgRef = document.getElementById('checkbox-img');

    if (checkboxRef.checked) {
        checkboxImgRef.src = "assets/img/unchecked.png";
        checkboxRef.checked = false;
    } else {
        checkboxImgRef.src = "assets/img/checked.png";
        checkboxRef.checked = true;
    }
}

async function addUser(user) {
    let existingUsers = await loadUsers("users");

    if (!existingUsers) {
        existingUsers = {};
    }

    let newUserId = await getNextUserId();
    existingUsers[newUserId] = user;

    await putUser("users", existingUsers);
    await nextUserIdToDatabase(newUserId);
    addGreyOverlay();
}

async function getNextUserId() {
    let response = await fetch(`${BASE_URL}/nextUserId.json`);
    let nextUserId = await response.json();
    if (!nextUserId) {
        nextUserId = 0;
    }
    return nextUserId;
}

async function nextUserIdToDatabase(nextUserId) {
    await fetch(`${BASE_URL}/nextUserId.json`, {
        method: 'PUT',
        body: JSON.stringify(nextUserId + 1),
    });
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