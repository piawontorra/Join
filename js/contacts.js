let path = "/contacts";
let usersArray = [];

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
async function getContacts(path){
    let response = await fetch(BASE_URL + path + ".json");
    let contactsJson = await response.json();
    let contactsArray = Array.isArray(contactsJson) ? contactsJson : Object.values(contactsJson);
    let usersArray = contactsArray.sort((current, next) => current.name > next.name?1 : next.name > current.name ? -1 : 0 );
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
function renderContacts(contacts){
    document.getElementById('contactsOverview').innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        if (contacts[i] && contacts[i].name) {
            let firstLetter = contacts[i].name.charAt(0);
            let secondLetter = contacts[i].name.charAt(contacts[i].name.indexOf(" ")+1);
            document.getElementById('contactsOverview').innerHTML += overviewTemplate(contacts, i, firstLetter, secondLetter);
        } else {
            console.error("Ungültiger Kontakt an Index " + i);
        }
    }
}