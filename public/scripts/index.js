import {initCalendar} from './calendar.js';
import {initViewSelect} from './view-select.js';
import { initEventCreateButton } from './event-create-button.js';      
import { initEventFormDialog } from './event-form-dialog.js';
import { initNotification } from './notification.js';
import { initEventStore } from './event-store.js';
import {initNav} from "./nav.js";

// Initialize main features
initViewSelect();
initCalendar();
initEventFormDialog();
initEventCreateButton();
initNotification();
initEventStore();
initNav();