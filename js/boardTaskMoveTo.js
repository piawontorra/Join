function showMoveTo(event) {
    event.stopPropagation();
    const taskCard = event.target.closest(".task-card");
    const menuPopUp = taskCard.querySelector(".task-card-menu-pop-up");

    document.querySelectorAll(".task-card-menu-pop-up").forEach(popup => {
        popup.style.display = "none";
    });

    menuPopUp.style.display = "flex";
}
