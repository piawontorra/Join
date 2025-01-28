function overviewTemplate(contacts, i, firstLetter, secondLetter) {
    return `
            <div id="${i}" class="singleEntry" onclick="removeClosed(), showDetailsResponsive(), contactDetailCard(id), addBackground(id)">
                <div class="userInitialsOverview" style="background-color: ${contacts[i].userColor};">${firstLetter}${secondLetter}</div>    
                <div>
                    <div id="entryInfoName">${contacts[i].name}</div>
                    <div id="entryInfoMail">${contacts[i].email}</div>
                </div>
            </div>`;
}

function contactCardDetailsTemplate(id, contact) {
    let initials = contact.name.charAt(0) + (contact.name.split(" ")[1]?.charAt(0) || "");
    return `
            <div id="contactCardHeader">
                <div class="userInitials circle" style="background-color: ${contact.userColor}">${initials}</div>
                <div id="userInfo">
                    <div id="userName">${contact.name}</div>
                    <div class="action">
                            <div id="edit" onclick="openEditDialog(currentUser, ${id})">
                                <img src="assets/img/edit_icon.svg" alt="edit icon">
                                <span>Edit</span>
                            </div>
                            <div id="delete" onclick="deleteContact(${contact.id})">
                                <img src="assets/img/delete_icon.svg" alt="delete icon">
                                <span>Delete</span>
                            </div>
                    </div>
                </div>
            </div>
            <div id="contactCardUserInfo">
                <div id="contactText">
                    <span>Contact Information</span>
                </div>
                <div id="contactCardEmail">
                    <p>Email</p>
                    <div id="contactEmailAdr">
                        <a href="mailto:${contact.email}">${contact.email}</a>
                    </div>
                </div>
                <div id="contactCardPhone">
                    <p>Phone</p>
                    <div id="contactPhoneNr">${contact.phone || "no phone number available"}</div>
                </div>
                <div id="buttonMenuContainer">
                    <button class="btn_menuResponsive" onclick="openMenuDialog()"><img src="assets/img/more_vert.svg" alt="open menu"></button>
                    <div id="moreResponsive" class="closed">
                        <div id="edit" onclick="openEditDialog(currentUser, ${id})">
                            <img src="assets/img/edit_icon.svg" alt="edit icon">
                            <span>Edit</span>
                        </div>
                        <div id="delete" onclick="deleteContact(${contact.id})">
                            <img src="assets/img/delete_icon.svg" alt="delete icon">
                            <span>Delete</span>
                        </div>
                    </div>
                </div>
            </div>
    `;
}

function newContactTemplate() {
    return `
      <div id="newContactContent">
        <div id="addContactHeaderContainer">
            <div id="responsiveClose" onclick="closeDialog('[newContactDialog]')">X</div>
            <div id="addContactHeader">
                <div id="joinLogo">
                    <img src="assets/img/join_logo_menu.png" alt="Join Logo">
                </div>
                <div id="newContactHeaderText">
                    <p>Add contact</p>
                    <span>Tasks are better with a team!</span>
                </div>
                <div id="newContactDivider"></div>
            </div>  
        </div>
        <div id="circleContainer">
          <div id="circle"><img src="./assets/img/person.svg" alt="user icon"></div>
        </div>
        <div id="newContactFormContainer">
            <div id="formContainer">
                <div id="addUserFormContainer">
                    <div id="cancelImgContainer">
                        <img src="./assets/img/cancel_icon.png" id="closingImg" alt="Cancel" onclick="closeDialog('[newContactDialog]');">
                    </div>
                    <form id="newUserForm" novalidate>
                        <div class="inputField">
                            <input type="text" id="newUserName" name="name" placeholder="Name" required>
                            <img src="./assets/img/user_icon.png" alt="user icon">
                            <div class="error-message" id="nameError"></div>
                        </div>
                        <div class="inputField">
                            <input type="email" id="newUserEmail" name="email" placeholder="Email" required>
                            <img src="./assets/img/mail_icon.png" alt="mail icon">
                            <div class="error-message" id="emailError"></div>
                        </div>
                        <div class="inputField">
                            <input type="number" id="newUserPhone" name="phone" placeholder="Phone" required>
                            <img src="./assets/img/phone_icon.png" alt="phone icon">
                            <div class="error-message" id="phoneError"></div>
                        </div>
                    </form>
                </div>
            </div>
            <div id="btnContainer">
              <button id="btnCancel" class="clear-task-btn" type="button" onclick="closeDialog('[newContactDialog]');">Cancel<img src="./assets/img/cancel_icon.png" alt="cancel icon"></button>
              <button id="btnCreate" class="create-task-btn" type="submit" form="newUserForm">Create Contact<img src="./assets/img/check_icon.png" alt="create icon"></button>
            </div>
        </div>
        
      </div>
  `;
}

function editContactTemplate(user) {
    let initials = user.name.charAt(0) + (user.name.split(" ")[1]?.charAt(0) || "");
    let userId = user.id;
    return `
            <div id="newContactContent">
              <div id="addContactHeaderContainer">
              <div id="responsiveClose" onclick="closeDialog('[editContactDialog]')">X</div>
              <div id="addContactHeader">
                  <div id="joinLogo">
                      <img src="assets/img/join_logo_menu.png" alt="Join Logo">
                  </div>
                  <div id="newContactHeaderText">
                      <p>Edit contact</p>
                  </div>
                  <div id="newContactDivider"></div>
              </div>  
          </div>
          <div id="circleContainer">
          <div class="userInitials circle no-margin" style="background-color: ${user.userColor}">${initials}</div>
          </div>
          <div id="newContactFormContainer">
              <div id="formContainer">
                  <div id="addUserFormContainer">
                      <div id="cancelImgContainer">
                          <img src="./assets/img/cancel_icon.png" id="closingImg" alt="Cancel" onclick="closeDialog('[editContactDialog]');">
                      </div>
                      <form id="newUserForm">
                          <div class="inputField">
                            <input type="text" id="editUserName" name="name" placeholder="Name" value="${user.name || ''}" required>
                              <img src="./assets/img/user_icon.png" alt="user icon">
                              <div class="error-message" id="nameError"></div>
                          </div>
                          <div class="inputField">
                              <input type="email" id="editUserEmail" name="email" placeholder="Email" value="${user.email || ''}" required>
                              <img src="./assets/img/mail_icon.png" alt="mail icon">
                              <div class="error-message" id="emailError"></div>
                          </div>
                          <div class="inputField">
                              <input type="number" id="editUserPhone" name="phone" placeholder="Phone" value="${user.phone || ''}" required>
                              <img src="./assets/img/phone_icon.png" alt="phone icon">
                              <div class="error-message" id="phoneError"></div>
                          </div>
                      </form>
                  </div>
              </div>
              <div id="btnContainer">
                <button id="btnCancel" class="clear-task-btn" type="button" onclick="deleteContact(${userId}), closeDialog('[editContactDialog]');">Delete</button>
                <button id="btnCreate" class="create-task-btn" onclick="editContact(${userId})">Save<img src="./assets/img/check_icon.png" alt="check icon"></button>
              </div>
          </div>
        
      </div>
    `;
}