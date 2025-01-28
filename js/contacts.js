let path = "contacts";
let usersArray = [];
let userColorsPreset = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

function initContacts() {
  includeHTML();
  getContacts(path);
}

/**
 * creates a new contact and saves it in the database
 * collecting data from user input as name, email and phone number
 * update contact list and reload it
 */
async function newContact() {
  let userColor = createUserColor();
  let key = await getNextID();
  let newData = {
    ...getUpdatedData(),
    userColor: userColor,
    userId: key
  };
  await addNewData(newData, "/contacts", key);
  closeDialog("[newContactDialog]");
  nextIdToDatabase(key);
  await getContacts(path)
  chooseNewContact(key);
}

/**
 * choose the last created contact, add background color on overview and show the detail page
 * @param {number} key 
 */
function chooseNewContact(key) {
  let index = usersArray.findIndex(user => user.id == key);
  removeClosed();
  contactDetailCard(index);
  showDetailsResponsive()
  addBackground(index);
}

/**
 * pushes new Data to firebase database
 * @param {Object} data - The data that will be stored
 * @param {string} path - The database path
 * @param {string} key - a key under which the data will be stored
 * @returns {Promise<void>} A promise that resolves when the record is successfully added.
 */
async function addNewData(data, path, key) {
  let response = await fetch(`${BASE_URL}${path}/${key}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  return responseAsJson = await response.json();
}

/**
 * opens a contact detail card by adding "open" class. 
 * @param {string} infoboxId the id of the element to open
 * @descripton
 * - check if contact card exists
 * - if it is already opened the function exits 
 * - if not it will open the card by adding the class "open"
 */
function openContactDetailsCard(infoboxId) {
  let contactCard = document.getElementById('contactCard');
  if (contactCard) {
    if (contactCard.classList.contains("open")) {
      return;
    }
    document.querySelector(`#${infoboxId}`).classList.add("open");
    showDetailsResponsive(infoboxId);
  }
}

/**
 * opens the contact detail container in mobile view
 * checks if the viewport is < 800
 */
function showDetailsResponsive() {
  let contactDetailsContainer = document.getElementById('contactDetailsContainer');
  let wrapperContacts = document.getElementById('wrapperContacts');
  let contactCard = document.getElementById('contactCard')
  if (window.innerWidth < 800 && contactDetailsContainer && wrapperContacts) {
    contactDetailsContainer.style.display = "block";
    contactCard.classList.add("open");
  }
}

/**
 * closes the contact detail container
 */
function closeDetailsResponsive() {
  let contactDetailsContainer = document.getElementById('contactDetailsContainer');
  let wrapperContacts = document.getElementById('wrapperContacts');
  let contactCard = document.getElementById('contactCard')
  if (window.innerWidth < 800 && contactDetailsContainer && wrapperContacts) {
    contactDetailsContainer.style.display = "none";
    contactCard.classList.remove("open");
    contactCard.classList.add("infoboxClosed")
  }
}

/**
 * fetches the database and lookin for the current userId
 * @returns the next available ID from the database 
 */
async function getNextID() {
  let response = await fetch(`${BASE_URL}/nextID.json`);
  let nextID = await response.json();
  if (!nextID) {
    nextID = 0;
  }
  return nextID;
}

/**
 * 
 * deletes a specific entry with the given id in the firebase database
 * close the Detail Card, reload the contacts
 * @param {number} entryId 
 */
async function deleteContact(entryId) {
  let dbRef = (BASE_URL + path + "/" + entryId);
  let response = await fetch(dbRef + ".json", {
    method: "DELETE",
  });
  if (window.innerWidth < 800) {
    closeDetailsResponsive();
  } else {
    closeContactDetailsCard();
  }
  getContacts(path);
  return responseAsJson = await response.json();
}

/**
 * closes the contact details card overlay
 */
function closeContactDetailsCard() {
  let contactCard = document.getElementById('contactCard');
  if (contactCard) {
    contactCard.classList.remove("open");
    contactCard.innerHTML = "";
  }
}

/**
 * add or remove the background color to the chosen entry in the contact list
 * @param {string} id 
 */
function addBackground(id) {
  let allEntries = document.querySelectorAll('.singleEntry');
  allEntries.forEach(singleEntry => singleEntry.classList.remove('chosen'));
  document.getElementById(id).classList.add('chosen');
}

/**
 * open up the dialog for new contact form
 */
function openDialog() {
  let modal = document.querySelector("[newContactDialog]");
  modal.showModal();
  setTimeout(() => {
    modal.classList.add('open');
  }, 0);
  renderNewContactForm();
}

/**
 * renders the new contact form into modal and validate the user inputs
 */
function renderNewContactForm() {
  document.getElementById('contactDialog').innerHTML = newContactTemplate();
  let form = document.getElementById('newUserForm');
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (validateForm()) {
        newContact();
        toggleAlert();
      }
    });
  }
}

/**
 * open up the edit dialog for editing contact informations
 * @param {array} user 
 * @param {string} id from usersArray
 */
function openEditDialog(user) {
  const modal = document.querySelector("[editContactDialog]");
  modal.showModal();
  setTimeout(() => {
    modal.classList.add('open');
  }, 10);
  renderEditContactForm(user);
}

/**
 * open up the a dialog in mobile view for further funtions
 * functions: edit and delete
 */
function openMenuDialog() {
  let modal = document.getElementById('moreResponsive');
  modal.classList.remove('closed');
  setTimeout(() => {
    document.addEventListener('click', outsideClickHandler);
  }, 10);
}

/**
 * close the more options dialog in mobile view
 */
function closeMoreDialog() {
  let modal = document.getElementById('moreResponsive');
  document.removeEventListener('click', outsideClickHandler);
  setTimeout(() => {
    modal.classList.add('closed');
  }, 400);
}

/**
 * Checks if a click event occurs outside the dialog
 * if the event is detected, the dialog closes 
 * @param {click} event 
 */
function outsideClickHandler(event) {
  let modal = document.getElementById('moreResponsive');
  let rect = modal.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  ) {
    closeMoreDialog();
  }
}

/**
 * Edit an existing contact and updates the database.
 *
 * This function validates the form, retrieves updated data, and updates the user's contact
 * information in both the local `usersArray` and the remote database. After updating, it 
 * re-renders the contacts, shows the updated contact details, and closes the edit dialog.
 *
 * @async
 * @param {string} userId - The unique identifier of the user whose contact information is to be edited.
 * @returns {Promise<void>} A promise that resolves when the contact has been successfully updated and the UI has been refreshed.
 */
async function editContact(userId) {
  if (validateEditForm()) {
  let updatedData = getUpdatedEditData();
  await updateData(updatedData, "contacts", userId);
  const index = usersArray.findIndex(contact => contact.userId === userId);
  if (index !== -1) {
    usersArray[index] = { ...usersArray[index], ...updatedData };
  }
  renderContacts(usersArray);
  contactDetailCard(index);
  addBackground(index);
  closeDialog("[editContactDialog]");
  }
}

/**
 * This function sends a PATCH request to the database (firebase) update a resource at the specified database path and key
 * with the provided data.
 * 
 * @param {Object} data - The data object containing the updated values for the resource.
 * @param {string} path - The database path where the resource is located.
 * @param {string|number} key - The unique identifier of the resource to be updated.
 */
async function updateData(data, path, key) {
  await fetch(`${BASE_URL}${path}/${key}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

/**
 * renders the edit contact form into modal and validate the user inputs
 * @param {array} user 
 * @param {string} id 
 */
function renderEditContactForm(user) {
  const container = document.getElementById('editContactDialog');
  container.innerHTML = editContactTemplate(user);
  const form = container.querySelector('#newUserForm');
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (validateForm()) {
        newContact();
        toggleAlert();
      }
    })
  }
}

/**
 * closes the new contact or edit contact dialog 
 * @param {string} dialogSelector 
 */
function closeDialog(dialogSelector) {
  const modal = document.querySelector(dialogSelector);
  modal.classList.remove('open');
  setTimeout(() => {
    modal.close();
  }, 500);
  removeInput(dialogSelector);
}

/**
 * Clears the input fields of the form inside the given dialog.
 * 
 * @param {string} dialogSelector - The selector of the dialog/modal that is currently open.
 */
function removeInput(dialogSelector) {
  const form = document.querySelector(dialogSelector + ' form');

  if (form) {
    let inputFields = form.querySelectorAll('input[name="name"], input[name="email"], input[name="phone"]');

    inputFields.forEach(input => {
      input.value = '';
    });
  }
}

/**
 * removes the closed class to showup the dialog
 */
function removeClosed() {
  let contactDetails = document.getElementById('contactCard');
  contactDetails.classList.remove('infoboxClosed');
}

/**
 * Checks if the contactCard has the infoboxClosed class
 * If not, it makes `contactDetailsContainer` visible; otherwise, it hides it.
 */
function checkDetailsContainer() {
  container = document.getElementById('contactCard');
  detailCard = document.getElementById('contactDetailsContainer');
  if (!container.classList.contains('infoboxClosed')) {
    detailCard.style.display = "flex";
  } else {
    detailCard.style.display = "none";
  }
}

/**
 * Checks the window width on responsive, if smaller than 800px it fires 
 * checkDetailsContainer function
 */
function handleResize() {
  if (window.innerWidth < 800) {
    checkDetailsContainer();
  }
}

/**
 * Adds an event listener for handleResize
 */
window.addEventListener("resize", handleResize);
