import{today} from "./data.js";
import { initMonthCalendar } from "./month-calendar.js";

export function initCalendar(){
   const canlendarElement = document.querySelector('[data-calendar]');

   let selectedView = "month";
   let selectedDate = today();

   function refreshCalendar (){
 if (selectedView === "month") {
      initCalendar();
     } else if (selectedView === "week"){
     } else if (selectedView === "day"){
     }
   }
   
    document.addEventListener('view-select', (event) => {
     const selectedView = event.detail.view;
     refreshCalendar();
    });

    document.addEventListener('view-change', (event) => {
     const selectedView = event.detail.view;
     refreshCalendar();
    });


    refreshCalendar();
}