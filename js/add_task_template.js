function getAssignedToTemplate(contact) {
  // Initialen aus dem Namen extrahieren
  let initials = getInitials(contact.name);

  return `
      <div class="user">
          <div class="user-left">
              <div class="initials-circle" style="background-color: ${contact.userColor}">${initials}</div>
              <span class="contact-name">${contact.name}</span>
          </div>
          <div class="user-right">
              <input type="checkbox" id="select-${contact.userId}" class="user-checkbox">
          </div>
      </div>
  `;
}

function renderUsersHTML(contact, i) {
  let initials = getInitials(contact.name);

  return /*html*/ `
        <label for="checkbox${i}">
            <li class="contact-list" id="contactList${i}">        
                <div tabindex="0" class="emblem" style="background-color: ${contact.userColor}">
                  ${contact.emblem}
                </div> 
                <div class="contact-name" >${contact.name}</div> 
                <input class="user-checkbox" onclick="showUsersEmblem()" type="checkbox" id="checkbox${i}" data-userid="${contact.userId}">          
            </li>
        </label> `;
}

function getSubtaskTemplate(i) {
    return `
      <div class="subtask-list" id="mainSubtask-container${i}">
              <input
                readonly
                type="text"
                id="subtaskList${i}"
                value="${subtasks[i].text}"
                />
                <div class="edit-images" id="edit-images${i}">
                  <img onclick="editSubtask(${i})" id="editSubtask${i}" src="./assets/img/edit_icon.svg" alt="">
                  <div class="edit-seperator"></div>
                  <img onclick="deleteSubtask(${i})" id="deleteSubtask${i}" src="./assets/img/delete_icon.svg" alt="">
                </div>
              </div>
          </div>`;
}

function editSubtaskHTML(i) {
    return `
        <div class="edit-icons">
            <img onclick="deleteSubtask(${i})" id="deleteSubtask${i}" src="./assets/img/delete_icon.svg" alt="">
        </div>
        <div class="edit-seperator"></div>
        <div class="edit-icons">
            <img onclick="checkSubtask(${i})" id="checkSubtask${i}" src="./assets/img/check_dark_icon.svg" alt="">
        </div>
      `;
  }

