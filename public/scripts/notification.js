import {initToaster} from "./toaster.js"
export function initNotification () {
    const toaster = initToaster(document.body);
document.addEventListener("event-create", () => {
    toaster.success("Event created successfully!"); 
});
}