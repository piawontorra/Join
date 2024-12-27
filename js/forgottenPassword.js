async function saveNewPassword() {
    let email = getEmailFromURL();
    let newPassword = document.getElementById('password').value;
    let confirmPassword = document.getElementById('password-confirmation').value;

    if (checkPasswordCongruence(newPassword, confirmPassword)) {
        const user = await getUserByEmail(email);

        if (user) {
            const { userId } = user;
            await updateUserPassword(userId, newPassword);
            document.getElementById('msg-box').innerText = 'Your password has been updated successfully!';
            window.location.href = 'index.html';
        }
    }
}

function getEmailFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('email');
}


async function getUserByEmail(email) {
    const users = await loadUsers("users");
    const userId = Object.keys(users).find(userId => users[userId].email === email);
    return userId ? { userId, user: users[userId] } : null;
}

async function updateUserPassword(userId, newPassword) {
    const users = await loadUsers("users");
    const user = users[userId];

    if (user) {
        const updatedData = {email: user.email, name: user.name, password: newPassword};

        await fetch(`${BASE_URL}users/${userId}.json`, {
            method: 'PUT',
            body: JSON.stringify(updatedData),
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

