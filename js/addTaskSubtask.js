function changeButtons() {
    const plusButton = document.getElementById('inputOffButton');
    const closeAndCheckButtons = document.getElementById('inputOnButtons');
    const divButtons = document.getElementById('containerButtons')

    plusButton.style.display = 'none';
    closeAndCheckButtons.style.display = '';
    divButtons.style.top = '42px';
}

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

function renderSubtasks() {
    let subtask = document.getElementById('subtask');
    subtask.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        subtask.innerHTML += getSubtaskTemplate(i);
    }
}

function addSubtask() {
    let input = document.getElementById('inputSubtask').value;
    if (input == '') {
      document.getElementById('inputSubtask').placeholder = 'Bitte etwas eingeben!';
      return;
    }
    if (subtasks.length < 5) {
      document.getElementById('inputSubtask').placeholder = 'Add new Subtask';
      let newTask = { text: input, completed: false };
      subtasks.push(newTask);
      renderSubtasks();
      document.getElementById('inputSubtask').value = '';
      resetButtons();
    }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtask();
  }
}

function handleKeyPressEdit(event, i) {
  if (event.key === "Enter") {
    event.preventDefault();
    checkSubtask(i);
  }
}
  
function deleteSubtask(i) {
    subtasks.splice(i, 1);
    renderSubtasks();
    document.getElementById('inputSubtask').value = '';
    document.getElementById('inputSubtask').readOnly = false;
    document.getElementById('inputSubtask').style = 'color:black;';
}
  
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

function checkSubtask(i) {
  subtasks[i].text = document.getElementById(`subtaskList${i}`).value;
  renderSubtasks();
}