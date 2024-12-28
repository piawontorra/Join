async function openTaskDetail(taskId) {
    taskId = Number(taskId);
  
    const task = tasksData.find(t => t.id === taskId);
  
    if (!task) {
      console.warn(`Aufgabe mit ID "${taskId}" nicht gefunden.`);
      return;
    }
  
    const detailHTML = await getDetailTaskCardTemplate(task);
    document.getElementById('taskDetail').innerHTML = detailHTML;
  
    const modal = document.getElementById('taskDetailModal');
    modal.style.display = 'flex';
  }
  
  function closeTaskDetail() {
    const modal = document.getElementById('taskDetailModal');
    modal.style.display = 'none';
}

function handleSubtaskCheckboxChange(event, task, subtaskIndex) {
    const isChecked = event.target.checked;
    task.subtasks[subtaskIndex].completed = isChecked;
  
    updateSubtaskInFirebase(task.id, subtaskIndex, isChecked);
    updateProgressBar(task);
}

async function deleteTask(taskId, taskStatus) {
    try {
      const taskPath = `${BASE_URL}tasks/${taskId}.json`;
  
      const response = await fetch(taskPath, {
        method: "DELETE",
      });
  
      tasksData = tasksData.filter(task => task.id !== taskId);
  
      const taskCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
      if (taskCard) {
        taskCard.remove();
      }
  
      const statusContainers = getStatusContainers();
      if (statusContainers && statusContainers[taskStatus]) {
        addNoTasksMessage(statusContainers);
      }
  
      closeTaskDetail();
    } catch (error) {
      console.error("Fehler beim Löschen der Task:", error);
    }
}