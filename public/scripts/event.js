export function validateEvent(event) {
    if (event.startTime >= event.endTime) {
        return 'Start time must be before end time';
    }
    return null;
}