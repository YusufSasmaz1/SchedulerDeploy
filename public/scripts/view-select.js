/**
 * Initializes the view selection dropdown and its event handling
 * Sets up a custom event 'view-select' that bubbles up with the selected view
 */
export function initViewSelect(){
    const viewSelectElement = document.querySelector('[data-view-select]');

    viewSelectElement.addEventListener("change", (event) => {
        viewSelectElement.dispatchEvent(new CustomEvent("view-select", {
            detail: {
                view: viewSelectElement.value
            },
            bubbles: true
        }));
    });
}