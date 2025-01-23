/**
 * Generates the HTML template for a contact to be displayed in the assigned user list.
 * 
 * @param {Object} contact - The contact object containing user information.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.userId - The unique ID of the user.
 * @param {string} contact.userColor - The background color for the user's initials.
 * @returns {string} The HTML template as a string for the contact.
 */
function getAssignedToTemplate(contact) {
  let initials = getInitials(contact.name);

  return `
      <div class="user" id="user-${contact.userId}" data-user-id="${contact.userId}" onclick="handleUserClick(${contact.userId})">
          <div class="user-left">
              <div class="initials-circle mr-10" style="background-color: ${contact.userColor}">${initials}</div>
              <span class="contact-name">${contact.name}</span>
          </div>
          <div class="user-right">
              <input 
                  type="checkbox" 
                  id="select-${contact.userId}" 
                  class="user-checkbox" 
                  onchange="handleCheckboxChange(${contact.userId})">
          </div>
      </div>
  `;
}

/**
 * Generates the HTML template for a contact to be displayed in the assigned users list (without interactivity).
 * 
 * @param {Object} contact - The contact object containing user information.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.userColor - The background color for the user's initials.
 * @returns {string} The HTML template as a string for the contact.
 */
function getAssignedUsersTemplate(contact) {
  let initials = getInitials(contact.name);

  return `
      <div class="assigned-user">
          <div class="initials-circle" style="background-color: ${contact.userColor}">${initials}</div>
      </div>
  `;
}

/**
 * Generates the HTML template for a subtask in the task details.
 * 
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML template as a string for the subtask.
 */
function getSubtaskTemplate(i) {
    return `
      <div class="subtask-list" id="mainSubtask-container${i}">
              <input
                readonly
                type="text"
                id="subtaskList${i}"
                value="${subtasks[i].text}"
                onkeydown="handleKeyPressEdit(event, ${i})"
                />
                <div class="edit-images" id="edit-images${i}">
                  <img onclick="editSubtask(${i})" id="editSubtask${i}" src="./assets/img/edit_icon.svg" alt="edit">
                  <div class="edit-seperator"></div>
                  <img onclick="deleteSubtask(${i})" id="deleteSubtask${i}" src="./assets/img/delete_icon.svg" alt="delete">
                </div>
              </div>
          </div>`;
}

/**
 * Generates the HTML template for editing a subtask in the task details.
 * 
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML template as a string for editing the subtask.
 */
function editSubtaskHTML(i) {
    return `
        <div class="edit-icons">
            <img onclick="deleteSubtask(${i})" id="deleteSubtask${i}" src="./assets/img/delete_icon.svg" alt="delete">
        </div>
        <div class="edit-seperator"></div>
        <div class="edit-icons">
            <img onclick="checkSubtask(${i})" id="checkSubtask${i}" src="./assets/img/check_dark_icon.svg" alt="save">
        </div>
      `;
}

