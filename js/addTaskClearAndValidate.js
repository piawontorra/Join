/**
 * Clears all form fields and resets task-related data such as assigned users, priority, category, and subtasks.
 */
function clearAddTask() {
    clearFormFields();
    resetAssignedUsers();
    resetPriority();
    resetCategory();
    resetSubtasks();
}

/**
 * Clears all the form fields such as title, description, and due date.
 */
function clearFormFields() {
    document.getElementById('inputTitle').value = '';
    document.getElementById('inputDescription').value = '';
    document.getElementById('inputSubtask').value = '';
    document.getElementById('inputDueDate').value = '';
}

/**
 * Resets the assigned users by clearing the assigned list and unchecking all user checkboxes.
 */
function resetAssignedUsers() {
    assignedTo = [];
    showAssignedUsers();
    clearAssignedCheckboxes();
}

/**
 * Resets the priority selection to "Medium" and updates the priority display.
 */
function resetPriority() {
    selectedPriority = "Medium";
    selectPriority(selectedPriority);
}

/**
 * Resets the task category to the default "Select task category" and reinitializes the category options.
 */
function resetCategory() {
    selectedCategory = "Select task category";
    initializeCategory();
}

/**
 * Resets the subtasks list and re-renders the empty subtask list.
 */
function resetSubtasks() {
    subtasks = [];
    renderSubtasks();
}

/**
 * Clears the checkboxes for assigned users by unchecking all checkboxes and calling the change handler.
 */
function clearAssignedCheckboxes() {
    const checkboxes = document.querySelectorAll('#users .user-checkbox');

    checkboxes.forEach(checkbox => {
        const userId = checkbox.id.split('-')[1];
        checkbox.checked = false;
        handleCheckboxChange(userId);
    });
}

/**
 * Validates that a category has been selected. If not, it highlights the category input field in red for 2 seconds.
 * 
 * @returns {boolean} Returns false if no category is selected, true otherwise.
 */
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

/**
 * Validates that the title input is not empty. Displays an error message if the title is empty.
 * 
 * @returns {boolean} Returns false if the title is empty, true otherwise.
 */
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

/**
 * Checks whether the title input is empty.
 * 
 * @param {HTMLInputElement} titleInput - The title input field.
 * @returns {boolean} Returns true if the title is empty, false otherwise.
 */
function isTitleEmpty(titleInput) {
    return titleInput.value.trim() === "";
}

/**
 * Displays an error message for the title input if it's empty.
 * 
 * @param {HTMLInputElement} titleInput - The title input field.
 * @param {HTMLElement} titleErrorMessage - The element where the error message is displayed.
 */
function showTitleError(titleInput, titleErrorMessage) {
    titleInput.classList.add('error');
    titleInput.style.marginBottom = '';
    titleErrorMessage.style.display = 'block';
    
    setTimeout(function () {
        titleInput.classList.remove('error');
        titleErrorMessage.style.display = 'none';
    }, 2000);
}

/**
 * Hides the error message for the title input.
 * 
 * @param {HTMLInputElement} titleInput - The title input field.
 * @param {HTMLElement} titleErrorMessage - The element where the error message is displayed.
 */
function hideTitleError(titleInput, titleErrorMessage) {
    titleInput.classList.remove('error');
    titleErrorMessage.style.display = 'none';
}

/**
 * Validates the due date input. Checks if the date is empty, in an invalid format, or in the past.
 * 
 * @returns {boolean} Returns false if the due date is invalid, true otherwise.
 */
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

/**
 * Checks whether the due date input is empty.
 * 
 * @param {HTMLInputElement} dueDateInput - The due date input field.
 * @returns {boolean} Returns true if the due date is empty, false otherwise.
 */
function isDueDateEmpty(dueDateInput) {
    return dueDateInput.value.trim() === "";
}

/**
 * Checks whether the due date follows a valid format (dd/mm/yyyy).
 * 
 * @param {string} date - The due date string.
 * @returns {boolean} Returns true if the date format is valid, false otherwise.
 */
function isValidDateFormat(date) {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(date);
}

/**
 * Checks if the provided due date is in the past compared to the current date.
 * 
 * @param {string} date - The due date string (dd/mm/yyyy).
 * @returns {boolean} Returns true if the date is in the past, false otherwise.
 */
function isDateInPast(date) {
    const [day, month, year] = date.split("/").map(Number);
    const enteredDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return enteredDate < today;
}

/**
 * Displays an error message for the due date input with a custom message.
 * 
 * @param {HTMLInputElement} dueDateInput - The due date input field.
 * @param {HTMLElement} dueDateErrorMessage - The element where the error message is displayed.
 * @param {string} message - The custom error message to be displayed.
 */
function showDueDateError(dueDateInput, dueDateErrorMessage, message) {
    dueDateInput.classList.add('error');
    dueDateErrorMessage.textContent = message;
    dueDateErrorMessage.style.display = 'block';
    
    setTimeout(function () {
        dueDateInput.classList.remove('error');
        dueDateErrorMessage.style.display = 'none';
    }, 2000);
}

/**
 * Hides the error message for the due date input.
 * 
 * @param {HTMLInputElement} dueDateInput - The due date input field.
 * @param {HTMLElement} dueDateErrorMessage - The element where the error message is displayed.
 */
function hideDueDateError(dueDateInput, dueDateErrorMessage) {
    dueDateInput.classList.remove('error');
    dueDateErrorMessage.style.display = 'none';
}

/**
 * Resets the error state of the title and due date inputs by removing error styles and hiding error messages.
 */
function resetErrorState() {
    const titleInput = document.getElementById('inputTitle');
    const dueDateInput = document.getElementById('inputDueDate');

    titleInput.classList.remove('error');
    document.getElementById('inputTitleError').style.display = 'none';

    dueDateInput.classList.remove('error');
    document.getElementById('inputDueDateError').style.display = 'none';
}