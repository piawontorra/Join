let path = "contacts";
let usersArray = [];
let userColorsPreset = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

function initContacts() {
  includeHTML();
  getContacts(path);
}

function toggleOverlay(){
  let overlay = document.getElementById('overlay');
  overlay.classList.remove('d-none');
  setTimeout(()=>{openNewContactCard()}, 10);
}

function closeOverlay(){
  let overlay = document.getElementById('overlay');
  overlay.classList.add('d-none');
  // setTimeout(()=>{overlay.classList.add('d-none');}, 1000);
}

function toggleAlert(){
  let overlay = document.getElementById('statusAlert');
  overlay.classList.add('open');
  setTimeout(() => {
    overlay.classList.remove('open');
}, 2000); // 2 Sekunden bleibt die Nachricht sichtbar
}

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
  closeNewContactCard();
  nextIdToDatabase(key);
  setTimeout(()=>{getContacts(path)}, 100);
}

/**
 @param {Object} data - The data to be stored.
 * @param {string} path - The database path where the data should be stored.
 * @param {string} key - The unique key under which the data will be stored.
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

function getUpdatedData() {
  return {
      name: document.getElementById('newUserName').value,
      email: document.getElementById('newUserEmail').value,
      phone: document.getElementById('newUserPhone').value
  };
}

async function editContact(user){
  let updatedData = getUpdatedData();
  let key = user[0].id;
  await updateData(updatedData, "contacts", key);
  const index = usersArray.findIndex(contact => contact.id === key);
  if (index !== -1) {
    usersArray[index] = { ...usersArray[index], ...updatedData };
  }
  currentUser = [{ ...currentUser[0], ...updatedData }];
  closeNewContactCard();
  renderContacts(usersArray);
  contactDetailCard(index);
  addBackground(index);
}

 async function updateData(data, path, key){
  let response = await fetch(`${BASE_URL}${path}/${key}.json`,{
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
  });
}

async function getUsers(path){
  let response = await fetch(BASE_URL + path + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}

/**
 * Asynchronously fetches contact data from a given path, sorts the contacts by name,
 * and renders them in the UI.
 *
 * @async
 * @function getContacts
 * @param {string} path - The relative path to fetch contact data from the API.
 * @returns {Promise<void>} - A promise that resolves when the contacts are fetched and rendered.
 *
 */
async function getContacts(path) {
  let response = await fetch(BASE_URL + path + ".json");
  let contactsJson = await response.json();
  let contactsArray = [];
  for (let key in contactsJson){
    contactsArray.push({id: key, ...contactsJson[key]})
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
 *
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
        contactsOverview.innerHTML += `<div class="letter-group">${currentLetter}</div><div id="seperator"></div>`;
      }
      document.getElementById("contactsOverview").innerHTML += overviewTemplate(contacts,i,firstLetter,secondLetter);}
    }
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
      return
    }
    document.querySelector(`#${infoboxId}`).classList.add("open");
  }
}

/**
 * Opens the new contact card by adding the "open" class to the container
 * firing the getNextID to get the next available userID
 */
function openNewContactCard() {
  let newContactCard = document.getElementById('newContactContainer');
  newContactCard.classList.add('open');
  }

function closeNewContactCard(){
    let newContactCard = document.getElementById('newContactContainer');
    let overlay = document.getElementById('overlay');
    newContactCard.classList.remove('open');
    setTimeout(()=>{overlay.classList.add('d-none')}, 400);
    document.getElementById("newUserForm").reset();
  }

function newUserCard() {
  let newContactContainer = document.getElementById("newContactContainer");
  newContactContainer.innerHTML = newContactTemplate();
}

/**
 * 
 * @returns a background color for the new user out of preset colors
 * 
 */
function createUserColor(){
  let randomNumber = Math.floor(Math.random()*15);
  let userColor = userColorsPreset[randomNumber];
  return userColor;
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
 * writing the next available ID into the database
 * @param {number} nextID 
 */
async function nextIdToDatabase(nextID){
  await fetch(`${BASE_URL}/nextID.json`, {
    method: 'PUT',
    body: JSON.stringify(nextID + 1),
  })
}
  
async function deleteContact(entryId){
  let dbRef = (BASE_URL + path + "/" + entryId);
  console.log(dbRef);
  let response = await fetch(dbRef + ".json", {
    method: "DELETE", 
    });
    closeContactDetailsCard();
    getContacts(path);
  }

function closeContactDetailsCard() {
  let contactCard = document.getElementById('contactCard');
  contactCard.classList.remove("open");
}

function addBackground(id){
  let allEntries = document.querySelectorAll('.singleEntry');
  allEntries.forEach(singleEntry => singleEntry.classList.remove('chosen'));
  document.getElementById(`${id}`).classList.add('chosen');;
}

function openEditForm(contact, id){
  let newContactContainer = document.getElementById("newContactContainer");
  newContactContainer.innerHTML = editContactTemplate(contact, id);
  
}