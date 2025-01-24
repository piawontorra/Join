/**
 * Asynchronously loads HTML content into elements that have the `w3-include-html` attribute.
 * The function fetches the HTML files specified in the `w3-include-html` attribute of each element, 
 * and replaces the content of the element with the fetched HTML. If the file cannot be found, 
 * the content of the element is set to 'Page not found'.
 *
 * @async
 * @returns {Promise<void>} This function returns a Promise that resolves once all HTML includes 
 *                          have been successfully processed or failed.
 */
async function includeW3Code() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * This function serves as a wrapper for `includeW3Code` and is intended for use when specifically 
 * including the footer of the page.
 * 
 * @async
 * @returns {Promise<void>} This function returns a Promise that resolves when the footer has been successfully included.
 */
async function includeFooter() {
    await includeW3Code();
}

/**
 * Loads HTML content into elements with the `w3-include-html` attribute, marks the current tab, 
 * and then checks for user login status and content visibility.
 * This function first calls `includeW3Code` to load the HTML content, then invokes `markCurrentTab` 
 * to highlight the current tab, and finally, calls `getLoggedInUser` and `checkForLimitedContentPage` 
 * with a slight delay to ensure page elements are ready.
 * 
 * @async
 * @returns {Promise<void>} This function returns a Promise that resolves after including HTML content 
 *                          and performing actions related to user login and content access control.
 */
async function includeHTML() {
    await includeW3Code();
    setTimeout(() => {
        getLoggedInUser();
        checkForLimitedContent();
    }, 10);
    markCurrentTab();
}