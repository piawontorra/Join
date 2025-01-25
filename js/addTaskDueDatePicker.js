/**
 * Initializes the datepicker by setting up event listeners and generating the calendar.
 */
function initializeDatepicker() {
    const calendarIcon = document.getElementById("calendarIcon");
    const calendarPopup = document.getElementById("calendarPopup");
    const inputDueDate = document.getElementById("inputDueDate");
    const selectedMonth = document.getElementById("selectedMonth");
    const selectedYear = document.getElementById("selectedYear");
    const monthSelect = document.getElementById("monthSelect");
    const yearSelect = document.getElementById("yearSelect");

    const monthNames = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    };

    /**
     * Formats a number to include a leading zero if it is less than 10.
     * @param {number} number - The number to format.
     * @returns {string} The formatted number as a string.
     */
    function formatDate(number) {
        return number < 10 ? `0${number}` : `${number}`;
    }

    /**
     * Checks if a given date is strictly in the past.
     * Allows the selection of the current day.
     * 
     * @param {number} day - The day of the month.
     * @param {number} month - The month (1-12).
     * @param {number} year - The year.
     * @returns {boolean} True if the date is strictly in the past, false otherwise.
     */
    function isPastDate(day, month, year) {
        const today = new Date();
        const selectedDate = new Date(year, month - 1, day);

        return selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

    /**
     * Generates the header row for the calendar table with weekday abbreviations.
     * @returns {string} The HTML string for the table header row.
     */
    function generateTableHeader() {
        const days = ["So", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        return `<tr>${days.map(day => `<th>${day}</th>`).join('')}</tr>`;
    }

    /**
     * Generates the table cells for the calendar based on the given parameters.
     * @param {number} firstDay - The index of the first day of the month (0-6, where 0 is Sunday).
     * @param {number} daysInMonth - The total number of days in the month.
     * @param {number} month - The month (1-12).
     * @param {number} year - The year.
     * @returns {string} The HTML string for the table cells.
     */
    function generateTableCells(firstDay, daysInMonth, month, year) {
        let tableHTML = "<tr>";

        for (let i = 0; i < firstDay; i++) {
            tableHTML += "<td></td>";
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isDisabled = isPastDate(day, month, year);
            const cellClass = isDisabled ? "disabled" : "selectable";
            tableHTML += `<td class="${cellClass}" data-day="${day}">${day}</td>`;
            if ((firstDay + day) % 7 === 0) tableHTML += "</tr><tr>";
        }

        tableHTML += "</tr>";
        return tableHTML;
    }

    /**
     * Generates the calendar for a specific month and year.
     * @param {number} month - The month (1-12).
     * @param {number} year - The year.
     */
    function generateCalendar(month, year) {
        const daysInMonth = new Date(year, month, 0).getDate();
        const firstDay = new Date(year, month - 1, 1).getDay();

        const tableHTML = generateTableHeader() + generateTableCells(firstDay, daysInMonth, month, year);
        document.getElementById("calendarTable").innerHTML = tableHTML;
    }

    /**
     * Toggles the visibility of an HTML element.
     * @param {HTMLElement} element - The element to toggle.
     */
    function toggleVisibility(element) {
        element.style.display = element.style.display === "block" ? "none" : "block";
    }

    /**
     * Sets the calendar to display January 2025 by default.
     */
    function resetCalendarToDefault() {
        const defaultMonth = "January";
        const defaultYear = "2025";
        selectedMonth.textContent = defaultMonth;
        selectedYear.textContent = defaultYear;
        generateCalendar(1, 2025);
    }

    /**
     * Sets up the calendar popup and its initial state.
     */
    function setupCalendarPopup() {
        calendarIcon.addEventListener("click", function () {
            toggleVisibility(calendarPopup);
            resetCalendarToDefault();
        });
    }

    /**
     * Handles the selection of a date from the calendar and updates the input field.
     * @param {Event} event - The click event triggered on the calendar table.
     */
    function handleDateSelection(event) {
        const target = event.target;
        if (target.classList.contains("selectable")) {
            const day = target.dataset.day;
            const month = monthNames[selectedMonth.textContent];
            const year = parseInt(selectedYear.textContent, 10);
            inputDueDate.value = `${formatDate(day)}/${formatDate(month)}/${year}`;
            calendarPopup.style.display = "none";
        }
    }

    /**
     * Sets up a dropdown menu and updates the selected value when an option is chosen.
     * @param {HTMLElement} selectElement - The container element for dropdown options.
     * @param {HTMLElement} selectedElement - The element displaying the currently selected value.
     * @param {Function} updateCallback - The callback function to execute when a new value is selected.
     */
    function setupDropdown(selectElement, selectedElement, updateCallback) {
        const options = selectElement.querySelectorAll("div");

        selectedElement.addEventListener("click", function () {
            selectElement.classList.toggle("select-hide");
            selectedElement.classList.toggle("active");
        });
        options.forEach(option => {
            option.addEventListener("click", function () {
                selectedElement.textContent = option.textContent;
                selectElement.classList.add("select-hide");
                selectedElement.classList.remove("active");
                updateCallback(option.textContent);
            });
        });
    }

    /**
     * Updates the calendar when a new month is selected.
     * @param {string} monthText - The name of the selected month.
     */
    function updateCalendarForMonth(monthText) {
        const month = monthNames[monthText];
        const year = parseInt(selectedYear.textContent, 10);
        generateCalendar(month, year);
    }

    /**
     * Updates the calendar when a new year is selected.
     * @param {string} yearText - The name of the selected year.
     */
    function updateCalendarForYear(yearText) {
        const year = parseInt(yearText, 10);
        const month = monthNames[selectedMonth.textContent];
        generateCalendar(month, year);
    }

    /**
     * Closes the calendar popup when clicking outside of it.
     */
    function closePopupOnClickOutside() {
        document.addEventListener("click", function (event) {
            if (!calendarPopup.contains(event.target) && event.target !== calendarIcon) {
                calendarPopup.style.display = "none";
            }
        });
    }

    setupCalendarPopup();
    document.getElementById("calendarTable").addEventListener("click", handleDateSelection);
    setupDropdown(monthSelect, selectedMonth, updateCalendarForMonth);
    setupDropdown(yearSelect, selectedYear, updateCalendarForYear);
    closePopupOnClickOutside();
}

document.addEventListener("DOMContentLoaded", initializeDatepicker);
