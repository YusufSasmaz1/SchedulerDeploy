import {waitForAnimationsToFinish} from "./animation.js";

/**
 * Initializes a dialog with the specified name
 * @param {string} name - The name of the dialog element (data-dialog attribute value)
 * @returns {Object} An object with methods to control the dialog
 */
export function initDialog(name){
    const dialogElement = document.querySelector(`[data-dialog="${name}"]`);
    const closeButtonElements = dialogElement.querySelectorAll('[data-dialog-close-button]');

    /**
     * Closes the dialog with animation
     * @private
     */
    function close(){
        dialogElement.classList.add("dialog--closing");

        waitForAnimationsToFinish(dialogElement).then(() => {
            dialogElement.classList.remove("dialog--closing");
            dialogElement.close();
        })
        .catch((error) => {
            console.error('Error during dialog close animation:', error);
        });
    }

    // Add click handlers to all close buttons
    for (const closeButtonElement of closeButtonElements) {
        closeButtonElement.addEventListener('click', () => {
            close();
        });
    }

    // Close dialog when clicking outside
    dialogElement.addEventListener('click', (event) => {
        if (event.target === dialogElement) {
            close();
        }
    });

    // Prevent default cancel behavior and use our custom close
    dialogElement.addEventListener("cancel", (event) => {
        event.preventDefault();
        close();
    });

    return {
        dialogElement,
        /**
         * Opens the dialog
         */
        open() {
            dialogElement.showModal();
        },
        /**
         * Closes the dialog
         */
        close() {
            close();
        },
    };
}