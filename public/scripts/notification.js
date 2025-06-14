import {initToaster} from "./toaster.js"

// Notification for event creation
export function initNotification () {
    const toaster = initToaster(document.body);
    document.addEventListener("event-create", () => {
        toaster.success("Event created successfully!"); 
    });
}