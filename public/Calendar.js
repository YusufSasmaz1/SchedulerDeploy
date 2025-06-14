// Returns the month name for a given index
function getMonthName(monthIndex) {
  return [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ][monthIndex];
}

// Returns the number of days in a month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns the day of the week for the first day of a month
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

// Gets the userId from localStorage
const userId = localStorage.getItem('userId');
let allEvents = []; // Will be populated from server

let currentDate = new Date();
let todayHighlightFlag = false;

// DOM elements for calendar navigation
const navDateElement = document.querySelector('.nav__date');
const leftArrow = document.querySelectorAll('.nav__arrows button')[0];
const rightArrow = document.querySelectorAll('.nav__arrows button')[1];
const calendarDayList = document.querySelector('.month-calendar__day-list');
const todayButton = document.querySelector('.nav__controls .button--secondary');

// Tracks the current view (month, week, or day)
let currentView = 'month'; // can be 'month', 'week', or 'day'
let selectedDate = new Date();

// Formats a date as YYYY-MM-DD
function formatDateString(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Switches between month, week, and day views
function switchView(newView, date) {
  currentView = newView;
  
  // Hide all views first
  document.querySelector('.month-calendar').style.display = 'none';
  document.querySelector('[data-week-calendar]').style.display = 'none';
  document.querySelector('[data-day-calendar]').style.display = 'none';

  // Update dates based on view
  if (newView === 'month') {
    currentDate = new Date(date);
    document.querySelector('.month-calendar').style.display = '';
    renderCalendar();
  } else if (newView === 'week') {
    selectedDate = new Date(date);
    document.querySelector('[data-week-calendar]').style.display = '';
    renderWeeklyEvents();
  } else if (newView === 'day') {
    selectedDate = new Date(date);
    document.querySelector('[data-day-calendar]').style.display = '';
    updateDayView();
    renderDailyEvents();
  }

  // Sync the view selector dropdown
  const viewSelect = document.querySelector('[data-view-select]');
  if (viewSelect) {
    viewSelect.value = newView;
  }

  // Update nav date display
  updateNavDate();
}

// Updates the day view header
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

// Updates the navigation date display
function updateNavDate() {
  if (currentView === 'month') {
    navDateElement.textContent = `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;
  } else if (currentView === 'week') {
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    if (weekStart.getMonth() === weekEnd.getMonth()) {
      navDateElement.textContent = `${getMonthName(weekStart.getMonth())} ${weekStart.getDate()}-${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
    } else {
      navDateElement.textContent = `${getMonthName(weekStart.getMonth())} ${weekStart.getDate()} - ${getMonthName(weekEnd.getMonth())} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
    }
  } else if (currentView === 'day') {
    navDateElement.textContent = `${getMonthName(selectedDate.getMonth())} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
  }
}

// Formats a date as YYYY-MM-DD
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parses a date string and returns a Date object
function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date;
}

const MAX_EVENTS_PER_CELL = 3; // Maximum number of events to show before using "+X more"

// Renders the month calendar view
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  navDateElement.textContent = `${getMonthName(month)} ${year}`;
  calendarDayList.innerHTML = "";

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  // Add previous month's trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevMonthDay = daysInPrevMonth - i;
    const date = formatDate(new Date(prevYear, prevMonth, prevMonthDay));
    addCalendarDay(date, true);
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const li = document.createElement('li');
    li.classList.add('month-calendar__day');

    // Add hover effect for the entire cell
    li.classList.add('month-calendar__day--hoverable');

    const btn = document.createElement('button');
    btn.className = 'month-calendar__day-label';
    btn.classList.add('month-calendar__day-label--hoverable');
    btn.textContent = day;

    // Always highlight today if it matches
    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    ) {
      btn.classList.add('today-highlight');
    }

    // Day number click switches to day view
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const clickedDate = new Date(year, month, day);
      switchView('day', clickedDate);
    });

    // Cell click opens add event modal
    li.addEventListener('click', () => {
      // Format the date properly for the modal
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      
      // Set the date in the modal
      date.value = dateStr;
      
      // Reset other fields
      titleInput.value = '';
      time1.value = '';
      time2.value = '';
      repeatDateInput.value = '';
      errorMessage.style.display = 'none';
      toggleAllDay();
      toggleRepeat();
      typeEvent = 'event';
      
      modal.style.display = 'block';
    });

    li.appendChild(btn);

    const eventListWrapper = document.createElement('div');
    eventListWrapper.className = 'month-calendar__event-list-wrapper';
    eventListWrapper.style.maxHeight = 'calc(100% - 25px)'; // Leave space for the day number
    eventListWrapper.style.overflow = 'hidden';
    
    const eventList = document.createElement('ul');
    eventList.className = 'event-list';

    // Format date string for comparison with events
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    
    // Add events for this day
    const todaysEvents = allEvents.filter(e => e.selectedDate === dateStr);

    // Sort events by time
    todaysEvents.sort((a, b) => {
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      if (a.isAllDay && b.isAllDay) return 0;
      return a.time1Value.localeCompare(b.time1Value);
    });

    // Show limited number of events
    const visibleEvents = todaysEvents.slice(0, MAX_EVENTS_PER_CELL);
    const remainingEvents = todaysEvents.length - MAX_EVENTS_PER_CELL;

    visibleEvents.forEach(ev => {
      const eventItem = document.createElement('li');
      eventItem.className = 'event-item';
      eventItem.classList.add(`event-item--${ev.typeEvent}`);
      
      // Create a container for the event content
      const eventContent = document.createElement('div');
      eventContent.className = 'event-item__content';
      eventContent.style.overflow = 'hidden';
      eventContent.style.textOverflow = 'ellipsis';
      eventContent.style.whiteSpace = 'nowrap';
      eventContent.textContent = ev.title;
      
      eventItem.appendChild(eventContent);

      eventItem.addEventListener('click', (e) => {
        e.stopPropagation();
        // Store event id for deletion
        window.eventToDelete = ev;
        document.getElementById('deleteEventModal').style.display = 'block';
      });

      eventList.appendChild(eventItem);
    });

    // Add "+X more" indicator if there are additional events
    if (remainingEvents > 0) {
      const moreEventsItem = document.createElement('li');
      moreEventsItem.className = 'event-item event-item--more';
      moreEventsItem.textContent = `+${remainingEvents} more`;
      
      // Add click handler to show all events for this day
      moreEventsItem.addEventListener('click', (e) => {
        e.stopPropagation();
        // Switch to day view when clicking "+X more"
        switchView('day', dateStr);
      });
      
      eventList.appendChild(moreEventsItem);
    }

    eventListWrapper.appendChild(eventList);
    li.appendChild(eventListWrapper);
    calendarDayList.appendChild(li);
  }

  // Add next month's leading days
  const totalCells = 42;
  const remainingDays = totalCells - (firstDayOfWeek + daysInMonth);
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  
  for (let day = 1; day <= remainingDays; day++) {
    const date = formatDate(new Date(nextYear, nextMonth, day));
    addCalendarDay(date, true);
  }
}

// Helper function to add a day to the calendar
function addCalendarDay(dateStr, isInactive) {
  const li = document.createElement('li');
  li.classList.add('month-calendar__day');
  if (isInactive) {
    li.classList.add('month-calendar__day--inactive');
  }

  const btn = document.createElement('button');
  btn.className = 'month-calendar__day-label';
  btn.textContent = new Date(dateStr).getDate();

  // Day number click switches to day view
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    switchView('day', new Date(dateStr));
  });

  // Cell click opens add event modal
  li.addEventListener('click', () => {
    // Set the date in the modal
    date.value = dateStr;
    
    // Reset other fields
    titleInput.value = '';
    time1.value = '';
    time2.value = '';
    repeatDateInput.value = '';
    errorMessage.style.display = 'none';
    toggleAllDay();
    toggleRepeat();
    typeEvent = 'event';
    eventTypeSelect.value = 'event';
    
    modal.style.display = 'block';
  });

  li.appendChild(btn);

  const eventListWrapper = document.createElement('div');
  eventListWrapper.className = 'month-calendar__event-list-wrapper';
  eventListWrapper.style.maxHeight = 'calc(100% - 25px)';
  eventListWrapper.style.overflow = 'hidden';
  
  const eventList = document.createElement('ul');
  eventList.className = 'event-list';

  // Add events for this day
  const todaysEvents = allEvents.filter(e => e.selectedDate === dateStr);

  // Sort events by time
  todaysEvents.sort((a, b) => {
    if (a.isAllDay && !b.isAllDay) return -1;
    if (!a.isAllDay && b.isAllDay) return 1;
    if (a.isAllDay && b.isAllDay) return 0;
    return a.time1Value.localeCompare(b.time1Value);
  });

  // Show limited number of events
  const visibleEvents = todaysEvents.slice(0, MAX_EVENTS_PER_CELL);
  const remainingEvents = todaysEvents.length - MAX_EVENTS_PER_CELL;

  visibleEvents.forEach(ev => {
    const eventItem = document.createElement('li');
    eventItem.className = `event-item event-item--${ev.typeEvent || 'event'}`;
    
    const eventContent = document.createElement('div');
    eventContent.className = 'event-item__content';
    eventContent.style.overflow = 'hidden';
    eventContent.style.textOverflow = 'ellipsis';
    eventContent.style.whiteSpace = 'nowrap';
    eventContent.textContent = ev.title;
    
    eventItem.appendChild(eventContent);
    
    eventItem.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event from bubbling up
      // Store event id for deletion
      window.eventToDelete = ev;
      document.getElementById('deleteEventModal').style.display = 'block';
    });
    
    eventList.appendChild(eventItem);
  });

  if (remainingEvents > 0) {
    const moreItem = document.createElement('li');
    moreItem.className = 'event-item event-item--more';
    moreItem.textContent = `+${remainingEvents} more`;
    eventList.appendChild(moreItem);
  }

  eventListWrapper.appendChild(eventList);
  li.appendChild(eventListWrapper);
  calendarDayList.appendChild(li);
}

// View selector event listener
document.querySelector('[data-view-select]').addEventListener('change', (e) => {
  const newView = e.target.value;
  if (newView === currentView) return; // Don't do anything if the view hasn't changed
  
  // Store the current date before switching views
  const currentDateToUse = currentView === 'month' ? currentDate : selectedDate;
  
  // Switch to the new view
  switchView(newView, currentDateToUse);
});

// Add event listeners for arrow buttons
leftArrow.addEventListener('click', () => {
  if (currentView === 'month') {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  } else if (currentView === 'week') {
    selectedDate.setDate(selectedDate.getDate() - 7);
    renderWeeklyEvents();
  } else if (currentView === 'day') {
    selectedDate.setDate(selectedDate.getDate() - 1);
    updateDayView();
    renderDailyEvents();
  }
  updateNavDate();
});

rightArrow.addEventListener('click', () => {
  if (currentView === 'month') {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  } else if (currentView === 'week') {
    selectedDate.setDate(selectedDate.getDate() + 7);
    renderWeeklyEvents();
  } else if (currentView === 'day') {
    selectedDate.setDate(selectedDate.getDate() + 1);
    updateDayView();
    renderDailyEvents();
  }
  updateNavDate();
});

//today button logic (no longer needs to set highlight flag)
if (todayButton) {
  todayButton.addEventListener('click', () => {
    currentDate = new Date();
    selectedDate = new Date();
    switchView(currentView, currentDate);
    renderCalendar();
  });
}
document.addEventListener('DOMContentLoaded', () => {
  todayHighlightFlag = false;
  loadEvents(); // This will load events and then render the calendar
  switchView('month', currentDate);
});


//initalize variables
const modal = document.getElementById("addEventModal");
const cancelModal = document.getElementById("cancelModal");
const addEventButton = document.getElementById("addEventButton");
const addTaskButton = document.getElementById("addTaskButton");
const addReminderButton = document.getElementById("addReminderButton");
const closeMain = document.querySelectorAll(".close-main")[0];
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

// Adding events/tasks/reminders
//All popup the same modal, only typeEvent is different for each in the event details
addEventButton.onclick = () => {
  modal.style.display = "block";
  errorMessage.style.display = "none";
  typeEvent = "event";
};
addTaskButton.onclick = () => {
  modal.style.display = "block";
  errorMessage.style.display = "none";
  typeEvent = "task";
  eventTypeSelect.value = "task";
};
addReminderButton.onclick = () => {
  modal.style.display = "block";
  errorMessage.style.display = "none";
  typeEvent = "reminder";
  eventTypeSelect.value = "reminder";
};

//Show the modal "Are you sure you want to cancel" when X is clicked
closeMain.onclick = () => {
  cancelModal.style.display = "block";
};

//Reset inputs when the modal is cancelled 
yes.onclick = () => {
  cancelModal.style.display = "none";
  modal.style.display = "none";
  resetModalInputs();
};
no.onclick = () => {
  cancelModal.style.display = "none";
};

//Error handling inside "add event" modal
submit.onclick = async () => {
  const title = titleInput.value.trim();
  const time1Value = time1.value;
  const time2Value = time2.value;
  const selectedDate = date.value; // This is already in YYYY-MM-DD format
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

  if (!isAllDay && time1Value && time2Value) {
    const time1Date = new Date(`${selectedDate}T${time1Value}`);
    const time2Date = new Date(`${selectedDate}T${time2Value}`);
    if (time1Date >= time2Date) {
      errorMessage.textContent = "Error: Start time cannot be later than end time.";
      errorMessage.style.display = "block";
      return;
    }
  }

  if (isRepeat && !repeatDate) {
    errorMessage.textContent = "Please enter a repeat end date.";
    errorMessage.style.display = "block";
    return;
  }

  if (isRepeat && repeatDate) {
    const eventStartDate = new Date(selectedDate);
    const repeatEndDate = new Date(repeatDate);
    if (repeatEndDate < eventStartDate) {
      errorMessage.textContent = "Repeat end date cannot be before the event date.";
      errorMessage.style.display = "block";
      return;
    }

    // Create repeating events
    const currentDate = new Date(eventStartDate);
    while (currentDate <= repeatEndDate) {
      const eventData = {
        title,
        selectedDate: formatDateString(currentDate),
        time1Value,
        time2Value,
        isAllDay,
        isRepeat,
        repeatDate,
        typeEvent
      };
      
      const success = await saveEvent(eventData);
      if (!success) {
        errorMessage.textContent = "Error saving event";
        errorMessage.style.display = "block";
        return;
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
  } else {
    // Store single event
    const eventData = {
      title,
      selectedDate,
      time1Value,
      time2Value,
      isAllDay,
      isRepeat,
      repeatDate,
      typeEvent
    };
    
    const success = await saveEvent(eventData);
    if (!success) {
      errorMessage.textContent = "Error saving event";
      errorMessage.style.display = "block";
      return;
    }
  }

  resetModalInputs();
  errorMessage.style.display = "none";
  modal.style.display = "none";
  showSuccessMessage();
};

//When mouse is clicked elsewhere on the screen (while add event modal is on) it closes the modal, but doesnt reset input fields
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    errorMessage.style.display = "none";
  } else if (event.target === cancelModal) {
    cancelModal.style.display = "none";
  } else if (event.target === deleteEventModal) {
    deleteEventModal.style.display = "none";
    window.eventToDelete = null;
  }
};


//Toggle Repeat slider
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

//Toggle ALl Day slider
sliderAllDay.addEventListener('click', function () {
  isAllDay = !isAllDay;
  sliderAllDay.style.backgroundColor = isAllDay ? "#4CAF50" : "#ccc";
  sliderCircleAllDay.style.transform = isAllDay ? "translateX(14px)" : "translateX(0)";
});

//Turn off All Day and Repeat sliders seperately, resetModalInputs() doesn't do this on its own
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

//Show "Changes Saved" snackbar at the bottom when event is added
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

//reset all input fields to blank, the sliders to off
function resetModalInputs() {
  titleInput.value = '';
  time1.value = '';
  time2.value = '';
  date.value = '';
  repeatDateInput.value = '';
  errorMessage.style.display = 'none';
  eventTypeSelect.value = 'event'; // Reset to default event type
  typeEvent = 'event';
  toggleAllDay();
  toggleRepeat();
}

// Add view select handler
const viewSelect = document.querySelector('[data-view-select]');
if (viewSelect) {
  viewSelect.addEventListener('change', (e) => {
    switchView(e.target.value, selectedDate);
    if (e.target.value === 'month') {
      renderCalendar(); // render the month view again when switching back
    }
  });
}

// Function to load events from server
async function loadEvents() {
  try {
    const response = await fetch(`/api/events/${userId}`);
    if (response.ok) {
      allEvents = await response.json();
      // Render the current view with the loaded events
      switchView(currentView, selectedDate);
    } else {
      console.error('Failed to load events');
    }
  } catch (err) {
    console.error('Error loading events:', err);
  }
}

// Normalize a date to midnight in local timezone (time values get messed up without setting a default time zone)
function normalizeDate(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

// Helper function to check if two events overlap in time
function eventsOverlap(event1, event2) {
  const [start1Hour, start1Min] = event1.time1Value.split(':').map(Number);
  const [end1Hour, end1Min] = event1.time2Value.split(':').map(Number);
  const [start2Hour, start2Min] = event2.time1Value.split(':').map(Number);
  const [end2Hour, end2Min] = event2.time2Value.split(':').map(Number);

  const start1 = start1Hour * 60 + start1Min;
  const end1 = end1Hour * 60 + end1Min;
  const start2 = start2Hour * 60 + start2Min;
  const end2 = end2Hour * 60 + end2Min;

  return (start1 < end2 && end1 > start2);
}

// Helper function to find all overlapping events for a given event
function findOverlappingEvents(event, allEvents) {
  const overlappingEvents = [event];
  
  allEvents.forEach(otherEvent => {
    if (otherEvent === event) return;
    
    // Check if this event overlaps with any event in our current group
    const overlapsWithGroup = overlappingEvents.some(groupEvent => 
      eventsOverlap(groupEvent, otherEvent)
    );
    
    if (overlapsWithGroup) {
      overlappingEvents.push(otherEvent);
    }
  });
  
  return overlappingEvents;
}

// Helper function to render a single event
function renderEvent(event, column, overlappingEvents, eventIndex) {
  const [startHour, startMinute] = event.time1Value.split(':').map(Number);
  const [endHour, endMinute] = event.time2Value.split(':').map(Number);
  
  const startPercent = (startHour + startMinute / 60) * (100 / 24);
  const endPercent = (endHour + endMinute / 60) * (100 / 24);
  const duration = endPercent - startPercent;

  const eventEl = document.createElement('div');
  eventEl.className = `event event--dynamic event-item--${event.typeEvent || 'event'}`;
  eventEl.style.top = `${startPercent}%`;
  
  // Set minimum height for very short events
  const minHeight = 2; // Minimum height in percentage
  eventEl.style.height = `${Math.max(duration, minHeight)}%`;
  
  // Calculate width and position based on number of overlapping events
  const totalEvents = overlappingEvents.length;
  const width = 85 / totalEvents; // 85% total width to leave some space
  eventEl.style.width = `${width}%`;
  eventEl.style.left = `${(eventIndex * width + 7.5)}%`; // 7.5% left margin
  
  const title = document.createElement('span');
  title.className = 'event__title';
  title.textContent = event.title;
  
  const time = document.createElement('span');
  time.className = 'event__time';
  time.textContent = `${event.time1Value} - ${event.time2Value}`;
  
  // Add a special class for very short events
  if (duration < minHeight) {
    eventEl.classList.add('event--short');
  }
  
  eventEl.appendChild(title);
  eventEl.appendChild(time);

  eventEl.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    // Store event id for deletion
    window.eventToDelete = event;
    document.getElementById('deleteEventModal').style.display = 'block';
  });
  
  column.appendChild(eventEl);
}

// Function to render events in weekly view
function renderWeeklyEvents() {
  const weekStart = new Date(selectedDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  
  // Update the week header dates
  const dayHeaders = document.querySelectorAll('[data-week-calendar] .week-calendar__day-of-week-button');
  dayHeaders.forEach((header, index) => {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + index);
    
    const dayText = header.querySelector('.week-calendar__day-of-week-day');
    const dayNumber = header.querySelector('.week-calendar__day-of-week-num');
    
    if (dayText) dayText.textContent = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][currentDate.getDay()];
    if (dayNumber) dayNumber.textContent = currentDate.getDate();
    
    // Add click event listener to switch to daily view
    header.addEventListener('click', () => {
      switchView('day', currentDate);
    });
    
    // Add cursor pointer style
    header.style.cursor = 'pointer';
  });

  // Clear existing events
  document.querySelectorAll('.week-calendar__all-day-list .event-list').forEach(list => {
    list.innerHTML = '';
  });
  document.querySelectorAll('.week-calendar__columns').forEach(col => {
    col.innerHTML = '';
  });

  // Create columns for each day
  const columnsContainer = document.createElement('div');
  columnsContainer.className = 'week-calendar__columns';
  
  for (let i = 0; i < 7; i++) {
    const column = document.createElement('div');
    column.className = 'week-calendar__coloumn';
    
    // Add cells for each hour
    for (let hour = 0; hour < 24; hour++) {
      const cell = document.createElement('div');
      cell.className = 'week-calendar__cell';
      
      // Add click handler to open modal with selected time
      cell.addEventListener('click', () => {
        const currentDate = new Date(weekStart);
        currentDate.setDate(currentDate.getDate() + i);
        const dateStr = formatDateString(currentDate);
        const timeStr = `${String(hour).padStart(2, '0')}:00`;
        
        // Set the date and time in the modal
        date.value = dateStr;
        time1.value = timeStr;
        time2.value = `${String(hour + 1).padStart(2, '0')}:00`;
        
        // Reset other fields
        titleInput.value = '';
        repeatDateInput.value = '';
        errorMessage.style.display = 'none';
        toggleAllDay();
        toggleRepeat();
        typeEvent = 'event';
        
        modal.style.display = 'block';
      });
      
      column.appendChild(cell);
    }
    
    columnsContainer.appendChild(column);
  }

  // Find the existing columns container and replace it
  const existingColumns = document.querySelector('.week-calendar__columns');
  if (existingColumns) {
    existingColumns.replaceWith(columnsContainer);
  } else {
    document.querySelector('.week-calendar__content-inner').appendChild(columnsContainer);
  }

  // Get events for the week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  // Group events by day and time slot for collision detection
  const eventsByDay = Array(7).fill().map(() => []);
  const allDayEventsByDay = Array(7).fill().map(() => []);

  allEvents.forEach(event => {
    const eventDate = parseDate(event.selectedDate);
    const weekStartNorm = new Date(weekStart);
    const weekEndNorm = new Date(weekStart);
    weekEndNorm.setDate(weekEndNorm.getDate() + 7);
    
    if (eventDate >= weekStartNorm && eventDate < weekEndNorm) {
      const dayIndex = eventDate.getDay();
      if (event.isAllDay) {
        allDayEventsByDay[dayIndex].push(event);
      } else {
        eventsByDay[dayIndex].push(event);
      }
    }
  });

  // Render all-day events
  allDayEventsByDay.forEach((events, dayIndex) => {
    const allDayList = document.querySelectorAll('.week-calendar__all-day-list-item')[dayIndex];
    if (allDayList) {
      const eventList = allDayList.querySelector('.event-list');
      events.forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = `event-item event-item--${event.typeEvent || 'event'}`;
        
        const content = document.createElement('div');
        content.className = 'event-item__content';
        content.textContent = event.title;
        
        eventEl.appendChild(content);
        
        eventEl.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent event from bubbling up
          // Store event id for deletion
          window.eventToDelete = event;
          document.getElementById('deleteEventModal').style.display = 'block';
        });
        
        eventList.appendChild(eventEl);
      });
    }
  });

  // Render time-specific events with collision handling
  eventsByDay.forEach((dayEvents, dayIndex) => {
    const column = columnsContainer.children[dayIndex];
    
    // Sort events by start time
    dayEvents.sort((a, b) => {
      const timeA = a.time1Value || '00:00';
      const timeB = b.time1Value || '00:00';
      return timeA.localeCompare(timeB);
    });

    // Find all overlapping event groups
    const processedEvents = new Set();
    
    dayEvents.forEach(event => {
      if (processedEvents.has(event)) return;
      
      const overlappingEvents = findOverlappingEvents(event, dayEvents);
      
      // Sort overlapping events by start time
      overlappingEvents.sort((a, b) => {
        const timeA = a.time1Value || '00:00';
        const timeB = b.time1Value || '00:00';
        return timeA.localeCompare(timeB);
      });
      
      // Render each event in the group
      overlappingEvents.forEach((evt, index) => {
        renderEvent(evt, column, overlappingEvents, index);
        processedEvents.add(evt);
      });
    });
  });
}

// Function to render events in daily view
function renderDailyEvents() {
  // Clear existing events
  document.querySelectorAll('.week-calendar--day .event-list').forEach(list => {
    list.innerHTML = '';
  });
  document.querySelectorAll('.week-calendar--day .week-calendar__columns').forEach(col => {
    col.innerHTML = '';
  });

  // Create columns for the day
  const columnsContainer = document.createElement('div');
  columnsContainer.className = 'week-calendar__columns';
  
  const column = document.createElement('div');
  column.className = 'week-calendar__coloumn';
  
  // Add cells for each hour
  for (let hour = 0; hour < 24; hour++) {
    const cell = document.createElement('div');
    cell.className = 'week-calendar__cell';
    
    // Add click handler to open modal with selected time
    cell.addEventListener('click', () => {
      const dateStr = formatDateString(selectedDate);
      const timeStr = `${String(hour).padStart(2, '0')}:00`;
      
      // Set the date and time in the modal
      date.value = dateStr;
      time1.value = timeStr;
      time2.value = `${String(hour + 1).padStart(2, '0')}:00`;
      
      // Reset other fields
      titleInput.value = '';
      repeatDateInput.value = '';
      errorMessage.style.display = 'none';
      toggleAllDay();
      toggleRepeat();
      typeEvent = 'event';
      
      modal.style.display = 'block';
    });
    
    column.appendChild(cell);
  }
  
  columnsContainer.appendChild(column);

  // Find the existing columns container and replace it
  const existingColumns = document.querySelector('.week-calendar--day .week-calendar__columns');
  if (existingColumns) {
    existingColumns.replaceWith(columnsContainer);
  } else {
    document.querySelector('.week-calendar--day .week-calendar__content-inner').appendChild(columnsContainer);
  }

  // Get all events for the selected date
  const dateStr = formatDateString(selectedDate);
  const dayEvents = allEvents.filter(event => event.selectedDate === dateStr);

  // Separate all-day events and time-specific events
  const allDayEvents = dayEvents.filter(event => event.isAllDay);
  const timeEvents = dayEvents.filter(event => !event.isAllDay);

  // Render all-day events
  const allDayList = document.querySelector('.week-calendar--day .week-calendar__all-day-list-item .event-list');
  if (allDayList) {
    allDayEvents.forEach(event => {
      const eventEl = document.createElement('div');
      eventEl.className = `event-item event-item--${event.typeEvent || 'event'}`;
      
      const content = document.createElement('div');
      content.className = 'event-item__content';
      content.textContent = event.title;
      
      eventEl.appendChild(content);
      
      eventEl.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        // Store event id for deletion
        window.eventToDelete = event;
        document.getElementById('deleteEventModal').style.display = 'block';
      });
      
      allDayList.appendChild(eventEl);
    });
  }

  // Sort time-specific events by start time
  timeEvents.sort((a, b) => {
    const timeA = a.time1Value || '00:00';
    const timeB = b.time1Value || '00:00';
    return timeA.localeCompare(timeB);
  });

  // Find all overlapping event groups
  const processedEvents = new Set();
  
  timeEvents.forEach(event => {
    if (processedEvents.has(event)) return;
    
    const overlappingEvents = findOverlappingEvents(event, timeEvents);
    
    // Sort overlapping events by start time
    overlappingEvents.sort((a, b) => {
      const timeA = a.time1Value || '00:00';
      const timeB = b.time1Value || '00:00';
      return timeA.localeCompare(timeB);
    });
    
    // Render each event in the group
    overlappingEvents.forEach((evt, index) => {
      renderEvent(evt, column, overlappingEvents, index);
      processedEvents.add(evt);
    });
  });
}

// Helper function to create event elements
function createEventElement(event) {
  const eventEl = document.createElement('div');
  eventEl.className = `event-item event-item--${event.typeEvent || 'event'}`;
  
  const content = document.createElement('div');
  content.className = 'event-item__content';
  content.textContent = event.title;
  
  eventEl.appendChild(content);
  
  eventEl.addEventListener('click', () => {
    // Set the event details in the modal
    titleInput.value = event.title;
    date.value = event.selectedDate;
    time1.value = event.time1Value;
    time2.value = event.time2Value;
    typeEvent = event.typeEvent || 'event';
    eventTypeSelect.value = typeEvent;
    
    if (event.isAllDay) {
      allDayCheckbox.checked = true;
      time1.disabled = true;
      time2.disabled = true;
    } else {
      allDayCheckbox.checked = false;
      time1.disabled = false;
      time2.disabled = false;
    }
    
    if (event.isRepeat) {
      repeatCheckbox.checked = true;
      repeatDateInput.style.display = 'block';
      repeatDateInput.value = event.repeatDate;
    } else {
      repeatCheckbox.checked = false;
      repeatDateInput.style.display = 'none';
      repeatDateInput.value = '';
    }
    
    errorMessage.style.display = 'none';
    modal.style.display = 'block';
  });
  
  return eventEl;
}

// Update saveEvent function to handle dates properly
async function saveEvent(eventData) {
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        ...eventData
      })
    });
    
    if (response.ok) {
      const savedEvent = await response.json();
      allEvents.push(savedEvent);
      
      // Update the current view
      if (currentView === 'month') {
        renderCalendar();
      } else if (currentView === 'week') {
        renderWeeklyEvents();
      } else if (currentView === 'day') {
        renderDailyEvents();
      }
      return true;
    }
    return false;
  } catch (err) {
    console.error('Error saving event:', err);
    return false;
  }
}

// Add these styles to your CSS
const style = document.createElement('style');
style.textContent = `
  .month-calendar__day {
    position: relative;
    overflow: hidden;
  }
  
  .event-item {
    margin: 1px 2px;
    padding: 1px 4px;
    font-size: 0.8em;
    border-radius: 2px;
    cursor: pointer;
  }
  
  .event-item--more {
    background-color: #f0f0f0;
    color: #666;
    text-align: center;
    font-style: italic;
  }
  
  .event-item__content {
    max-width: 100%;
  }
  
  .month-calendar__event-list-wrapper {
    position: relative;
  }
`;
document.head.appendChild(style);

// Add debounce mechanism for keyboard navigation
let lastKeyPressTime = 0;
const DEBOUNCE_DELAY = 150; // milliseconds between allowed key presses

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
  const currentTime = Date.now();
  if (currentTime - lastKeyPressTime < DEBOUNCE_DELAY) {
    return; // Ignore key press if it's too soon after the last one
  }
  
  if (e.key === 'ArrowLeft') {
    lastKeyPressTime = currentTime;
    if (currentView === 'month') {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    } else if (currentView === 'week') {
      selectedDate.setDate(selectedDate.getDate() - 7);
      renderWeeklyEvents();
    } else if (currentView === 'day') {
      selectedDate.setDate(selectedDate.getDate() - 1);
      updateDayView();
      renderDailyEvents();
    }
    updateNavDate();
  } else if (e.key === 'ArrowRight') {
    lastKeyPressTime = currentTime;
    if (currentView === 'month') {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    } else if (currentView === 'week') {
      selectedDate.setDate(selectedDate.getDate() + 7);
      renderWeeklyEvents();
    } else if (currentView === 'day') {
      selectedDate.setDate(selectedDate.getDate() + 1);
      updateDayView();
      renderDailyEvents();
    }
    updateNavDate();
  }
});

// Add event type selector to the modal
const eventTypeSelect = document.createElement('select');
eventTypeSelect.className = 'modal__input';
eventTypeSelect.id = 'eventType';

// Add options for event types
const eventTypes = [
  { value: 'event', label: 'Event' },
  { value: 'task', label: 'Task' },
  { value: 'reminder', label: 'Reminder' }
];

eventTypes.forEach(type => {
  const option = document.createElement('option');
  option.value = type.value;
  option.textContent = type.label;
  eventTypeSelect.appendChild(option);
});

// Insert the select element after the title input
titleInput.parentNode.insertBefore(eventTypeSelect, titleInput.nextSibling);

// Update the event type when selection changes
eventTypeSelect.addEventListener('change', (e) => {
  typeEvent = e.target.value;
});

// Add event listeners for delete confirmation modal
const deleteEventModal = document.getElementById('deleteEventModal');
const deleteYes = document.getElementById('deleteYes');
const deleteNo = document.getElementById('deleteNo');
deleteYes.onclick = async () => {
  if (window.eventToDelete && window.eventToDelete._id) {
    try {
      const response = await fetch(`/api/events/${window.eventToDelete._id}`, { method: 'DELETE' });
      if (response.ok) {
        // Remove from allEvents and re-render
        const idx = allEvents.findIndex(ev => ev._id === window.eventToDelete._id);
        if (idx !== -1) allEvents.splice(idx, 1);
        renderCalendar();
        renderWeeklyEvents && renderWeeklyEvents();
        renderDailyEvents && renderDailyEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  }
  deleteEventModal.style.display = 'none';
  window.eventToDelete = null;
};
deleteNo.onclick = () => {
  deleteEventModal.style.display = 'none';
  window.eventToDelete = null;
};



