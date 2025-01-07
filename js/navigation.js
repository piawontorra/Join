/**
 * Checks the current page and user status to adjust the sidebar and content visibility.
 * - If the user is logged in or a guest, the full content and sidebar are restored.
 * - If no user is logged in and the current page is a limited-content page (privacy-policy or legal-notice),
 *   the sidebar is adjusted to show limited content and a login link.
 * - If the user is not logged in and they attempt to visit pages with restricted content,
 *   they are redirected to the login page.
 * 
 * @function checkForLimitedContentPage
 * @returns {void} No return value.
 */
function checkForLimitedContentPage() {
    const loggedInUser = sessionStorage.getItem('loggedInUserName');
    const guestUser = sessionStorage.getItem('guestUser');
    const currentUrl = window.location.pathname;

    if (loggedInUser || guestUser) {
        restoreSidebarForFullContent();
    }

    else if (!loggedInUser && !guestUser && (currentUrl.includes('privacy-policy.html') || currentUrl.includes('legal-notice.html'))) {
        adjustSidebarForLimitedContent();
    }
    // (Optional) Redirect to login if not logged in and on a restricted page (commented out)
    // else if (!loggedInUser && !guestUser && (currentUrl.includes('addTask.html') || currentUrl.includes('board.html') || currentUrl.includes('contacts.html') || currentUrl.includes('help.html') || currentUrl.includes('summary.html'))) {
    //     returnToLogIn();  // Redirect to login page
    // }
}

/**
 * Adjusts the sidebar and main content for limited-content pages by hiding the main content and showing a login link.
 * This is used when the user is not logged in and is viewing pages like privacy-policy or legal-notice.
 * 
 * @function adjustSidebarForLimitedContent
 * @returns {void} No return value.
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
 * Restores the sidebar and main content for logged-in users by showing the main content and hiding the login link.
 * This is used when a user is logged in or a guest is logged in.
 * 
 * @function restoreSidebarForFullContent
 * @returns {void} No return value.
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