async function getTaskCardTemplate(task) {
    let icon = priorityIcons[task.priority];

    const assignedUserData = task.assignedTo && Array.isArray(task.assignedTo) 
        ? await getAssignedUserInitialsAndColor(task.assignedTo)
        : [];
        
    let assignedToHTML = assignedUserData
        .map(user =>
            `<div class="task-user-icon" style="background-color: ${user.color};">
                ${user.initials}
            </div>`
        )
        .join("");

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

    return `<div class="task-card" data-task-id="${task.id}" draggable="true" ondragstart="dragTask(${task.id})" onclick="openTaskDetail('${task.id}')">
                <div class="task-category">
                    <p>${task.category}</p>
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
            </div>`;
}

async function getDetailTaskCardTemplate(task) {
    let icon = priorityIcons[task.priority];

    const assignedUserData = await getAssignedUserInitialsAndColor(task.assignedTo || []); // Standardwert für leeres Array
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

    return `
        <div class="detail-task-card">
            <div class="detail-task-header">
                <div class="detail-task-category">
                    <p>${task.category || "Uncategorized"}</p>
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
                    <img class="width32" src="./assets/img/edit_icon.svg">
                    <p>Edit</p>
                </div>
            </div>
        </div>
    `;
}
  
function getNoTasksTemplate(status) {
    return `
        <div class="no-tasks-message">
            <p>No tasks ${status}</p>
        </div>
    `;
}

function getTaskEditorTemplate(task) {
    return `
        <form id="add-task-form">
            <div class="edit-task-form">
                <div class="edit-task-header">
                    <div class="close-btn">
                        <img src="./assets/img/cancel_icon.png" onclick="closeTaskEditor()">
                    </div>
                </div>
                <div class="add-task-form-left">
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
                        <img src="./assets/img/calendar_icon.png" alt="">
                    </div>
                    <span id="inputDueDateError" class="error-message" style="display: none;">This field is required</span>
                    <div class="task-prio">
                        <p class="add-task-input-headline">Priority</p>
                        <div class="prio-buttons">
                            <div id="urgentPrio" class="prio-button ${task.priority === 'Urgent' ? 'selected' : ''}" onclick="selectPriority('Urgent')">
                                <p>Urgent</p>
                                <img src="./assets/img/urgent_icon.png" alt="">
                            </div>
                            <div id="mediumPrio" class="prio-button ${task.priority === 'Medium' ? 'selected' : ''}" onclick="selectPriority('Medium')">
                                <p>Medium</p>
                                <img src="./assets/img/medium_icon.png" alt="">
                            </div>
                            <div id="lowPrio" class="prio-button ${task.priority === 'Low' ? 'selected' : ''}" onclick="selectPriority('Low')">
                                <p>Low</p>
                                <img src="./assets/img/low_icon.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="task-assignement-and-category">
                        <p class="add-task-input-headline">Assigned to</p>
                        <div onclick='showUsers(); loadEditorContactData(${JSON.stringify(task)});' class="add-task-assigned-to-input-field">
                            <p>Select contacts to assign</p>
                            <img id="userArrowDown" src="./assets/img/arrow_down_icon.png" alt="">
                            <img id="userArrowUp" class="rotate180" src="./assets/img/arrow_down_icon.png" alt=""
                                style="display: none;">
                        </div>
                        <div id="users" class="users" style="display: none;">
                        </div>
                        <div class="assigned-users-container" id="assignedUsers"></div>
                    </div>
                </div>
                <div class="task-subtask">
                        <p class="add-task-input-headline">Subtasks</p>
                        <input onkeydown="handleKeyPress(event)" onclick="changeButtons()"
                            class="add-task-input-fields" type="text" id="inputSubtask"
                            placeholder="Add new subtask">
                        <div id="containerButtons" class="add-subtask-buttons">
                            <div onclick="changeButtons()" id="inputOffButton" class="subtask-buttons">
                                <img src="./assets/img/plus_dark_icon.svg" alt="">
                            </div>
                            <div id="inputOnButtons" class="subtask-buttons-with-input" style="display: none;">
                                <div onclick="resetButtons()" class="subtask-buttons">
                                    <img src="./assets/img/cancel_icon.svg" alt="">
                                </div>
                                <div class="subtask-seperator"></div>
                                <div onclick="addEditorSubtask()" class="subtask-buttons">
                                    <img src="./assets/img/check_dark_icon.svg" alt="">
                                </div>
                            </div>
                        </div>
                </div>
                <div id="subtask" class="created-subtasks-container"></div>
                <div class="change-edit-task-btn-container">
                    <button class="change-edit-task-btn" onclick="updateCurrentTask(event)">
                        <span>Ok</span>
                        <img src="./assets/img/check_icon.png" alt="">
                    </button>
                </div>
            </div>
        </form>
    `;
}

function getEditorSubtaskTemplate(subtask,i) {    
    return `
        <div class="subtask-list" id="mainSubtask-container${i}">
            <input
                readonly
                type="text"
                id="subtaskList${i}"
                value="${subtask.text}"
            />
            <div class="edit-images" id="edit-images${i}">
                <img onclick="editEditorSubtask(${i})" id="editEditorSubtask${i}" src="./assets/img/edit_icon.svg" alt="">
                <div class="edit-seperator"></div>
                <img onclick="deleteEditorSubtask(${i})" id="deleteEditorSubtask${i}" src="./assets/img/delete_icon.svg" alt="">
            </div>
        </div>`;
}

function editEditorSubtaskHTML(i) {
    return `
        <div class="edit-icons">
            <img onclick="deleteEditorSubtask(${i})" id="deleteEditorSubtask${i}" src="./assets/img/delete_icon.svg" alt="">
        </div>
        <div class="edit-seperator"></div>
        <div class="edit-icons">
            <img onclick="checkEditorSubtask(${i})" id="checkEditorSubtask${i}" src="./assets/img/check_dark_icon.svg" alt="">
        </div>`;
}

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






