function clearAddTask() {
    clearFormFields();
    resetAssignedUsers();
    resetPriority();
    resetCategory();
    resetSubtasks();
}

function clearFormFields() {
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputDescription').value = '';
    document.getElementById('inputDueDate').value = '';
}

function resetAssignedUsers() {
    assignedTo = [];
    showAssignedUsers();
    clearAssignedCheckboxes();
}

function resetPriority() {
    selectedPriority = "Medium";
    selectPriority(selectedPriority);
}

function resetCategory() {
    selectedCategory = "Select task category";
    initializeCategory();
}

function resetSubtasks() {
    subtasks = [];
    renderSubtasks();
}

function clearAssignedCheckboxes() {
    const checkboxes = document.querySelectorAll('#users .user-checkbox');

    checkboxes.forEach(checkbox => {
        const userId = checkbox.id.split('-')[1];
        checkbox.checked = false;
        handleCheckboxChange(userId);
    });
}

function validateCategory() {
    let selectedCategoryElement = document.getElementById('categoryInput');
    let placeholderInput = document.getElementById('selectedCategory');

    if (selectedCategory === 'Select task category') {
        selectedCategoryElement.style.border = "1px solid red";
        placeholderInput.style.color = "red";
        setTimeout(() => {
            selectedCategoryElement.style.border = "";
            placeholderInput.style.color = "";
        }, 2000);
        return false;
    }

    return true;
}

function validateTitle() {
    const titleInput = document.getElementById('inputTitle');
    const titleErrorMessage = document.getElementById('inputTitleError');

    if (isTitleEmpty(titleInput)) {
        showTitleError(titleInput, titleErrorMessage);
        return false;
    } else {
        hideTitleError(titleInput, titleErrorMessage);
        return true;
    }
}

function isTitleEmpty(titleInput) {
    return titleInput.value.trim() === "";
}

function showTitleError(titleInput, titleErrorMessage) {
    titleInput.classList.add('error');
    titleInput.style.marginBottom = '';
    titleErrorMessage.style.display = 'block';
    
    setTimeout(function () {
        titleInput.classList.remove('error');
        titleErrorMessage.style.display = 'none';
    }, 2000);
}

function hideTitleError(titleInput, titleErrorMessage) {
    titleInput.classList.remove('error');
    titleErrorMessage.style.display = 'none';
}

function validateDueDate() {
    const dueDateInput = document.getElementById('inputDueDate');
    const dueDateErrorMessage = document.getElementById('inputDueDateError');

    if (isDueDateEmpty(dueDateInput)) {
        showDueDateError(dueDateInput, dueDateErrorMessage);
        return false;
    } else {
        hideDueDateError(dueDateInput, dueDateErrorMessage);
        return true;
    }
}

function isDueDateEmpty(dueDateInput) {
    return dueDateInput.value.trim() === "";
}

function showDueDateError(dueDateInput, dueDateErrorMessage) {
    dueDateInput.classList.add('error');
    dueDateErrorMessage.style.display = 'block';
    
    setTimeout(function () {
        dueDateInput.classList.remove('error');
        dueDateErrorMessage.style.display = 'none';
    }, 2000);
}

function hideDueDateError(dueDateInput, dueDateErrorMessage) {
    dueDateInput.classList.remove('error');
    dueDateErrorMessage.style.display = 'none';
}

function resetErrorState() {
    const titleInput = document.getElementById('inputTitle');
    const dueDateInput = document.getElementById('inputDueDate');

    titleInput.classList.remove('error');
    document.getElementById('inputTitleError').style.display = 'none';

    dueDateInput.classList.remove('error');
    document.getElementById('inputDueDateError').style.display = 'none';
}
