/**
 * Initializes the portrait mode layout by adding an event listener for orientation changes
 * and adjusting the layout immediately based on the current screen width. If the screen
 * width is smaller than 1065px, it sets up the orientation change listener and calls 
 * `adjustLayoutForOrientation`. If the screen width is larger than 1065px, it calls 
 * `markCurrentTab`.
 * 
 * The function checks the screen width to determine if portrait mode adjustments are necessary.
 * - If the screen width is smaller than 1065px, it listens for orientation changes and adjusts the layout accordingly.
 * - If the screen width is 1065px or larger, it skips the orientation change listener setup and reloads the site by marking the current tab.
 * So it is ensured, that the actual content for the current screen size is shown.
 * 
 * @returns {void} This function does not return any value. It manipulates the DOM by adding event listeners 
 * and calling other functions based on screen width.
 */
function initPortraitMode() {
    if (window.innerWidth < 1065) {
        window.addEventListener("orientationchange", function () {
            adjustLayoutForOrientation();
        });
        adjustLayoutForOrientation();
    } else {
        markCurrentTab();
    }
}

/**
 * Event listener for resizing the window.
 * This listener calls the `initPortraitMode()` function whenever the window is resized.
 * The function adjusts the visibility of the imprint summary based on the window width.
 * 
 * @listens resize
 */
window.addEventListener('resize', function () {
    initPortraitMode();
});