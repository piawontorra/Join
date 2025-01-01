let currentUser = [];

function overviewTemplate(contacts, i, firstLetter, secondLetter) {
  return `
            <div id="${i}" class="singleEntry" onclick="openContactDetailsCard('contactCard'), contactDetailCard(id), addBackground(id)">
                <div class="userInitials" style="background-color: ${contacts[i].userColor};">${firstLetter}${secondLetter}</div>    
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
  const initials = contact.name.charAt(0) + (contact.name.split(" ")[1]?.charAt(0) || "");
  return `
            <div id="contactCardHeader">
                <div id="userInitials" style="background-color: ${contact.userColor}">${initials}</div>
                <div id="userInfo">
                    <div id="userName">${contact.name}</div>
                    <div class="action">
                            <div id="edit" onclick="toggleOverlay(), openEditForm(currentUser, ${id})">
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
                    <div id="contactPhoneNr">${
                      contact.phone || "no phone number available"
                    }</div>
                </div>
            </div>
    `;
}

//ohne Form Validierung
// function newContactTemplate(){
//     return `
//             <div id="addContactHeaderContainer">
//               <div id="addContactHeader">
//                 <div id="joinLogo">
//                   <img src="assets/img/join_logo_menu.png" alt="">
//                 </div>
//                 <div id="newContactHeaderText">
//                   <p>Add contact</p>
//                   <span>Tasks are better with a team!</span>
//                 </div>
//                 <div id="newContactDivider"></div>
//               </div>  
//             </div>
//             <div id="newContactFormContainer">
//               <div id="formContainer">
//                 <div id="circleContainer">
//                   <div id="circle"><img src="./assets/img/person.svg" alt="user icon"></div>
//                 </div>
//                 <div id="addUserFormContainer">
//                   <div id="cancelImgContainer">
//                     <img src="./assets/img/cancel_icon.png" id="closingImg" alt="Cancel" onclick="closeNewContactCard()">
//                   </div>
//                   <form id="newUserForm">
//                     <div class="inputField">
//                       <input type="text" id="newUserName" placeholder="Name" required>
//                       <img src="./assets/img/user_icon.png" alt="">
//                     </div>
//                     <div class="inputField">
//                       <input type="email" id="newUserEmail" placeholder="Email" required>
//                       <img src="./assets/img/mail_icon.png" alt="">
//                     </div>
//                     <div class="inputField">
//                       <input type="phone" id="newUserPhone" placeholder="Phone" required>
//                       <img src="./assets/img/phone_icon.png" alt="">
//                     </div>
//                   </form>
//                   <div id="btnContainer">
//                     <button id="btnCancel" class="clear-task-btn" onclick="closeNewContactCard()">Cancel<img src="./assets/img/cancel_icon.png" alt=""></button>
//                     <button id="btnCreate" class="create-task-btn" onclick="newContact(), toggleAlert()">Create Contact<img src="./assets/img/check_icon.png" alt=""></button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//     `;
// }


//mit Form Validierung
function newContactTemplate() {
  return /*html*/`
      <div id="newContactContent">
        <div id="addContactHeaderContainer">
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
                <!-- <div id="circleContainer">
                    <div id="circle"><img src="./assets/img/person.svg" alt="user icon"></div>
                </div> -->
                <div id="addUserFormContainer">
                    <div id="cancelImgContainer">
                        <img src="./assets/img/cancel_icon.png" id="closingImg" alt="Cancel" onclick="closeDialog()">
                    </div>
                    <form id="newUserForm">
                        <div class="inputField">
                            <input type="text" id="newUserName" placeholder="Name" required>
                            <img src="./assets/img/user_icon.png" alt="">
                        </div>
                        <div class="inputField">
                            <input type="email" id="newUserEmail" placeholder="Email" required>
                            <img src="./assets/img/mail_icon.png" alt="">
                        </div>
                        <div class="inputField">
                            <input type="tel" id="newUserPhone" placeholder="Phone" required>
                            <img src="./assets/img/phone_icon.png" alt="">
                        </div>
                        <!-- <div id="btnContainer">
                            <button id="btnCancel" class="clear-task-btn" type="button" onclick="closeNewContactCard()">Cancel<img src="./assets/img/cancel_icon.png" alt=""></button>
                            <button id="btnCreate" class="create-task-btn" type="submit">Create Contact<img src="./assets/img/check_icon.png" alt=""></button>
                        </div> -->
                    </form>
                </div>
            </div>
            <div id="btnContainer">
              <button id="btnCancel" class="clear-task-btn" type="button" onclick="closeNewContactCard()">Cancel<img src="./assets/img/cancel_icon.png" alt=""></button>
              <button id="btnCreate" class="create-task-btn" type="submit">Create Contact<img src="./assets/img/check_icon.png" alt=""></button>
              </div>
        </div>
        
      </div>
  `;
}


function editContactTemplate(user, id){
  const initials = user[0].name.charAt(0) + (user[0].name.split(" ")[1]?.charAt(0) || "");
  let arrayID = id;    
    return `
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
            <div id="newContactFormContainer">
              <div id="formContainer">
                <div id="circleContainer">
                  <div id="circle" style="background-color: ${user[0].userColor}">${initials}</div>
                </div>
                <div id="addUserFormContainer">
                  <div id="cancelImgContainer">
                    <img src="./assets/img/cancel_icon.png" id="closingImg" alt="Cancel" onclick="closeNewContactCard()">
                  </div>
                  <form id="newUserForm">
                    <div class="inputField">
                      <input type="text" id="newUserName" value="${currentUser[0].name}" required>
                      <img src="./assets/img/user_icon.png" alt="">
                    </div>
                    <div class="inputField">
                      <input type="email" id="newUserEmail" value="${currentUser[0].email}"  required>
                      <img src="./assets/img/mail_icon.png" alt="">
                    </div>
                    <div class="inputField">
                      <input type="phone" id="newUserPhone" value="${currentUser[0].phone}" required>
                      <img src="./assets/img/phone_icon.png" alt="">
                    </div>
                  </form>
                  <div id="btnContainer">
                    <button id="btnCancel" class="clear-task-btn" onclick="deleteContact(${currentUser[0].id}), closeOverlay()">Delete</button>
                    <button id="btnCreate" class="create-task-btn" onclick="editContact(currentUser)">Save<img src="./assets/img/check_icon.png" alt=""></button>
                  </div>
                </div>
              </div>
            </div>
    `;
}
