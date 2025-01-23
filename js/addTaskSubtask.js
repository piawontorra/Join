/**
 * Changes the state of the task input buttons to show the 'close' and 'check' buttons.
 * Hides the 'plus' button and adjusts the positioning of the buttons container.
 */
function changeButtons() {
  const plusButton = document.getElementById('inputOffButton');
  const closeAndCheckButtons = document.getElementById('inputOnButtons');
  const divButtons = document.getElementById('containerButtons');

  plusButton.style.display = 'none';
  closeAndCheckButtons.style.display = '';
  divButtons.style.top = '42px';
}

/**
* Resets the task input buttons to their initial state.
* This includes hiding the 'close' and 'check' buttons, 
* showing the 'plus' button, and clearing the input field.
*/
function resetButtons() {
  const plusButton = document.getElementById('inputOffButton');
  const closeAndCheckButtons = document.getElementById('inputOnButtons');
  const divButtons = document.getElementById('containerButtons');
  subtask = document.getElementById('inputSubtask');

  subtask.value = '';
  plusButton.style.display = 'flex';
  closeAndCheckButtons.style.display = 'none';
  divButtons.style.top = '';
}

/**
* Renders all subtasks by iterating through the subtasks array
* and generating the HTML for each subtask using the `getSubtaskTemplate` function.
*/
function renderSubtasks() {
  let subtask = document.getElementById('subtask');
  subtask.innerHTML = '';
  for (let i = 0; i < subtasks.length; i++) {
    subtask.innerHTML += getSubtaskTemplate(i);
  }
}

/**
 * Adds a new subtask to the subtasks list. 
 * If the input field is empty, it shows a placeholder warning.
 * Adds the new subtask and resets the input field and buttons.
 */
function addSubtask() {
  let input = document.getElementById('inputSubtask').value;
  if (input == '') {
    document.getElementById('inputSubtask').placeholder = 'Bitte etwas eingeben!';
    return;
  }
  
  document.getElementById('inputSubtask').placeholder = 'Add new Subtask';
  let newTask = { text: input, completed: false };
  subtasks.push(newTask);
  renderSubtasks();
  document.getElementById('inputSubtask').value = '';
  resetButtons();
}

/**
* Handles the 'Enter' key press event in the subtask input field.
* If the 'Enter' key is pressed, it calls the `addSubtask` function.
* 
* @param {KeyboardEvent} event - The keyboard event triggered by the key press.
*/
function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtask();
  }
}

/**
* Handles the 'Enter' key press event in the subtask edit field.
* If the 'Enter' key is pressed, it calls the `checkSubtask` function to save the changes.
* 
* @param {KeyboardEvent} event - The keyboard event triggered by the key press.
* @param {number} i - The index of the subtask being edited.
*/
function handleKeyPressEdit(event, i) {
  if (event.key === "Enter") {
    event.preventDefault();
    checkSubtask(i);
  }
}

/**
* Deletes a subtask from the subtasks list by its index and re-renders the subtasks list.
* Resets the input field to be empty and editable.
* 
* @param {number} i - The index of the subtask to be deleted.
*/
function deleteSubtask(i) {
  subtasks.splice(i, 1);
  renderSubtasks();
  document.getElementById('inputSubtask').value = '';
  document.getElementById('inputSubtask').readOnly = false;
  document.getElementById('inputSubtask').style = 'color:black;';
}

/**
* Edits a specific subtask by making the subtask input field editable and displaying the edit icons.
* Changes the styling of the subtask to indicate it's in edit mode.
* 
* @param {number} i - The index of the subtask to be edited.
*/
function editSubtask(i) {
  document.getElementById(`subtaskList${i}`).readOnly = false;
  edit = document.getElementById(`edit-images${i}`);
  edit.innerHTML = editSubtaskHTML(i);
  document
    .getElementById(`mainSubtask-container${i}`)
    .classList.remove('subtask-list');
  document
    .getElementById(`mainSubtask-container${i}`)
    .classList.add('edit-subtask-list');
  document.getElementById(`edit-images${i}`).classList.add('flex');
}

/**
* Saves the edited subtask and re-renders the subtasks list.
* 
* @param {number} i - The index of the subtask to be updated.
*/
function checkSubtask(i) {
  const subtaskInputContainer = document.getElementById(`mainSubtask-container${i}`)
  const subtaskInput = document.getElementById(`subtaskList${i}`);
  const subtaskText = subtaskInput.value;

  if (subtaskText.trim() === '') {
    subtaskInputContainer.style.borderColor = 'red';
  } else {
    subtaskInputContainer.style.borderColor = '';
    subtasks[i].text = subtaskText;
    renderSubtasks();
  }
}