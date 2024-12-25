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
        : ""; // Fallback, falls keine Benutzer zugewiesen sind

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
            <h2>${task.title}</h2>
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
                <div class="detail-delete-edit">
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