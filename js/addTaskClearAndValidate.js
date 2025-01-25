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
 * Validates the due date input.
 * 
 * @returns {boolean} Returns false if the due date is invalid, true otherwise.
 */
function validateDueDate() {
    const dueDateInput = document.getElementById('inputDueDate');
    const dueDateErrorMessage = document.getElementById('inputDueDateError');

    if (!validateDueDatePresence(dueDateInput, dueDateErrorMessage)) {
        return false;
    }
    if (!validateDueDateFormat(dueDateInput, dueDateErrorMessage)) {
        return false;
    }
    if (!validateDueDatePast(dueDateInput, dueDateErrorMessage)) {
        return false;
    }
    hideDueDateError(dueDateInput, dueDateErrorMessage);
    return true;
}

/**
 * Checks if the due date input is present.
 * 
 * @param {HTMLInputElement} dueDateInput - The due date input field.
 * @param {HTMLElement} dueDateErrorMessage - The error message element.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateDueDatePresence(dueDateInput, dueDateErrorMessage) {
    if (isDueDateEmpty(dueDateInput)) {
        showDueDateError(dueDateInput, dueDateErrorMessage, "This field is required.");
        return false;
    }
    return true;
}

/**
 * Checks if the due date input has a valid format.
 * 
 * @param {HTMLInputElement} dueDateInput - The due date input field.
 * @param {HTMLElement} dueDateErrorMessage - The error message element.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateDueDateFormat(dueDateInput, dueDateErrorMessage) {
    const dateValidationError = isValidDateFormat(dueDateInput.value);
    if (dateValidationError) {
        showDueDateError(dueDateInput, dueDateErrorMessage, dateValidationError);
        return false;
    }
    return true;
}

/**
 * Checks if the due date input is in the past.
 * 
 * @param {HTMLInputElement} dueDateInput - The due date input field.
 * @param {HTMLElement} dueDateErrorMessage - The error message element.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateDueDatePast(dueDateInput, dueDateErrorMessage) {
    if (isDateInPast(dueDateInput.value)) {
        showDueDateError(dueDateInput, dueDateErrorMessage, "The date cannot be in the past.");
        return false;
    }
    return true;
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
 * Checks whether the due date follows a valid format (dd/mm/yyyy) and represents a real date.
 * 
 * @param {string} date - The due date string.
 * @returns {string|null} Returns an error message if the date is invalid, or null if the date is valid.
 */
function isValidDateFormat(date) {
    if (!isMatchingDatePattern(date)) {
        return "Invalid date format. Use dd/mm/yyyy.";
    }

    const [day, month, year] = date.split("/").map(Number);

    if (!areDateComponentsRealistic(day, month, year)) {
        return "Invalid date, this date is not possible or realistic.";
    }

    if (!isDateParsable(day, month, year)) {
        return "Invalid date, this date is not possible.";
    }

    return null;
}

/**
 * Checks if the date matches the pattern dd/mm/yyyy.
 * 
 * @param {string} date - The due date string.
 * @returns {boolean} Returns true if the date matches the pattern, false otherwise.
 */
function isMatchingDatePattern(date) {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dateRegex.test(date);
}

/**
 * Validates whether the date components are within a realistic range.
 * 
 * @param {number} day - The day of the date.
 * @param {number} month - The month of the date.
 * @param {number} year - The year of the date.
 * @returns {boolean} Returns true if the components are realistic, false otherwise.
 */
function areDateComponentsRealistic(day, month, year) {
    return month >= 1 && month <= 12 &&
        day >= 1 && day <= 31 &&
        year >= 1900 && year <= 2100;
}

/**
 * Validates whether the date is parsable and represents a real date.
 * 
 * @param {number} day - The day of the date.
 * @param {number} month - The month of the date.
 * @param {number} year - The year of the date.
 * @returns {boolean} Returns true if the date is valid, false otherwise.
 */
function isDateParsable(day, month, year) {
    const parsedDate = new Date(year, month - 1, day);
    return parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getDate() === day;
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