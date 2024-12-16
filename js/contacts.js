let path = "/contacts";
let usersArray = [];
let userColorsPreset = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];

function initContacts() {
  includeHTML();
  getContacts(path);
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
  let contactsArray = Array.isArray(contactsJson)
    ? contactsJson
    : Object.values(contactsJson);
  usersArray = contactsArray.sort((current, next) =>
    current.name > next.name ? 1 : next.name > current.name ? -1 : 0
  );
  renderContacts(usersArray);
  console.log(usersArray);
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
      document.getElementById("contactsOverview").innerHTML += overviewTemplate(contacts,i,firstLetter,secondLetter
      );}
    }
}

function openContactDetailsCard(infoboxId) {
  let contactCard = document.getElementById('contactCard');
  if (contactCard) {
    if (contactCard.classList.contains("open")) {
      return
    }
    document.querySelector(`#${infoboxId}`).classList.add("open");
  }
}

function openNewContactCard() {
  let newContactCard = document.getElementById('newContactContainer');
  newContactCard.classList.add('open');
  }

  function closeNewContactCard(){
    let newContactCard = document.getElementById('newContactContainer');
    newContactCard.classList.remove('open');

  }

function contactDetailCard(id) {
    let contact = usersArray[id];
    let contactCardContainer = document.getElementById("contactCard");
    contactCardContainer.innerHTML = contactCardDetailsTemplate(id, contact);
  }

  // function highlightContactNavbar(){}

  
function newContact(){
  let userColor = createUserColor();
  let name = document.getElementById('contactName');
  let email = document.getElementById('contactEmail');
  let phone = document.getElementById('contactPhone');
  let key = name.value;

  newData = {
      name: name.value,
      email: email.value,
      phone: phone.value,
      userColor: userColor
  }
  addNewData(newData, "/contacts", key);
  document.getElementById('newContactForm').reset();
}

function createUserColor(){
  let randomNumber = Math.floor(Math.random()*15);
  let userColor = userColorsPreset[randomNumber];
  return userColor;
}


