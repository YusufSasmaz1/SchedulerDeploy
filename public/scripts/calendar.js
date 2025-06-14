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

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu button
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const sidebar = document.querySelector('.sidebar');
  
  mobileMenuButton.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar--open');
  });

  // Mobile view selector
  const mobileViewButtons = document.querySelectorAll('.mobile-view-selector button');
  const viewSelect = document.querySelector('[data-view-select]');

  mobileViewButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      mobileViewButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      // Update the view select dropdown
      viewSelect.value = button.dataset.view;
      // Trigger change event on view select
      viewSelect.dispatchEvent(new Event('change'));
    });
  });

  // Mobile today button
  const mobileTodayButton = document.getElementById('mobileTodayButton');
  const todayButton = document.getElementById('todayButton');

  mobileTodayButton.addEventListener('click', () => {
    todayButton.click();
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !mobileMenuButton.contains(e.target) && 
        sidebar.classList.contains('sidebar--open')) {
      sidebar.classList.remove('sidebar--open');
    }
  });

  // Update mobile view selector when view changes
  viewSelect.addEventListener('change', () => {
    mobileViewButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewSelect.value);
    });
  });
});