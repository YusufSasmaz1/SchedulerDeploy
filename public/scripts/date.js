// Returns today's date at noon
export function today() {
    const now = new Date();
    return new Date (
        now.getFullYear(),
        now.getMonth(), 
        now.getDate(),
        12
    );
}

// Adds months to a date
export function addMonths(date, months) {
    const firstDayOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + months,
        1,
        date.getHours(),    
    );
    const lastDayOfMonth = getLastDayOfMonth(firstDayOfMonth);
    // Prevents day overflow for shorter months
    const dayOfMonth = Math.min(date.getDate(), lastDayOfMonth.getDate()); 
    return new Date(
        date.getFullYear(),
        date.getMonth() + months,
        dayOfMonth,
        date.getHours(),
    );
}

// Subtracts months from a date
export function subtractMonths(date, months) {
    return addMonths(date, -months);
}

// Adds days to a date
export function addDays(date, days) {
    return new Date (
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + days,
        date.getHours(),
    )
}

// Subtracts days from a date
export function subtractDays(date, days) {
    return addDays(date, -days);
}

// Returns the last day of the month for a given date
function getLastDayOfMonth(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        12
    );
}