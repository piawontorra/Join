/**
 * Determines the visibility of page content and manages redirection based on the user's login status 
 * and the current page URL. The function checks if the user is logged in or is a guest and adjusts 
 * the display or redirects accordingly.
 * 
 * - If the user is not logged in and the current page is a limited content page (privacy policy or legal notice),
 *   the sidebar is adjusted to show limited content.
 * - If the user is not logged in and tries to access restricted pages (such as addTask, board, contacts, etc.),
 *   the user is redirected to the login page.
 * - Default: If the a user or a guest user is logged in, the complete content with all mainTabs will be shown.
 * 
 * @returns {void} This function does not return any value, it performs DOM manipulation and redirects.
 */
function checkForLimitedContentPage() {
    const loggedInUser = sessionStorage.getItem('loggedInUserName');
    const guestUser = sessionStorage.getItem('guestUser');
    const currentUrl = window.location.pathname;

    switch (true) {
        case (!loggedInUser && !guestUser && (currentUrl.includes('privacy-policy.html') || currentUrl.includes('legal-notice.html'))):
            adjustSidebarForLimitedContent();
            break;
        case (!loggedInUser && !guestUser && !(currentUrl.includes('privacy-policy.html') || currentUrl.includes('legal-notice.html'))):
            window.location.href = 'index.html';
            break;
        default:
            mobileUserSidebar();
            // Manchmal reload notwendig, damit die Anzeige beim Bildschirmvergrößern und -verkleinern richtig ist. 'resize' bereitet anderes Problem.
            break;
    }
}

/**
 * Adjusts the sidebar and main content for limited-content pages by hiding the main content and showing a login link.
 * This is used when the user is not logged in and is viewing pages like privacy-policy or legal-notice.
 * 
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
 * Adjusts the visibility of the "imprintContent" element based on the window width.
 * If the window width is less than 1000px, the "imprintContent" element is hidden by adding the "d-none" class.
 * Otherwise, the "d-none" class is removed, making the element visible.
 * 
 * @returns {void} No return value.
 */
function mobileUserSidebar() {
    const imprintContentRef = document.getElementById('imprintContent');

    if (window.innerWidth < 1000) {
        imprintContentRef.classList.add('d-none');
    } else {
        imprintContentRef.classList.remove('d-none');
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