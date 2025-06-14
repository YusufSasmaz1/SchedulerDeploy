const calendarTempelateElement = document.getElementById("[calendar-template = 'month-calendar']");
const calendarDayTemplateElement = document.getElementById("[calendar-template = 'month-calendar-day']");
// const calendarWeekTemplateElement = document.getElementById("[calendar-template = 'week']");

// Month calendar view setup
export function initMonthCalendar(parent, selectedView) {
    const calendarContent = calendarTempelateElement.contentEditable.cloneNode(true);
    const calendarElement = calendarContent.querySelector("[data-calendar-month]");
    const calendarDayListElement = calendarContent.querySelector("[data-calendar-month-day-list]");
}