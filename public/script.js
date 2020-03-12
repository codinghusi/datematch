
class Calendar {
    constructor(month = new Date()) {
        this.element = document.createElement('DIV');
        this.element.classList.add('calendar');
        this.month = month;
        this.nextMonth(0); // adjusting the month correctly
    }

    randomFlyIn(element) {
        const offsetRange = 200;
        const duration = Math.random() * 500;
        const xOffset = Math.random() * offsetRange - offsetRange / 2;
        const yOffset = Math.random() * offsetRange - offsetRange / 2;
        Object.assign(element.style, {
            position: 'relative',
            left: `${xOffset}px`,
            top: `${yOffset}px`,
            transition: `${duration}ms`,
            transform: 'scale(1.2, 1.2)'
        });
        setTimeout(() => {
            Object.assign(element.style, {
                position: 'relative',
                left: `0`,
                top: `0`,
                transition: `0`,
                transform: 'scale(1, 1)'
            });
        }, duration);
    }

    handleDayElement(element, date) {
        element.innerHTML = date.getDate();
        if (date.getMonth() != this.month.getMonth()) {
            element.classList.add('other-month');
        } else {
            this.randomFlyIn(element);
        }
    }
    
    handleDayClick(element, date) {
        
    }

    nextMonth(amount = 1) {
        this.month = new Date(this.month.getFullYear(), this.month.getMonth() + amount + 1, 0);
    }

    previousMonth() {
        this.nextMonth(-1);
    }

    render() {
        const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
        const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

        const startOfMonth = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
        const startOffset = startOfMonth.getDay();
        let currentDate = new Date(this.month.getFullYear(), this.month.getMonth(), 1 - startOffset);

        console.log([
            currentDate,
            this.month
        ].map(item => item.toString()).join('\n'))

        // generate weeks (within this month and weeks and adjacents to fill all columns)
        let weeks = [];
        let week = null;
        while (currentDate.getTime() <= this.month.getTime() ||
               week && week.length < 7) {
            if (!week || week.length >= 7) {
                week = [];
                weeks.push(week);
            }
            week.push(currentDate);
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        }

        console.log(weeks);

        // Clear
        this.element.innerHTML = '';

        const title = `${months[this.month.getMonth()]} ${this.month.getFullYear()}`;

        // Header
        const header = `<tr>${
            weekDays.map(day => `<th>${day}</th>`).join('\n')
        }</tr>`;

        // Rows / Weeks
        const rows = weeks.map(week => {
            const row = week.map(date => `
                <td data-date="${date}" class="day">
                    <div class="day-content">
                    </div>
                </td>`
            ).join('\n');
            return `<tr class="week">${row}</tr>`
        }).join('\n');

        // output
        this.element.innerHTML = `
        <div class="calender-header">
            <button class="button-left">&lt;</button>
            <span class="month-name">
            ${title}
            </span>
            <button class="button-right">&gt;</button>
        </div>

        <table>
        ${header}
        ${rows}
        </table>`;

        // iterate and make some click events
        const days = Array.from(this.element.querySelectorAll('.day'));
        days.forEach(element => {
            const date = new Date(element.dataset.date);
            const content = element.querySelector('.day-content');
            this.handleDayElement(content, date);

            element.addEventListener('click', () => {
                this.handleDayClick(content, date);
            })
        });

        // handle clicks for left and right buttons
        this.element.querySelector('.calender-header .button-left').addEventListener('click', () => {
            this.previousMonth();
            this.render();
        });

        this.element.querySelector('.calender-header .button-right').addEventListener('click', () => {
            this.nextMonth();
            this.render();
        })
    }
}


class DatePicker extends Calendar{
    constructor(month, available, picked = {}) {
        super(month);
        this.available = available;
        this.picked = picked;
    }

    standarizeDate(date) {
        return `${date.getUTCMonth()}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
    }

    handleDayElement(element, date) {
        super.handleDayElement(element, date);

        if (element.classList.contains('other-month')) {
            return;
        }

        if (!this.available ||
            this.available.map(this.standarizeDate)
                          .includes(this.standarizeDate(date))) {
            element.classList.add('available');
        }
        if (this.picked[this.standarizeDate(date)]) {
            element.classList.add('picked');
        }
    }
    
    handleDayClick(element, date) {
        if (element.classList.contains('other-month')
        ||  element.classList.contains('not-available')) {
            return;
        }
        element.classList.toggle('picked');
        this.picked[date] = element.classList.contains('picked');
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
    
    handleDayClick(element, date) {
        console.log(this.picked);
        if (!this.picked[day]) {
            this.picked[day] = 0;
        }
        this.picked[day] += 1;
        element.innerHTML = this.handleDayElement(element, date);
    }
}

window.addEventListener('load' , () => {
    const calendarElement = document.getElementById('calendar');
    const topicElement = document.getElementById('topic');

    const picker = new DatePicker(new Date(), [new Date('3/10/2020')]);
    // const picker = new DatePicker(new Date());
    calendarElement.appendChild(picker.element);
    picker.render();

    topicElement.innerHTML = "Wann machen wir das jetzt?";
})