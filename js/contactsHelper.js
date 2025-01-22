/**
 * Shows a popup notification when a new contact is created 
 */
function toggleAlert(){
    let overlay = document.getElementById('statusAlert');
    overlay.classList.add('open');
    setTimeout(() => {
    overlay.classList.remove('open');
    }, 2000);
  }

/**
 * gathers values from user input and returns it to the editContact function
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
 * @returns a background color for the new user out of preset colors
 */
function createUserColor(){
    let randomNumber = Math.floor(Math.random()*15);
    let userColor = userColorsPreset[randomNumber];
    return userColor;
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
  
  
/**
 * checks if the user name input is valid
 * First name and last name
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
      showError("nameError", "Please enter your full name with capitalized first letters", name);
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
    let isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!isValid) showError("emailError", "Please enter a valid email address", email);
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
    if (!isValid) showError("phoneError", "Please enter a valid phone number (7-15 digits)", phoneNr);
    return isValid;
  }

/**
 * checks if all ist true
 * @returns true/false
 */
function validateForm() {
    return checkName() & checkEmail() & checkPhone();
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

  function clearForm(){
    document.getElementById('newUserForm').reset();
  }