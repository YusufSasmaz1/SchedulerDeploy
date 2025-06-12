import  {today, addDays, addMonths, subtractDays,subtractMonths}  from "./date.js";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
});


export function initNav(){
    const todayButtonElements = document.querySelector('[data-nav-today-button]'); 
    const previousButtonElements = document.querySelector('[data-nav-previous-button]'); 
    const nextButtonElements = document.querySelector('[data-nav-next-button]'); 
    const dayElements = document.querySelector('[data-nav-date]'); 

    let selectedView = "month";
    let selectedDate = today();

    for (const todayButtonElement of todayButtonElements) {
        todayButtonElement.addEventListener('click', () => {
            todayButtonElement.dispatchEvent(new CustomEvent('date-change', {
                detail: {
                    date: today()
                },
                bubbles: true
            }));
        });
    }
    previousButtonElements.addEventListener('click', () => {
        previousButtonElements.dispatchEvent(new CustomEvent('date-change', {
            detail: {
                date: getPreviousDate(selectedView, selectedDate)
            },
            bubbles: true            
        }));
    });

    nextButtonElements.addEventListener('click', () => {
        nextButtonElements.dispatchEvent(new CustomEvent('date-change', {
            detail: {
                date: getNextDate(selectedView, selectedDate)
            },
            bubbles: true            
        }));
    });


document.addEventListener("view-change", (event) => {
    selectedView = event.detail.view;
});
document.addEventListener("date-change", (event) => {
    selectedDate = event.detail.date;
    refreshDateElement(dayElements, selectedDate);
});

    refreshDateElement(dayElements, selectedDate);
}

function refreshDateElement(DateElement, selectedDate) {
    DateElement.textContent = dateFormatter.format(selectedDate);
};

function getPreviousDate(view, date) {
    if (view === "day") {
        return subtractDays(date, 1);
    }
    if (view === "week") {
        return subtractDays(date, 7);
    }
    if (view === "month") {
        return subtractMonths(date, 1);
    }
}
function getNextDate(view, date) {
    if (view === "day") {
        return addDays(date, 1);
    }
    if (view === "week") {
        return addDays(date, 7);
    }
    if (view === "month") {
        return addMonths(date, 1);
    }
}   