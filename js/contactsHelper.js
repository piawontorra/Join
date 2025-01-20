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
  
  

function checkName() {
    let name = document.getElementById("newUserName");
    let isValid = /^[a-zA-ZäöüÄÖÜß\s]+ [a-zA-ZäöüÄÖÜß\s]+$/.test(name.value);
    if (!isValid) showError("nameError", "Please enter your full name", name);
    return isValid;
  }
  
function checkEmail() {
    let email = document.getElementById("newUserEmail");
    let isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!isValid) showError("emailError", "Please enter a valid email address", email);
    return isValid;
  }
  
function checkPhone() {
    let phoneNr = document.getElementById("newUserPhone");
    let isValid = /^\d{7,15}$/.test(phoneNr.value);
    if (!isValid) showError("phoneError", "Please enter a valid phone number (7-15 digits)", phoneNr);
    return isValid;
  }
  
function validateForm() {
    return checkName() & checkEmail() & checkPhone();
  }
  
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
  