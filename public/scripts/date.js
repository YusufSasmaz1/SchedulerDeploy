export function today() {
    const now = new Date();
    return new Date (
        now.getFullYear(),
        now.getMonth(), 
        now.getDate(),
        12, // Set to noon to avoid timezone issues
    );
}

export function addMonths(date, months) {
    const firstDayOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + months,
        1, // Set to the first day of the month
        date.getHours(),    
    );
    const lastDayOfMonth = getLastDayOfMonth(firstDayOfMonth);

    const dayOfMonth = Math.min(date.getDate(), lastDayOfMonth.getDate()); 

    return new Date(
        date.getFullYear(),
        date.getMonth() + months,
        dayOfMonth, // Use the minimum of the current day and the last day of the month
        date.getHours(), // Keep the same hour
    );
}
export function subtractMonths(date, months) {
    return addMonths(date, -months);
}
export function addDays(date, days) {
    return new Date (
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + days,
        date.getHours(),
    )
}
export function subtractDays(date, days) {
    return addDays(date, -days);
}

function getLastDayOfMonth(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0, // Set to the last day of the month
        12, // Set to noon to avoid timezone issues
    );
}