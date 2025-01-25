/**
 * Generates the HTML for a task card to be displayed on the task board.
 * @async
 * @param {Object} task - The task object containing the necessary data.
 * @param {number} task.id - The unique ID of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.priority - The priority level of the task (e.g., "Urgent", "Medium", "Low").
 * @param {string} task.category - The category of the task (e.g., "User Story", "Technical Task").
 * @param {Array<Object>} [task.assignedTo] - The list of users assigned to the task.
 * @param {Array<Object>} [task.subtasks] - The list of subtasks associated with the task.
 * @param {boolean} task.subtasks[].completed - Whether a subtask is completed.
 * @returns {Promise<string>} The HTML string for the task card.
 */
async function getTaskCardTemplate(task) {
    let icon = priorityIcons[task.priority];

    const assignedUserData = task.assignedTo && Array.isArray(task.assignedTo)
        ? await getAssignedUserInitialsAndColor(task.assignedTo)
        : [];

    let assignedToHTML = assignedUserData.slice(0, 4)
        .map(user =>
            `<div class="task-user-icon" style="background-color: ${user.color};">
                ${user.initials}
            </div>`
        )
        .join("");

    if (assignedUserData.length > 4) {
        const remainingUsersCount = assignedUserData.length - 4;
        assignedToHTML += `<div class="task-user-icon more-users">
                            +${remainingUsersCount}
                          </div>`;
    }

    let descriptionSection = task.description
        ? `<p class="task-description">${task.description}</p>`
        : "";

    const subtasks = task.subtasks || [];
    const completedCount = subtasks.filter(subtask => subtask.completed).length;
    const totalSubtasks = subtasks.length;
    const progressPercentage = totalSubtasks > 0 ? (completedCount / totalSubtasks) * 100 : 0;

    let subtasksSection = totalSubtasks > 0
        ? `<div class="taskcard-subtask">
               <div class="task-progress-bar-container">
                   <div class="task-progress-bar" style="width: ${progressPercentage}%"></div>
               </div>
               <p>${completedCount}/${totalSubtasks} Subtasks</p>
           </div>`
        : "";

    const categoryColors = {
        "User Story": "#0038FF",
        "Technical Task": "#1FD7C1"
    };
    const categoryColor = categoryColors[task.category] || "#CCCCCC";

    return `<div class="task-card" data-task-id="${task.id}" draggable="true" ondragstart="dragTask(${task.id})" onclick="openTaskDetail('${task.id}')">
                <div class="task-card-head">
                    <div class="task-category">
                        <p style="background-color: ${categoryColor};">${task.category}</p>
                    </div>
                    <div>
                        <div onclick="showMoveTo(event)" class="task-card-menu">
                            <img src="./assets/img/more_vert_icon.svg">
                        </div>
                    </div>
                </div>
                <div class="task-card-header">
                    <p class="task-title">${task.title}</p>
                    ${descriptionSection}
                </div>
                ${subtasksSection}
                <div class="task-user-and-priority">
                    <div class="task-assigned-to">
                    ${assignedToHTML}
                    </div>
                    <img src="${icon}"> 
                </div>
                <div class="task-card-menu-pop-up" id="task-menu-pop-up-${task.id}">
                    <p onclick="moveTaskToCategory(event, '${task.id}', 'todo')">To Do</p>
                    <p onclick="moveTaskToCategory(event, '${task.id}', 'in-progress')">In Progress</p>
                    <p onclick="moveTaskToCategory(event, '${task.id}', 'await-feedback')">Await Feedback</p>
                    <p onclick="moveTaskToCategory(event, '${task.id}', 'done')">Done</p>
                </div>
            </div>`;
}

/**
 * Generates the HTML for a detailed task card to be displayed in a modal or detail view.
 * @async
 * @param {Object} task - The task object containing detailed information.
 * @param {number} task.id - The unique ID of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} [task.description] - The description of the task.
 * @param {string} [task.priority] - The priority level of the task (e.g., "Urgent", "Medium", "Low").
 * @param {string} [task.category] - The category of the task (e.g., "User Story", "Technical Task").
 * @param {string} [task.dueDate] - The due date of the task.
 * @param {Array<Object>} [task.assignedTo] - The list of users assigned to the task.
 * @param {string} task.assignedTo[].name - The name of the assigned user.
 * @param {string} task.assignedTo[].color - The color associated with the assigned user.
 * @param {string} task.assignedTo[].initials - The initials of the assigned user.
 * @param {Array<Object>} [task.subtasks] - The list of subtasks associated with the task.
 * @param {string} task.subtasks[].text - The text of the subtask.
 * @param {boolean} task.subtasks[].completed - Whether a subtask is completed.
 * @returns {Promise<string>} The HTML string for the detailed task card.
 */
async function getDetailTaskCardTemplate(task) {
    let icon = priorityIcons[task.priority];

    const assignedUserData = await getAssignedUserInitialsAndColor(task.assignedTo || []);
    let assignedToHTML = assignedUserData.length > 0
        ? assignedUserData
            .map(user =>
                `<div class="detail-task-assigned-to">
                <div class="detail-task-user-icon" style="background-color: ${user.color};">
                    ${user.initials}
                </div>
                <p>${user.name}</p>
            </div>`
            )
            .join("")
        : "";

    const categoryColors = {
        "User Story": "#0038FF",
        "Technical Task": "#1FD7C1"
    };
    const categoryColor = categoryColors[task.category] || "#CCCCCC";

    return `
        <div class="detail-task-card">
            <div class="detail-task-header">
                <div class="detail-task-category" style="background-color: ${categoryColor};">
                    <p>${task.category}</p>
                </div>
                <div class="close-btn">
                    <img src="./assets/img/cancel_icon.png" onclick="closeTaskDetail()">
                </div>
            </div>
            <span class="task-detail-headline">${task.title}</span>
            <p class="detail-task-description">${task.description || ""}</p>
            <div class="detail-task-horizontal">
                <p class="width100 navyblue-font">Due date:</p>
                <p>${task.dueDate || "No due date"}</p>
            </div>
            <div class="detail-task-horizontal">
                <p class="width100 navyblue-font">Priority:</p>
                <div class="detail-task-priority">
                    <p>${task.priority || "Medium"}</p>
                    <img src="${icon || ''}"> 
                </div>
            </div>
            <div>
                <p class="detail-assigned-to-headline navyblue-font">Assigned to:</p>
                <div class="detail-task-assigned-user">
                    ${assignedToHTML}
                </div>
            </div>
            <div class="detail-task-subtasks-content">
                <p class="navyblue-font">Subtasks</p>
                <div class="detail-task-subtasks-container">
                    ${(task.subtasks || [])
            .map((subtask, index) => `
                            <label class="detail-task-subtask-item">
                                <input 
                                    type="checkbox" 
                                    class="subtask-checkbox" 
                                    ${subtask.completed ? "checked" : ""}
                                    onchange="handleSubtaskCheckboxChange(event, tasksData.find(t => t.id === ${task.id}), ${index})"
                                >
                                ${subtask.text}
                            </label>
                        `)
            .join("")}
                </div>
            </div>
            <div class="detail-delete-edit-content">
                <div onclick="deleteTask('${task.id}', '${task.status}')" class="detail-delete-edit">
                    <img src="./assets/img/delete_icon.svg">
                    <p>Delete</p>
                </div>
                <div class="seperator"></div>
                <div onclick="renderTaskEditor(this.dataset.task)" data-task='${JSON.stringify(task)}' class="detail-delete-edit">
                    <img class="width28" src="./assets/img/edit_icon.svg">
                    <p>Edit</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generates the HTML template for displaying a message when there are no tasks in a given status.
 * @param {string} status - The status of the tasks (e.g., "To Do", "In Progress", "Done").
 * @returns {string} The HTML string for the "no tasks" message.
 */
function getNoTasksTemplate(status) {
    return `
        <div class="no-tasks-message">
            <p>No tasks ${status}</p>
        </div>
    `;
}

/**
 * Generates the HTML template for the task editor form, allowing users to edit task details.
 * 
 * @param {Object} task - The task object containing the details to populate the editor form.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.dueDate - The due date of the task in dd/mm/yyyy format.
 * @param {string} task.priority - The priority level of the task (e.g., "Urgent", "Medium", "Low").
 * @param {Array} task.assignedTo - List of users assigned to the task.
 * @returns {string} The HTML string for the task editor form.
 */
function getTaskEditorTemplate(task) {
    return `
        <form id="add-task-form">
            <div class="edit-task-form">
                <div class="edit-task-header">
                    <div class="close-edit-btn">
                        <img src="./assets/img/cancel_icon.png" onclick="closeTaskEditor()">
                    </div>
                </div>
                <div class="edit-task-content">
                    <div class="edit-task-form-content">
                        <div>
                            <label for="inputTitle">
                                <p class="editor-title">Title</p>
                                <p class="rosa-font">*</p>
                            </label>
                            <input class="add-task-input-fields" id="inputTitle" type="text" placeholder="Enter a title"
                                autocomplete="off" value="${task.title}">
                            <span id="inputTitleError" class="error-message" style="display: none;">This field is required</span>
                        </div>
                        <div class="task-description">
                            <label for="inputDescription">Description</label>
                            <textarea class="add-task-input-fields" id="inputDescription" style="height: 120px"
                                placeholder="Enter a Description">${task.description}</textarea>
                        </div>
                        <label for="inputDueDate">
                            <p>Due date</p>
                            <p class="rosa-font">*</p>
                        </label>
                        <div class="task-due-date">
                            <input class="add-task-input-fields" type="text" id="inputDueDate" placeholder="dd/mm/yyyy" maxlength="10" value="${task.dueDate}">
                            <img src="./assets/img/calendar_icon.png" alt="calendar" id="calendarIcon">
                            <div id="calendarPopup" class="calendar-popup">
                                    <div id="calendarControls">
                                        <div class="custom-select">
                                            <div class="select-selected" id="selectedMonth">January</div>
                                            <div class="select-items select-hide" id="monthSelect">
                                                <div>January</div>
                                                <div>February</div>
                                                <div>March</div>
                                                <div>April</div>
                                                <div>May</div>
                                                <div>June</div>
                                                <div>July</div>
                                                <div>August</div>
                                                <div>September</div>
                                                <div>October</div>
                                                <div>November</div>
                                                <div>December</div>
                                            </div>
                                        </div>
                                        <div class="custom-select">
                                            <div class="select-selected" id="selectedYear">2025</div>
                                            <div class="select-items select-hide" id="yearSelect">
                                                <div>2025</div>
                                                <div>2026</div>
                                                <div>2027</div>
                                                <div>2028</div>
                                                <div>2029</div>
                                                <div>2030</div>
                                            </div>
                                        </div>
                                    </div>
                                    <table id="calendarTable"></table>
                                </div>
                        </div>
                        <span id="inputDueDateError" class="error-message" style="display: none;">This field is required</span>
                        <div class="task-prio">
                            <p class="add-task-input-headline">Priority</p>
                            <div class="prio-buttons">
                                <div id="urgentPrio" class="prio-button ${task.priority === 'Urgent' ? 'selected' : ''}" onclick="selectPriority('Urgent')">
                                    <p>Urgent</p>
                                    <img src="./assets/img/urgent_icon.png" alt="urgent">
                                </div>
                                <div id="mediumPrio" class="prio-button ${task.priority === 'Medium' ? 'selected' : ''}" onclick="selectPriority('Medium')">
                                    <p>Medium</p>
                                    <img src="./assets/img/medium_icon.png" alt="medium">
                                </div>
                                <div id="lowPrio" class="prio-button ${task.priority === 'Low' ? 'selected' : ''}" onclick="selectPriority('Low')">
                                    <p>Low</p>
                                    <img src="./assets/img/low_icon.png" alt="low">
                                </div>
                            </div>
                        </div>
                        <div class="task-assignement-and-category">
                            <p class="add-task-input-headline">Assigned to</p>
                            <div onclick='showUsers(); loadEditorContactData(${JSON.stringify(task)});' class="add-task-assigned-to-input-field edit-task-assigned-to-input-field">
                                <p>Select contacts to assign</p>
                                <img id="userArrowDown" src="./assets/img/arrow_down_icon.png" alt="open user">
                                <img id="userArrowUp" class="rotate180" src="./assets/img/arrow_down_icon.png" alt="close user"
                                    style="display: none;">
                            </div>
                            <div id="users" class="users" style="display: none;">
                            </div>
                            <div class="assigned-users-container" id="assignedUsers"></div>
                        </div>                  
                        <div class="task-subtask">
                                <p class="add-task-input-headline">Subtasks</p>
                                <input onkeydown="handleKeyPressEditor(event)" onclick="changeButtons()"
                                    class="add-task-input-fields" type="text" id="inputSubtask"
                                    placeholder="Add new subtask">
                                <div id="containerButtons" class="add-subtask-buttons">
                                    <div onclick="changeButtons()" id="inputOffButton" class="subtask-buttons padding-top-six">
                                        <img src="./assets/img/plus_dark_icon.svg" alt="add subtask">
                                    </div>
                                    <div id="inputOnButtons" class="subtask-buttons-with-input" style="display: none;">
                                        <div onclick="resetButtons()" class="subtask-buttons">
                                            <img src="./assets/img/cancel_icon.svg" alt="cancel">
                                        </div>
                                        <div class="subtask-seperator"></div>
                                        <div onclick="addEditorSubtask()" class="subtask-buttons">
                                            <img src="./assets/img/check_dark_icon.svg" alt="create">
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div id="subtask" class="created-subtasks-container"></div>
                    </div>
                </div>
                <div class="change-edit-task-btn-container">
                    <button class="change-edit-task-btn" onclick="updateCurrentTask(event)">
                        <span>Ok</span>
                        <img src="./assets/img/check_icon.png" alt="save">
                    </button>
                </div>
            </div>
        </form>
    `;
}

/**
 * Generates the HTML template for a subtask item in the task editor, allowing users to edit or delete the subtask.
 * 
 * @param {Object} subtask - The subtask object to populate the subtask editor template.
 * @param {string} subtask.text - The text description of the subtask.
 * @param {number} i - The index of the subtask, used to create unique identifiers for elements.
 * @returns {string} The HTML string for the subtask editor item, including edit and delete icons.
 */
function getEditorSubtaskTemplate(subtask, i) {
    return `
        <div class="subtask-list" id="mainSubtask-container${i}">
            <input
                readonly
                type="text"
                id="subtaskList${i}"
                value="${subtask.text}"
                onkeydown="handleKeyPressEditEditor(event, ${i})"
            />
            <div class="edit-images" id="edit-images${i}">
                <img onclick="editEditorSubtask(${i})" id="editEditorSubtask${i}" src="./assets/img/edit_icon.svg" alt="edit">
                <div class="edit-seperator"></div>
                <img onclick="deleteEditorSubtask(${i})" id="deleteEditorSubtask${i}" src="./assets/img/delete_icon.svg" alt="delete">
            </div>
        </div>`;
}

/**
 * Generates the HTML template for the subtask edit icons, allowing users to delete or mark the subtask as complete.
 * 
 * @param {number} i - The index of the subtask, used to create unique identifiers for elements.
 * @returns {string} The HTML string for the subtask edit icons, including delete and check icons.
 */
function editEditorSubtaskHTML(i) {
    return `
        <div class="edit-icons">
            <img onclick="deleteEditorSubtask(${i})" id="deleteEditorSubtask${i}" src="./assets/img/delete_icon.svg" alt="delete">
        </div>
        <div class="edit-seperator"></div>
        <div class="edit-icons">
            <img onclick="checkEditorSubtask(${i})" id="checkEditorSubtask${i}" src="./assets/img/check_dark_icon.svg" alt="save">
        </div>`;
}

/**
 * Generates the HTML template for the assigned user section in the task editor, including a checkbox to select the user.
 * 
 * @param {Object} contact - The contact information for the user.
 * @param {string} contact.userId - The unique ID of the user.
 * @param {string} contact.name - The name of the user.
 * @param {string} contact.userColor - The background color for the user's initials.
 * @param {boolean} isChecked - Indicates whether the user is currently selected (checked) or not.
 * @returns {string} The HTML string for the assigned user section, including a checkbox.
 */
function getEditorAssignedToTemplate(contact, isChecked) {
    let initials = getInitials(contact.name);
    let userClass = isChecked ? 'user selected' : 'user';

    return `
        <div class="${userClass}" id="user-${contact.userId}" data-user-id="${contact.userId}" 
             onclick="handleEditorUserClick(${contact.userId})">
            <div class="user-left">
                <div class="initials-circle mr-10" style="background-color: ${contact.userColor}">${initials}</div>
                <span class="contact-name">${contact.name}</span>
            </div>
            <div class="user-right">
                <input 
                    type="checkbox" 
                    id="select-${contact.userId}" 
                    class="user-checkbox" 
                    onchange="handleEditorCheckboxChange(Number(${contact.userId}), this.checked)"
                    ${isChecked ? 'checked' : ''}>
            </div>
        </div>
    `;
}