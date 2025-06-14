import {waitForAnimationsToFinish} from "./animation.js"; 

/**
 * Initializes a toaster notification system in the specified parent element
 * @param {HTMLElement} parent - The parent element where the toaster will be mounted
 * @returns {Object} An object with success and error methods for showing notifications
 */
export function initToaster(parent){
const toasterElement = document.createElement('div');

toasterElement.classList.add('toaster');
parent.appendChild(toasterElement);

return {
        /**
         * Shows a success notification
         * @param {string} message - The message to display
         */
        success(message) {
            showToast(toasterElement, message,'success');
        },
        /**
         * Shows an error notification
         * @param {string} message - The message to display
         */
        error(message) {
            showToast(toasterElement, message,'error');
        }
    };
}

function showToast(toasterElement, message, type) {
    const toastElement = createToast(message, type);
    animateToast(toastElement, toasterElement); 
}

/**
 * Creates a toast element with the specified message and type
 * @param {string} message - The message to display
 * @param {string} type - The type of toast ('success' or 'error')
 * @returns {HTMLElement} The created toast element
 */
function createToast(message, type) {
    const toastElement = document.createElement('div');
    toastElement.createElement = message;
    toastElement.classList.add('toast');
    toastElement.classList.add(`toast--${type}`);
    return toastElement;
}

function animateToast (toastElement, toasterElement) {
    const heightBefore = toasterElement.offsetHeight;
    toasterElement.appendChild(toastElement);
    const heightAfter = toasterElement.offsetHeight;
    const heightDiff = heightAfter - heightBefore;

    const toasterAnimation = toasterElement.animate([
        { transform: `translate(0,${heightDiff}px)` },
        { transform: `translate(0,0)` }
    ], {
        duration: 150,
        easing: 'ease-out',
    });

toasterAnimation.startTime = document.timeline.currentTime;
waitForAnimationsToFinish(toastElement)
.then(() => {
    toasterElement.removeChild(toastElement);
})
.catch((error) => {
    console.error('Error waiting for animations to finish:', error);
})
}