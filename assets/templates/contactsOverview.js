function overviewTemplate(contacts, i, firstLetter, secondLetter) {
  return `
            <div id="${i}" class="singleEntry" onclick="openContactDetailsCard('contactCard'), contactDetailCard(id)">
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
}

function contactCardDetailsTemplate(id, contact) {
    console.log(contact);
    
  const initials = contact.name.charAt(0) + (contact.name.split(" ")[1]?.charAt(0) || "");
  return `
            <div id="contactCardHeader">
                <div id="userInitials" style="background-color: ${contact.userColor}">${initials}</div>
                <div id="userInfo">
                    <div id="userName">${contact.name}</div>
                    <div class="action">
                            <div id="edit">
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
