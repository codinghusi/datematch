
class Calendar {
    constructor(month = new Date()) {
        this.element = document.createElement('DIV');
        this.element.classList.add('calendar');
        this.month = month;
    }

    handleDayElement(element, day, date) {
        element.innerHTML = day || '';
    }
    
    handleDayClick(element, day, date) {
        
    }

    render() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), this.month, 1);
        const endOfMonth = new Date(startOfMonth.getFullYear(), this.month - 1, 0);
        const dayCount = endOfMonth.getDate();
        const startOffset = startOfMonth.getDate();
        const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        const weekCount = Math.ceil((startOffset + dayCount) / 7);
        let dayIndex = -startOffset + 2;
        
        const weeks = new Array(weekCount).fill().map(_ => new Array(7).fill().map(_ => ++dayIndex >= 1 && dayIndex <= dayCount ? dayIndex : null));

        // Clear
        this.element.innerHTML = '';

        const month = `
        <span class="month-name">
            ${months[startOfMonth.getMonth()]}
        </span>`;

        // Header
        const header = `<tr>${
            weekDays.map(day => `<th>${day}</th>`).join('\n')
        }</tr>`;

        // Rows / Weeks
        const rows = weeks.map(week => {
            const row = week.map(day => {

                return `
                <td data-day="${day || ''}" class="day">
                    <div class="day-content">
                    </div>
                </td>`;
            }).join('\n');
            return `<tr class="week">${row}</tr>`
        }).join('\n');

        // output
        this.element.innerHTML = `<table>${month}${header}${rows}</table>`;

        // iterate and make some click events
        const days = Array.from(this.element.querySelectorAll('.day'));
        days.forEach(element => {
            const day = element.dataset.day;
            const date = new Date(new Date().getFullYear(), this.month, day);
            const content = element.querySelector('.day-content');
            this.handleDayElement(content, day, date);

            element.addEventListener('click', () => {
                this.handleDayClick(content, day, date);
            })
        });
    }
}


class DatePicker extends Calendar{
    constructor(month, available = {}, picked = {}) {
        super(month);
        this.available = available;
        this.picked = picked;
    }

    handleDayElement(element, day, date) {
        super.handleDayElement(element, day, date);
        if (!(day > 0)) {
            element.classList.add('disabled');
        }
    }
    
    handleDayClick(element, day, date) {
        if (element.classList.contains('disabled')) {
            return;
        }
        element.classList.toggle('selected');
        this.picked[day] = element.classList.contains('selected');
    }
}


class DateResult extends Calendar{
    constructor(month, picked = {}) {
        super(month);
        this.picked = picked;
    }

    handleDayElement(element, day, date) {
        const pickcount = this.picked[day] || 0;
        element.innerHTML = `
            <span class="daynum">${day}</span>
            <span class="pickcount">${pickcount}</span>
        `;
    }
    
    handleDayClick(element, day, date) {
        console.log(this.picked);
        if (!this.picked[day]) {
            this.picked[day] = 0;
        }
        this.picked[day] += 1;
        element.innerHTML = this.handleDayElement(day, date);
    }
}

window.addEventListener('load' , () => {
    const calendarElement = document.getElementById('calendar');
    const topicElement = document.getElementById('topic');

    const picker = new DatePicker();
    calendarElement.appendChild(picker.element);
    picker.render();

    topicElement.innerHTML = "Wann machen wir das jetzt?";
})