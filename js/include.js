/**
 * Asynchronously loads and includes external HTML content into elements with the `w3-include-html` attribute.
 * It fetches the HTML content from the file specified in the attribute, and inserts it into the element's innerHTML.
 * If the file is not found or there is an error, it displays a 'Page not found' message.
 * 
 * After loading the content, it calls other helper functions to perform additional actions.
 * 
 * @async
 * @returns {Promise<void>} A promise that resolves when all HTML content has been loaded and included.
 */
async function includeHTML() {
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
    markCurrentTab();
    setTimeout(() => {
        getLoggedInUser();
        checkForLimitedContentPage();
    }, 100);
}

// Ist notwendig, sonst Dauerschleife.
async function includeFooter() {
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