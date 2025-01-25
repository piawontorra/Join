/**
 * Renders the list of users from the contact data.
 *
 * @param {Object} contacts - The contact data to be displayed.
 */
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

/**
 * Toggles the visibility of the user list and changes the arrows accordingly.
 */
function showUsers() {
    const usersElement = document.getElementById('users');
    const arrowDown = document.getElementById('userArrowDown');
    const arrowUp = document.getElementById('userArrowUp');
    const border = document.getElementsByClassName('add-task-assigned-to-input-field')[0];
    const selectedUsers = document.getElementById('assignedUsers');

    if (isUsersElementHidden(usersElement)) {
        showUserList(usersElement, arrowDown, arrowUp, selectedUsers, border);
        isUsersOpen = true;
        document.addEventListener('click', handleOutsideClick);
    } else {
        hideUserList(usersElement, arrowDown, arrowUp, selectedUsers, border);
        isUsersOpen = false;
        document.removeEventListener('click', handleOutsideClick);
    }
}

/**
 * Handles clicks outside the user list or dropdown button. 
 * If the click occurs outside the user list and the dropdown button, it hides the user list.
 *
 * @param {Event} event - The click event triggered by the user.
 */
function handleOutsideClick(event) {
    const usersElement = document.getElementById('users');
    const dropdownButton = document.getElementsByClassName('add-task-assigned-to-input-field')[0];

    if (!usersElement.contains(event.target) && !dropdownButton.contains(event.target)) {
        hideUserList(usersElement, document.getElementById('userArrowDown'), document.getElementById('userArrowUp'), document.getElementById('assignedUsers'), dropdownButton);
        isUsersOpen = false;
        document.removeEventListener('click', handleOutsideClick);
    }
}

/**
 * Checks whether the users element is hidden or not.
 *
 * @param {HTMLElement} usersElement - The users element.
 * @returns {boolean} `true` if the users element is hidden, otherwise `false`.
 */
function isUsersElementHidden(usersElement) {
    return usersElement.style.display === 'none' || usersElement.style.display === '';
}

/**
 * Shows the user list and updates the arrows.
 *
 * @param {HTMLElement} usersElement - The users element.
 * @param {HTMLElement} arrowDown - The down arrow element.
 * @param {HTMLElement} arrowUp - The up arrow element.
 * @param {HTMLElement} selectedUsers - The selected users element.
 * @param {HTMLElement} border - The border of the input field.
 */
function showUserList(usersElement, arrowDown, arrowUp, selectedUsers, border) {
    usersElement.style.display = 'block';
    arrowDown.style.display = 'none';
    arrowUp.style.display = 'block';
    selectedUsers.style.display = 'none';
    if (border) {
        border.style.border = '1px solid #26ace3';
    }
}

/**
 * Hides the user list and updates the arrows.
 *
 * @param {HTMLElement} usersElement - The users element.
 * @param {HTMLElement} arrowDown - The down arrow element.
 * @param {HTMLElement} arrowUp - The up arrow element.
 * @param {HTMLElement} selectedUsers - The selected users element.
 * @param {HTMLElement} border - The border of the input field.
 */
function hideUserList(usersElement, arrowDown, arrowUp, selectedUsers, border) {
    usersElement.style.display = 'none';
    arrowDown.style.display = 'block';
    arrowUp.style.display = 'none';
    selectedUsers.style.display = 'flex';
    if (border) {
        border.style.border = '';
    }
}

/**
 * Returns the initials of the user based on their name.
 *
 * @param {string} name - The name of the user.
 * @returns {string} The initials of the user.
 */
function getInitials(name) {
    let nameParts = name.split(" ");
    let initials = nameParts.map(part => part[0].toUpperCase()).join("");
    return initials;
}

/**
 * Handles the click on a user, adding them to or removing them from the list of assigned users.
 * 
 * @param {string} userId - The ID of the user that was selected or deselected.
 */
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

/**
 * Handles changes to the state of a user's checkbox, adding or removing them from the list of assigned users.
 * 
 * @param {string} userId - The ID of the user whose checkbox was changed.
 */
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

/**
 * Displays the list of assigned users in the UI.
 */
function showAssignedUsers() {
    const assignedUsersElement = document.getElementById('assignedUsers');
    assignedUsersElement.innerHTML = '';
    const maxVisibleUsers = 4;

    renderVisibleUsers(assignedUsersElement, maxVisibleUsers);
    renderExtraUsersIndicator(assignedUsersElement, maxVisibleUsers);
}

/**
 * Renders the visible assigned users.
 */
function renderVisibleUsers(assignedUsersElement, maxVisibleUsers) {
    assignedTo.slice(0, maxVisibleUsers).forEach(userId => {
        const user = contacts[userId];
        if (user) {
            assignedUsersElement.innerHTML += getAssignedUsersTemplate(user);
        }
    });
}

/**
 * Renders the "+n" indicator for extra users.
 */
function renderExtraUsersIndicator(assignedUsersElement, maxVisibleUsers) {
    if (assignedTo.length > maxVisibleUsers) {
        const extraUsersCount = assignedTo.length - maxVisibleUsers;
        assignedUsersElement.innerHTML += `
            <div class="initials-circle-if-to-much">
                +${extraUsersCount}
            </div>
        `;
    }
}