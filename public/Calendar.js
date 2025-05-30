// --- Dynamic Calendar View Setup ---

function getMonthName(monthIndex) {
  return [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ][monthIndex];
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

// Store all events in memory for demo (refresh loses data)
let allEvents = [];

let currentDate = new Date();
let todayHighlightFlag = false; // Track if we should highlight today

// DOM elements for calendar navigation
const navDateElement = document.querySelector('.nav__date');
const leftArrow = document.querySelectorAll('.nav__arrows button')[0];
const rightArrow = document.querySelectorAll('.nav__arrows button')[1];
const calendarDayList = document.querySelector('.month-calendar__day-list');
const todayButton = document.querySelector('.nav__controls .button--secondary');

// Add view state tracking
let currentView = 'month'; // can be 'month', 'week', or 'day'
let selectedDate = new Date();

// Add view switching function
function switchView(newView, date) {
  currentView = newView;
  selectedDate = date;
  
  // Hide all views first
  document.querySelector('.month-calendar').style.display = 'none';
  document.querySelector('[data-week-calendar]').style.display = 'none';
  document.querySelector('[data-day-calendar]').style.display = 'none';

  // Show selected view
  if (newView === 'month') {
    document.querySelector('.month-calendar').style.display = '';
  } else if (newView === 'week') {
    document.querySelector('[data-week-calendar]').style.display = '';
  } else if (newView === 'day') {
    document.querySelector('[data-day-calendar]').style.display = '';
    // Update day view header
    updateDayView();
  }

  // Sync the view selector dropdown
  const viewSelect = document.querySelector('[data-view-select]');
  if (viewSelect) {
    viewSelect.value = newView;
  }

  // Update nav date display
  updateNavDate();
}

// Add function to update day view
function updateDayView() {
  const dayHeader = document.querySelector('[data-day-calendar] .week-calendar__day-of-week-button');
  if (dayHeader) {
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][selectedDate.getDay()];
    const dayNum = selectedDate.getDate();
    
    const dayText = dayHeader.querySelector('.week-calendar__day-of-week-day');
    const dayNumber = dayHeader.querySelector('.week-calendar__day-of-week-num');
    
    if (dayText) dayText.textContent = dayOfWeek;
    if (dayNumber) dayNumber.textContent = dayNum;
  }
}

function updateNavDate() {
  if (currentView === 'month') {
    navDateElement.textContent = `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
  } else if (currentView === 'week') {
    // Add week view date logic if needed
  } else if (currentView === 'day') {
    navDateElement.textContent = `${getMonthName(selectedDate.getMonth())} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
  }
}

function renderCalendar() {

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();


  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();


  navDateElement.textContent = `${getMonthName(month)} ${year}`;


  calendarDayList.innerHTML = "";

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);


  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  // Add previous month's trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const li = document.createElement('li');
    li.classList.add('month-calendar__day', 'month-calendar__day--inactive');
    const btn = document.createElement('button');
    btn.className = 'month-calendar__day-label';
    btn.disabled = true;
    btn.textContent = daysInPrevMonth - i;
    li.appendChild(btn);

    const eventListWrapper = document.createElement('div');
    eventListWrapper.className = 'month-calendar__event-list-wrapper';
    const eventList = document.createElement('ul');
    eventList.className = 'event-list';
    eventListWrapper.appendChild(eventList);
    li.appendChild(eventListWrapper);

    calendarDayList.appendChild(li);
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const li = document.createElement('li');
    li.classList.add('month-calendar__day');
    
    // Add hover effect for the entire cell
    li.classList.add('month-calendar__day--hoverable');
    
    const btn = document.createElement('button');
    btn.className = 'month-calendar__day-label';
    // Add specific hover effect for the date number
    btn.classList.add('month-calendar__day-label--hoverable');
    btn.textContent = day;

    // Add styles to document head for hover effects and event positioning
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .month-calendar__day--hoverable:hover {
        background-color: rgba(242, 242, 242, 0.8);
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .month-calendar__day-label--hoverable {
        transition: all 0.3s ease;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      }

      .month-calendar__day-label--hoverable:hover {
        background-color: #f0f0f0;
        cursor: pointer;
      }

      .today-highlight {
        background-color: #808080;
        color: white;
        font-weight: bold;
        border-radius: 50%;
        animation: todayHighlight 0.3s ease forwards;
      }

      @keyframes todayHighlight {
        0% {
          background-color: transparent;
          color: black;
        }
        100% {
          background-color: #808080;
          color: white;
        }
      }

      .month-calendar__event-list-wrapper {
        margin-top: 5px;
        padding: 0 5px;
      }

      .event-list {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .event-item {
        margin: 2px 0;
        padding: 3px 6px;
        border-radius: 4px;
        font-size: 0.85em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `;
    document.head.appendChild(styleSheet);

    // Highlight today if on current month/year and flag is set
    if (
      todayHighlightFlag &&
      year === todayYear &&
      month === todayMonth &&
      day === todayDate
    ) {
      btn.classList.add('today-highlight');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event from bubbling to li
      const clickedDate = new Date(year, month, day);
      switchView('day', clickedDate);
    });

    // Add click handler to the li element (day cell)
    li.addEventListener('click', () => {
      // Set modal date input value
      date.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Reset other modal inputs & states
      titleInput.value = '';
      time1.value = '';
      time2.value = '';
      repeatDateInput.value = '';
      errorMessage.style.display = 'none';
      toggleAllDay();
      toggleRepeat();

      // Set default event type
      typeEvent = 'event';

      // Show modal
      modal.style.display = 'block';
    });

    li.appendChild(btn);

    const eventListWrapper = document.createElement('div');
    eventListWrapper.className = 'month-calendar__event-list-wrapper';
    const eventList = document.createElement('ul');
    eventList.className = 'event-list';
    eventListWrapper.appendChild(eventList);
    li.appendChild(eventListWrapper);

    // Add events for this day
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const todaysEvents = allEvents.filter(e => e.selectedDate === dateStr);
    
    // Sort events by time
    todaysEvents.sort((a, b) => {
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      if (a.isAllDay && b.isAllDay) return 0;
      return a.time1Value.localeCompare(b.time1Value);
    });

    todaysEvents.forEach(ev => {
      const eventItem = document.createElement("li");
      eventItem.classList.add("event-item");
      
      // Add event type class for different colors
      eventItem.classList.add(`event-item--${ev.typeEvent}`);
      
      // Just show the title without time
      eventItem.textContent = ev.title;

      eventItem.addEventListener("click", (e) => {
        e.stopPropagation();
        alert(`Title: ${ev.title}
Date: ${ev.selectedDate}
${ev.isAllDay ? "All Day" : `Time: ${ev.time1Value} to ${ev.time2Value}`}
${ev.isRepeat ? "Repeats until: " + ev.repeatDate : "Does not repeat"}
Type: ${ev.typeEvent}`);
      });

      eventList.appendChild(eventItem);
    });

    calendarDayList.appendChild(li);
  }

  // Add next month's leading days to fill the grid (always show 6 weeks for consistency)
  const totalCells = 42; // 7 days x 6 weeks
  const currentCells = firstDayOfWeek + daysInMonth;
  for (let i = 1; i <= totalCells - currentCells; i++) {
    const li = document.createElement('li');
    li.classList.add('month-calendar__day', 'month-calendar__day--inactive');
    const btn = document.createElement('button');
    btn.className = 'month-calendar__day-label';
    btn.disabled = true;
    btn.textContent = i;
    li.appendChild(btn);

    const eventListWrapper = document.createElement('div');
    eventListWrapper.className = 'month-calendar__event-list-wrapper';
    const eventList = document.createElement('ul');
    eventList.className = 'event-list';
    eventListWrapper.appendChild(eventList);
    li.appendChild(eventListWrapper);

    calendarDayList.appendChild(li);
  }
}

// Update navigation arrows to work with daily view
leftArrow.addEventListener('click', () => {
  if (currentView === 'month') {
    currentDate.setMonth(currentDate.getMonth() - 1);
    todayHighlightFlag = false;
    renderCalendar();
  } else if (currentView === 'day') {
    selectedDate.setDate(selectedDate.getDate() - 1);
    updateDayView();
    updateNavDate();
  }
});

rightArrow.addEventListener('click', () => {
  if (currentView === 'month') {
    currentDate.setMonth(currentDate.getMonth() + 1);
    todayHighlightFlag = false;
    renderCalendar();
  } else if (currentView === 'day') {
    selectedDate.setDate(selectedDate.getDate() + 1);
    updateDayView();
    updateNavDate();
  }
});

if (todayButton) {
  todayButton.addEventListener('click', () => {
    currentDate = new Date();
    selectedDate = new Date();
    todayHighlightFlag = true;
    switchView(currentView, currentDate);
    renderCalendar();
  });
}
document.addEventListener('DOMContentLoaded', () => {
  todayHighlightFlag = false;
  renderCalendar();
  switchView('month', currentDate);
});


const modal = document.getElementById("addEventModal");
const cancelModal = document.getElementById("cancelModal");
const addEventButton = document.getElementById("addEventButton");
const addTaskButton = document.getElementById("addTaskButton");
const addReminderButton = document.getElementById("addReminderButton");
const closeMain = document.querySelectorAll(".close-main")[0]; // The first close-main
const submit = document.getElementById("submit");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const time1 = document.getElementById("time1");
const time2 = document.getElementById("time2");
const titleInput = document.getElementById("title");
const sliderAllDay = document.getElementById("SliderAllDay");
const sliderRepeat = document.getElementById("SliderRepeat");
const sliderCircleAllDay = sliderAllDay.querySelector(".slider-circle");
const sliderCircleRepeat = sliderRepeat.querySelector(".slider-circle");
const date = document.getElementById("date");
const repeatDateInput = document.getElementById("repeatDate");
let isAllDay = false;
let isRepeat = false;
let typeEvent = "";



const errorMessage = document.createElement("p");
errorMessage.style.color = "red";
errorMessage.style.display = "none";
errorMessage.textContent = "";
const modalContent = document.querySelector(".modal-content");
modalContent.appendChild(errorMessage);

addEventButton.onclick = () => {
  modal.style.display = "block";
  errorMessage.style.display = "none";
  typeEvent = "event";
};
addTaskButton.onclick = () => {
  modal.style.display = "block";
  errorMessage.style.display = "none";
  typeEvent = "task";
};
addReminderButton.onclick = () => {
  modal.style.display = "block";
  errorMessage.style.display = "none";
  typeEvent = "reminder";
};

closeMain.onclick = () => {
  cancelModal.style.display = "block";
};

yes.onclick = () => {
  cancelModal.style.display = "none";
  modal.style.display = "none";
  resetModalInputs();
};
no.onclick = () => {
  cancelModal.style.display = "none";
};

submit.onclick = () => {
  const title = titleInput.value.trim();
  const time1Value = time1.value;
  const time2Value = time2.value;
  const selectedDate = date.value;
  const repeatDate = repeatDateInput.value;

  if (!title) {
    errorMessage.textContent = `Please enter a title.`;
    errorMessage.style.display = "block";
    return;
  } else if (!selectedDate) {
    errorMessage.textContent = "Please enter a date.";
    errorMessage.style.display = "block";
    return;
  } else if (!isAllDay && (!time1Value || !time2Value)) {
    errorMessage.textContent = "Please enter both start and end times.";
    errorMessage.style.display = "block";
    return;
  }
  if (!isAllDay) {
    if (time1Value && time2Value) {
      const time1Date = new Date(`${selectedDate}T${time1Value}:00`);
      const time2Date = new Date(`${selectedDate}T${time2Value}:00`);
      if (time1Date > time2Date) {
        errorMessage.textContent = "Error: Start time cannot be later than end time.";
        errorMessage.style.display = "block";
        return;
      }
    }
  }
  if (isRepeat && !repeatDate) {
    errorMessage.textContent = "Please enter a repeat end date.";
    errorMessage.style.display = "block";
    return;
  }
  if (isRepeat && repeatDate) {
    const eventDate = new Date(selectedDate);
    const repeatEndDate = new Date(repeatDate);
    if (repeatEndDate < eventDate) {
      errorMessage.textContent = "Repeat end date cannot be before the event date.";
      errorMessage.style.display = "block";
      return;
    }

    // Create repeating events for each day in the range
    const startDate = new Date(selectedDate);
    const endDate = new Date(repeatDate);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const eventDate = currentDate.toISOString().split('T')[0];
      allEvents.push({
        title,
        selectedDate: eventDate,
        time1Value,
        time2Value,
        isAllDay,
        isRepeat,
        repeatDate,
        typeEvent
      });
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else {
    // Store single event
    allEvents.push({
      title,
      selectedDate,
      time1Value,
      time2Value,
      isAllDay,
      isRepeat,
      repeatDate,
      typeEvent
    });
  }

  document.querySelectorAll('input').forEach(input => input.value = ''); // Clear input fields
  errorMessage.style.display = "none";
  modal.style.display = "none";
  showSuccessMessage();
  renderCalendar(); // Update calendar to show new event

  toggleAllDay();
  toggleRepeat();
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    errorMessage.style.display = "none";
    resetModalInputs();
  } else if (event.target === cancelModal) {
    cancelModal.style.display = "none";
  }
};

sliderRepeat.addEventListener('click', function () {
  isRepeat = !isRepeat;
  sliderRepeat.style.backgroundColor = isRepeat ? "#4CAF50" : "#ccc";
  sliderCircleRepeat.style.transform = isRepeat ? "translateX(14px)" : "translateX(0)";
  if (isRepeat) {
    repeatDateInput.style.display = "block";
    document.getElementById("repeatLabel").textContent = "Repeat until:";
  } else {
    repeatDateInput.style.display = "none";
    repeatDateInput.value = "";
    document.getElementById("repeatLabel").textContent = "Repeat:";
  }
});
repeatDateInput.addEventListener('click', function (event) {
  event.stopPropagation();
});
sliderAllDay.addEventListener('click', function () {
  isAllDay = !isAllDay;
  sliderAllDay.style.backgroundColor = isAllDay ? "#4CAF50" : "#ccc";
  sliderCircleAllDay.style.transform = isAllDay ? "translateX(14px)" : "translateX(0)";
});
function toggleAllDay() {
  isAllDay = false;
  sliderAllDay.style.backgroundColor = isAllDay ? "#4CAF50" : "#ccc";
  sliderCircleAllDay.style.transition = 'transform 0.3s ease';
  sliderCircleAllDay.style.transform = isAllDay ? 'translateX(14px)' : 'translateX(0)';
}
function toggleRepeat() {
  isRepeat = false;
  sliderRepeat.style.backgroundColor = isRepeat ? "#4CAF50" : "#ccc";
  sliderCircleRepeat.style.transition = 'transform 0.3s ease';
  sliderCircleRepeat.style.transform = isRepeat ? 'translateX(14px)' : 'translateX(0)';
  repeatDateInput.style.display = "none";
  repeatDateInput.value = "";
  document.getElementById("repeatLabel").textContent = "Repeat:";
}
function showSuccessMessage() {
  const snackbar = document.getElementById("snackbar");
  snackbar.classList.add("show");
  snackbar.addEventListener("animationend", function handler(event) {
    if (event.animationName === "fadeout") {
      snackbar.classList.remove("show");
      snackbar.removeEventListener("animationend", handler);
    }
  });
}

function resetModalInputs() {
  titleInput.value = '';
  time1.value = '';
  time2.value = '';
  date.value = '';
  repeatDateInput.value = '';
  errorMessage.style.display = 'none';
  toggleAllDay();
  toggleRepeat();
}

// Add view select handler
const viewSelect = document.querySelector('[data-view-select]');
if (viewSelect) {
  viewSelect.addEventListener('change', (e) => {
    switchView(e.target.value, selectedDate);
    if (e.target.value === 'month') {
      renderCalendar(); // Re-render the month view when switching back
    }
  });
}



