/**
 * Switches the current view to the specified tab by changing the window location.
 *
 * @param {string} tabName - The name of the tab to switch to (corresponds to the name of the .html file).
 */
function switchTab(tabName) {
    window.location.href = `${tabName}.html`;
}

/**
 * Marks the currently active tab in the sidebar by adding the 'active' class
 * to the button of the current tab.
 */
function markCurrentTab() {
    const currentPage = window.location.pathname.split('/').pop();
    const tabName = currentPage.split('.')[0];

    const tabs = document.getElementsByClassName('menu-component');
    Array.from(tabs).forEach(tab => {
        tab.classList.remove('active');
    });

    const activeTabBtn = document.getElementById(tabName);
    if (activeTabBtn) {
        activeTabBtn.classList.add('active');
    }
}

/**
 * Adjusts the sidebar for limited content based on the user's login status.
 * If the user is not logged in and is not a guest, the sidebar is adjusted to show limited content.
 * Additionally, it checks if the current page is a limited content page (e.g., privacy-policy.html or legal-notice.html)
 * and adjusts the sidebar accordingly.
 * 
 * @function
 * @returns {void}
 */
function checkForLimitedContentPage() {
    const loggedInUser = sessionStorage.getItem('loggedInUserName');
    const guestUser = sessionStorage.getItem('guestUser');
    !loggedInUser && !guestUser ? adjustSidebarForLimitedContent() : restoreSidebarForFullContent();
}

/**
 * Adjusts the sidebar to show limited content. The main content is hidden and the login link is displayed.
 * If the required elements are not found, the function retries after a brief delay.
 * 
 * @function
 * @returns {void}
 */
function adjustSidebarForLimitedContent() {
    const mainContent = document.getElementById('mainTabs');
    const linkToLogin = document.getElementById('loginReference');

    if (mainContent && linkToLogin) {
        mainContent.classList.add('d-none');
        linkToLogin.classList.remove('d-none');
    } else {
        setTimeout(adjustSidebarForLimitedContent, 100);
    }
}

/**
 * Restores the sidebar to display full content. The main content is shown and the login link is hidden.
 * If the required elements are not found, the function retries after a brief delay.
 * 
 * @function
 * @returns {void}
 */
function restoreSidebarForFullContent() {
    const mainContent = document.getElementById('mainTabs');
    const linkToLogin = document.getElementById('loginReference');

    if (mainContent && linkToLogin) {
        mainContent.classList.remove('d-none');
        linkToLogin.classList.add('d-none');
    } else {
        setTimeout(restoreSidebarForFullContent, 100);
    }
}
