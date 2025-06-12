export function initEventStore() {
    document.addEventListener("event-create", (event) => {
       const createdEvent = event.detail.event;
       const events = getEventsFromLocalStorage();
       events.push(createdEvent)

       saveEventsIntoLocalStorage([createdEvent]);
    });
}

function saveEventsIntoLocalStorage(events) {
    const SafeToStringfyEvents = events.map((event) => ({
        ...event,
        date: event.date.toISOString()
    }));
    let stringifiedEvents;
    try {
        stringifiedEvents = JSON.stringify(SafeToStringfyEvents);
    } catch (error) {
        console.error("Error stringifying events:", error);
        return;
    }
    localStorage.setItem("events", stringifiedEvents);
}

function getEventsFromLocalStorage() {
    const localStorageEvent = localStorage.getItem("events");
    if (localStorageEvent === null) {
        return [];
    }
    let parsedEvents;
    try {
        parsedEvents = JSON.parse(stringifiedEvents);
    } catch (error) {
        console.error("Error parsing events from localStorage:", error);
        return [];
    }
    
    const events = parsedEvents.map((event) => ({
        ...event,
        date: new Date(event.date),
    }));
    return events;
}