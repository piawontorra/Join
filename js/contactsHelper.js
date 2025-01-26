let currentUser = [];

/**
 * Asynchronously fetches contact data from a given path, sorts the contacts by name,
 * and renders them in the UI.
 *
 * @async
 * @function getContacts
 * @param {string} path - The relative path to fetch contact data from the API.
 * @returns {Promise<void>} - A promise that resolves when the contacts are fetched and rendered.
 */
async function getContacts(path) {
    let response = await fetch(BASE_URL + path + ".json");
    let contactsJson = await response.json();
    let contactsArray = [];
    for (let key in contactsJson) {
        contactsArray.push({ id: key, ...contactsJson[key] })
    }
    usersArray = contactsArray.sort((current, next) =>
        current.name > next.name ? 1 : next.name > current.name ? -1 : 0
    );
    renderContacts(usersArray);
}

/**
 * Renders a list of contacts into the "contactsOverview" container in the DOM.
 *
 * @function renderContacts
 * @param {Array<Object>} contacts - An array of contact objects to be rendered.
 * Each contact object should have at least a `name` property.
 * @returns {void}
 */
function renderContacts(contacts) {
    document.getElementById("contactsOverview").innerHTML = "";
    let currentLetter = "";
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i] && contacts[i].name) {
            let firstLetter = contacts[i].name.charAt(0);
            let secondLetter = contacts[i].name.charAt(
                contacts[i].name.indexOf(" ") + 1
            );
            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;
                contactsOverview.innerHTML += `<div class="letterGroup">${currentLetter}</div><div id="seperatorContainer"><div id="seperator"></div>`;
            }
            document.getElementById("contactsOverview").innerHTML += overviewTemplate(contacts, i, firstLetter, secondLetter);
        }
    }
}

/**
 * Renders the contact detail card for a selected contact using the `userArray` and the id
 * 
 * Update the `contactCard` container with the details, and sets the currentUser 
 * to the selected contact.
 * 
 * @param {number} id - The index of the contact in the `usersArray`.
 */
function contactDetailCard(id) {
    let contact = usersArray[id];
    let contactCardContainer = document.getElementById("contactCard");
    contactCardContainer.innerHTML = contactCardDetailsTemplate(id, contact);
    currentUser = contact;
}

/**
 * Shows a popup notification when a new contact is created 
 * after 2000ms the notification disapears
 */
function toggleAlert() {
  let overlay = document.getElementById('statusAlert');
  overlay.classList.add('open');
  setTimeout(() => {
    overlay.classList.remove('open');
  }, 2000);
}

/**
 * gathers values from user input and returns it to the newContact function
 * @returns value of name, email and phone
 */
function getUpdatedData() {
  return {
    name: document.getElementById('newUserName').value,
    email: document.getElementById('newUserEmail').value,
    phone: document.getElementById('newUserPhone').value
  };
}

/**
 * gathers values from user input and returns it to the editContact function
 * @returns value of name, email and phone
 */
function getUpdatedEditData() {
  return {
    name: document.getElementById('editUserName').value,
    email: document.getElementById('editUserEmail').value,
    phone: document.getElementById('editUserPhone').value
  };
}

/**
 * @returns a background color for the new user out of preset colors
 */
function createUserColor() {
  let randomNumber = Math.floor(Math.random() * 15);
  let userColor = userColorsPreset[randomNumber];
  return userColor;
}

/**
 * writing the next available ID into the database
 * @param {number} nextID 
 */
async function nextIdToDatabase(nextID) {
  await fetch(`${BASE_URL}/nextID.json`, {
    method: 'PUT',
    body: JSON.stringify(nextID + 1),
  })
}

/**
 * checks if all ist true
 * @returns true/false
 */
function validateForm() {
  return checkName() && checkEmail() && checkPhone();
}

/**
 * checks if the user name (Firstname and Lastname) input is valid
 * @returns true/false
 */
function checkName() {
  let name = document.getElementById("newUserName");
  name.value = name.value
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  let isValid = /^[A-ZÄÖÜ][a-zäöüß]+\s[A-ZÄÖÜ][a-zäöüß]+$/.test(name.value.trim());
  if (!isValid) {
    showError("nameError", "Please enter your first and last name.", name);
  }
  return isValid;
}

/**
* checks if the user email input is valid
* there must me a @ and a toplevel domain
* @returns true/false
*/
function checkEmail() {
  let email = document.getElementById("newUserEmail");
  let isValid = /^(?![_.-])([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+\.[A-Za-z0-9.-]{2,}$/.test(email.value);
  if (!isValid) showError("emailError", "Please enter a valid email address.", email);
  return isValid;
}

/**
 * checks if the user phonenumber input is valid
 * there must be at least 7 digits
 * @returns true/false
 */
function checkPhone() {
  let phoneNr = document.getElementById("newUserPhone");
  let isValid = /^\d{7,15}$/.test(phoneNr.value);
  if (!isValid) showError("phoneError", "Please enter a valid phone number (7-15 digits).", phoneNr);
  return isValid;
}

/**
 * checks if all ist true
 * @returns true/false
 */
function validateEditForm() {
  return checkEditName() && checkEditEmail() && checkEditPhone();
}

/**
 * checks if the user name (Firstname and Lastname) input is valid
 * @returns true/false
 */
function checkEditName() {
  let name = document.getElementById("editUserName");
  name.value = name.value
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let isValid = /^[A-ZÄÖÜ][a-zäöüß]+\s[A-ZÄÖÜ][a-zäöüß]+$/.test(name.value.trim());
  if (!isValid) {
    showError("nameError", "Please enter your first and last name.", name);
  }
  return isValid;
}

/**
* checks if the user email input is valid
* there must me a @ and a toplevel domain
* @returns true/false
*/
function checkEditEmail() {
  let email = document.getElementById("editUserEmail");
  let isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  if (!isValid) showError("emailError", "Please enter a valid email address", email);
  return isValid;
}

/**
 * checks if the user phonenumber input is valid
 * there must be at least 7 digits
 * @returns true/false
 */
function checkEditPhone() {
  let phoneNr = document.getElementById("editUserPhone");
  let isValid = /^\d{7,15}$/.test(phoneNr.value);
  if (!isValid) showError("phoneError", "Please enter a valid phone number (7-15 digits)", phoneNr);
  return isValid;
}

/**
 * Displays an error message for a specific input field
 * The error message disappears after 2.5 seconds
 * @param {string}
 * @param {string}
 * @param {HTMLElement}
 */
function showError(elementId, message, inputField) {
  let errorElement = document.getElementById(elementId);
  inputField.style.border = "1px solid red";
  if (errorElement) {
    errorElement.textContent = message;
    setTimeout(() => {
      errorElement.textContent = "";
      inputField.style.border = "";
    }, 2500);
  }
}

/**
 * checks if the window size is larger than 800px and will show up the Container again
 * Container: contactDetailsContainer
 */
window.addEventListener('resize', () => {
  if (window.innerWidth > 800) {
    let detailCard = document.getElementById('contactDetailsContainer');
    detailCard.style.display = "flex";
  }
});