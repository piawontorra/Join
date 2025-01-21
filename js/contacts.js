let path = "contacts";
let usersArray = [];
let userColorsPreset = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

function initContacts() {
  includeHTML();
  getContacts(path);
}

/**
 * creates a new contact and saves it in the database
 * colecting data from user input as name, email and phone number
 * update contact list and reload it
 */
async function newContact(){
  let userColor = createUserColor();
  let name = document.getElementById('newUserName');
  let email = document.getElementById('newUserEmail');
  let phone = document.getElementById('newUserPhone');
  let key = await getNextID();
  newData = {
      name: name.value,email: email.value,
      phone: phone.value,userColor: userColor, userId: key
  }
  addNewData(newData, "/contacts", key);
  closeDialog("[newContactDialog]");
  nextIdToDatabase(key);
  setTimeout(()=>{getContacts(path)}, 200);
  setTimeout(()=>{chooseNewContact(key);}, 300);
  location.reload();
}

/**
 * choose the last created contact, add background color on overview and show the detail page
 * @param {number} key 
 */
function chooseNewContact(key){
  let index = usersArray.findIndex(user => user.id == key);
  addBackground(index);
  openContactDetailsCard('contactCard');
  contactDetailCard(index);
}

/**
 * pushes new Data to firebase database
 * @param {Object} data - The data that will be stored
 * @param {string} path - The database path
 * @param {string} key - a key under which the data will be stored
 * @returns {Promise<void>} A promise that resolves when the record is successfully added.
 */
 async function addNewData(data, path, key){
  let response = await fetch(`${BASE_URL}${path}/${key}.json`,{
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
  });
}

/**
 * Edit an existing contact and updates the database
 * 
 * This function get updated contact data and updates the database,
 * and refreshes the UI to show the changes.
 * 
 * @param {Object[]} user - An array containing the contact object to be edited. 
 */
async function editContact(id, key){
  let updatedData = getUpdatedData();
  // let key = id;
  
  await updateData(updatedData, "contacts", key);
  const index = usersArray.findIndex(contact => contact.userId == key);
  if (index !== -1) {
    usersArray[index] = { ...usersArray[index], ...updatedData };
  }
  currentUser = [{ ...currentUser[0], ...updatedData }];
  closeDialog("[editContactDialog]");
  renderContacts(usersArray);
  contactDetailCard(index);
  addBackground(index);
}

/**
 * This function sends a PATCH request to the database (firebase) update a resource at the specified database path and key
 * with the provided data.
 * 
 * @param {Object} data - The data object containing the updated values for the resource.
 * @param {string} path - The database path where the resource is located.
 * @param {string|number} key - The unique identifier of the resource to be updated.
 * 
 */
 async function updateData(data, path, key){
  await fetch(`${BASE_URL}${path}/${key}.json`,{
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
  });
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
function showDetailsResponsive(){
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
function closeDetailsResponsive(){
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
 * fetches the database and lookin for the current userID
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
function addBackground(id){
  let allEntries = document.querySelectorAll('.singleEntry');
  allEntries.forEach(singleEntry => singleEntry.classList.remove('chosen'));
  document.getElementById(`${id}`).classList.add('chosen');
}

/**
 * open up the dialog for new contact form
 */
function openDialog(){
  let modal = document.querySelector("[newContactDialog]");
  modal.showModal();
  setTimeout(() => {
    modal.classList.add('open');
  }, 0);
  renderNewContactForm();
}

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
function openEditDialog(user, id) {
  const modal = document.querySelector("[editContactDialog]");
  modal.showModal();
  setTimeout(() => {
    modal.classList.add('open');
  }, 10);
  renderEditContactForm(user, id);
}

/**
 * open up the a dialog in mobile view for further funtions
 * functions: edit and delete
 */
function openMenuDialog(){
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
    ){
      closeMoreDialog();
    }
}

/**
 * renders the edit contact form into modal and validate the user inputs
 * @param {array} user 
 * @param {string} id 
 */
function renderEditContactForm(user, id) {  
  const container = document.getElementById('editContactDialog');
  container.innerHTML = editContactTemplate(user, id);
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
}

/**
 * removes the closed class to showup the dialog
 */
function removeClosed(){
  let contactDetails = document.getElementById('contactCard');
  contactDetails.classList.remove('infoboxClosed');
}

/**
 * Checks if the contactCard has the infoboxClosed class
 * If not, it makes `contactDetailsContainer` visible; otherwise, it hides it.
 */
function checkDetailsContainer(){
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
 * */
window.addEventListener("resize", handleResize);