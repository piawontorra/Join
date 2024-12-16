function getAssignedToTemplate(i) {
  return `
        <label for="checkbox${i}">
            <li class="contact-list" id="contactList${i}">        
                <div tabindex="0" class="emblem" style="background-color: ${contact.color}">
                  ${contact.emblem}
                </div> 
                <div class="contact-name" >${usersAddTask}</div> 
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

