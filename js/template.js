function getTaskCardTemplate(task) {
    let icon = priorityIcons[task.priority];

    let assignedToHTML = task.assignedTo
        .map(name => `<div class="task-user-icon">${getInitials(name)}</div>`)
        .join("");

    return `<div class="task-card" draggable="true" ondragstart="dragTask(event)" data-task-id="${task.title}">
                <div class="task-category">
                    <p>${task.category}</p>
                </div>
                <div class="task-card-header">
                    <p class="task-title">${task.title}</p>
                    <p class="task-description">${task.description}</p>
                </div>
                <div class="task-subtask">
                    <div class="task-progress-bar"></div>
                    <p>0/${task.subtasks.length} Subtasks</p>
                </div>
                <div class="task-user-and-priority">
                    <div class="task-assigned-to">
                        ${assignedToHTML}
                    </div>
                    <img src="${icon}"> 
                </div>
            </div>`;
}


function getNoTasksTemplate(status) {
    return `
        <div class="no-tasks-message">
            <p>No tasks ${status}</p>
        </div>
    `;
  }
  