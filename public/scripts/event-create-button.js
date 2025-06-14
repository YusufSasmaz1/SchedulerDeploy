/**
 * Initializes the event creation button
 * Sets up a click handler that dispatches a custom 'event-create-request' event
 */
export function initEventCreateButton() {
  const buttonElement = document.querySelector('[data-event-create-button]');
  buttonElement.addEventListener('click', () => {
    buttonElement.dispatchEvent(new CustomEvent('event-create-request', {
      bubbles: true
    }));
  });
}