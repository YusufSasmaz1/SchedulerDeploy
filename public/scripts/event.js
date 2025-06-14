// Checks if start time is before end time
export function validateEvent(event) {
    if (event.startTime >= event.endTime) {
        return 'Start time must be before end time';
    }
    return null;
}