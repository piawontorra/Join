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
        showDueDateError(dueDateInput, dueDateErrorMessage, "This field is required.");
        return false;
    } else if (!isValidDateFormat(dueDateInput.value)) {
        showDueDateError(dueDateInput, dueDateErrorMessage, "Invalid date format. Use dd/mm/yyyy.");
        return false;
    } else if (isDateInPast(dueDateInput.value)) {
        showDueDateError(dueDateInput, dueDateErrorMessage, "The date cannot be in the past.");
        return false;
    } else {
        hideDueDateError(dueDateInput, dueDateErrorMessage);
        return true;
    }
}

function isDueDateEmpty(dueDateInput) {
    return dueDateInput.value.trim() === "";
}

function isValidDateFormat(date) {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(date);
}

function isDateInPast(date) {
    const [day, month, year] = date.split("/").map(Number);
    const enteredDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return enteredDate < today;
}

function showDueDateError(dueDateInput, dueDateErrorMessage, message) {
    dueDateInput.classList.add('error');
    dueDateErrorMessage.textContent = message;
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
