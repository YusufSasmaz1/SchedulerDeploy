import {validateEvent} from "./event.js"

/**
 * Initializes the event creation form with validation and submission handling
 * @param {Object} toaster - The toaster instance for showing notifications
 * @returns {Object} An object containing the form element and reset method
 */
export function initEventForm(toaster){
    const formElement = Document.querySelector('[data-event-form]');

    formElement.addEventListener('submit', (event) =>{
    event.preventDefault();   
    const formEvent = formIntoEvent(formElement);
    const validateError = validateEvent(formEvent);
    if (validateError !== null) {
        toaster.error(validateError);
        return;
    }
    formElement.dispatchEvent(new CustomEvent('event-created', {
        detail: {
            event: formEvent
        },
        bubbles: true,
    }));
});

        return{
            formElement,
        /**
         * Resets the form to its initial state
         */
        reset() {
            formElement.reset();
     }
    };
}
function formIntoEvent(formElement) {
    const formData = new FormData(formElement);
    const title = formData.get('title');
    const date = formData.get('date');
    const startTime = formData.get('start-time');
    const endTime = formData.get('end-time');
    const color  = formData.get('color');
    const event = {
        title, 
        date: new Date(date),
        startTime: Number.parseInt(startTime, 10),
        endTime: Number.parseInt(endTime, 10),
        color
    };
    return event;
}