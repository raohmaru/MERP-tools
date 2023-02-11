/**
 * Fast query selector.
 * @param {string} sel - Valid CSS selector
 * @returns {Element}
 */
export function $(sel) {
    if (sel[0] === '#') {
        return document.getElementById(sel.substr(1));
    } 
    return document.querySelector(sel);
}

/**
 * Shortcut for document.querySelectorAll().
 * @param {string} sel - Valid CSS selector
 * @returns {NodeList}
 */
export function $$(sel) {
    return document.querySelectorAll(sel);
}