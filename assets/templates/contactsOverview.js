let currentUser = [];

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

function contactDetailCard(id) {
  let contact = usersArray[id];
  let contactCardContainer = document.getElementById("contactCard");
  contactCardContainer.innerHTML = contactCardDetailsTemplate(id, contact);
  currentUser = [];
  currentUser.push(contact);
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
                                <img src="assets/img/edit_icon.svg" alt="Image edit">
                                <span>Edit</span>
                            </div>
                            <div id="delete" onclick="deleteContact(${contact.id})">
                                <img src="assets/img/delete_icon.svg" alt="Image delete">
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
                    <button class="btn_menuResponsive" onclick="openMenuDialog()"><img src="assets/img/more_vert.svg" alt=""></button>
                    <div id="moreResponsive" class="closed">
                        <div id="edit" onclick="openEditDialog(currentUser, ${id})">
                            <img src="assets/img/edit_icon.svg" alt="Image edit">
                            <span>Edit</span>
                        </div>
                        <div id="delete" onclick="deleteContact(${contact.id})">
                            <img src="assets/img/delete_icon.svg" alt="Image delete">
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
                    <img src="assets/img/join_logo_menu.png" alt="">
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
                    <form id="newUserForm">
                        <div class="inputField">
                            <input type="text" id="newUserName" placeholder="Name" required pattern="[a-zA-Z\s]+ [a-zA-Z\s]+" >
                            <img src="./assets/img/user_icon.png" alt="">
                        </div>
                        <div class="inputField">
                            <input type="email" id="newUserEmail" placeholder="Email" required>
                            <img src="./assets/img/mail_icon.png" alt="">
                        </div>
                        <div class="inputField">
                            <input type="number" id="newUserPhone" placeholder="Phone" required>
                            <img src="./assets/img/phone_icon.png" alt="">
                        </div>
                    </form>
                </div>
            </div>
            <div id="btnContainer">
              <button id="btnCancel" class="clear-task-btn" type="button" onclick="closeDialog('[newContactDialog]');">Cancel<img src="./assets/img/cancel_icon.png" alt=""></button>
              <button id="btnCreate" class="create-task-btn" type="submit" form="newUserForm">Create Contact<img src="./assets/img/check_icon.png" alt=""></button>
            </div>
        </div>
        
      </div>
  `;
}

function editContactTemplate(user, id){
  let initials = user[0].name.charAt(0) + (user[0].name.split(" ")[1]?.charAt(0) || "");
  let arrayID = id;
  let userId = user[0].userId;
    return `
            <div id="newContactContent">
              <div id="addContactHeaderContainer">
              <div id="addContactHeader">
                  <div id="joinLogo">
                      <img src="assets/img/join_logo_menu.png" alt="">
                  </div>
                  <div id="newContactHeaderText">
                      <p>Edit contact</p>
                  </div>
                  <div id="newContactDivider"></div>
              </div>  
          </div>
          <div id="circleContainer">
          <div class="userInitials circle no-margin" style="background-color: ${user[0].userColor}">${initials}</div>
          </div>
          <div id="newContactFormContainer">
              <div id="formContainer">
                  <div id="addUserFormContainer">
                      <div id="cancelImgContainer">
                          <img src="./assets/img/cancel_icon.png" id="closingImg" alt="Cancel" onclick="closeDialog('[editContactDialog]');">
                      </div>
                      <form id="newUserForm">
                          <div class="inputField">
                              <input type="text" id="newUserName" placeholder="Name" value="${user[0].name || ''}" required pattern="[a-zA-Z\s [a-zA-Z\s]+]+">
                              <img src="./assets/img/user_icon.png" alt="">
                          </div>
                          <div class="inputField">
                              <input type="email" id="newUserEmail" placeholder="Email" value="${user[0].email || ''}" required>
                              <img src="./assets/img/mail_icon.png" alt="">
                          </div>
                          <div class="inputField">
                              <input type="number" id="newUserPhone" placeholder="Phone" value="${user[0].phone  || ''}" required>
                              <img src="./assets/img/phone_icon.png" alt="">
                          </div>
                      </form>
                  </div>
              </div>
              <div id="btnContainer">
                <button id="btnCancel" class="clear-task-btn" type="button" onclick="deleteContact(${userId}), closeDialog('[editContactDialog]');">Delete</button>
                <button id="btnCreate" class="create-task-btn" type="submit" form="newUserForm">Save<img src="./assets/img/check_icon.png" alt=""></button>
              </div>
          </div>
        
      </div>
    `;
}
