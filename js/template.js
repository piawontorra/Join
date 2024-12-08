function getTaskCardTemplate(task) {
    let icon = priorityIcons[task.priority];

    return `<div class="task-card">
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
                    <div class="task-user-icon">BS</div>
                    <img src="${icon}"> 
                </div>
            </div>`;
}