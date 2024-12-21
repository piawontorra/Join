function clearAddTask() {
    let title = document.getElementById('inputTitle');
    let description = document.getElementById('inputDescription');
    let dueDate = document.getElementById('inputDueDate');

    title.value = '';
    description.value = '';
    assignedTo = [];
    showAssignedUsers();
    clearAssignedCheckboxes();
    dueDate.value = '';
    selectedPriority = "Medium";
    selectPriority(selectedPriority);
    selectedCategory = "Select task category";
    initializeCategory();
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

    console.log("Alle Assigned-To-Checkboxen und zugehörige Stile wurden zurückgesetzt.");
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

    if (titleInput.value.trim() === "") {
        titleInput.classList.add('error');
        titleInput.style.marginBottom = '';
        titleErrorMessage.style.display = 'block';

        setTimeout(function () {
            titleInput.classList.remove('error');
            titleErrorMessage.style.display = 'none';
        }, 2000);

        return false;
    } else {
        titleInput.classList.remove('error');
        titleErrorMessage.style.display = 'none';
        return true;
    }
}

function validateDueDate() {
    const dueDateInput = document.getElementById('inputDueDate');
    const dueDateErrorMessage = document.getElementById('inputDueDateError');

    if (dueDateInput.value.trim() === "") {
        dueDateInput.classList.add('error');
        dueDateErrorMessage.style.display = 'block';

        setTimeout(function () {
            dueDateInput.classList.remove('error');
            dueDateErrorMessage.style.display = 'none';
        }, 2000);

        return false;
    } else {
        dueDateInput.classList.remove('error');
        dueDateErrorMessage.style.display = 'none';
        return true;
    }
}

function resetErrorState() {
    const titleInput = document.getElementById('inputTitle');
    const dueDateInput = document.getElementById('inputDueDate');

    titleInput.classList.remove('error');
    document.getElementById('inputTitleError').style.display = 'none';

    dueDateInput.classList.remove('error');
    document.getElementById('inputDueDateError').style.display = 'none';
}
