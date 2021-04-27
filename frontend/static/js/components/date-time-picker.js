// a great thanks to https://www.youtube.com/watch?v=wY2dao1hJms and https://www.youtube.com/watch?v=Vt1K8EZ2Aag
// 我将这两个组件结合在了一起并将逻辑封装到一个类中
import error from "../errors.js";

export default class {
    constructor() {
        this.htmlPath = '/static/html/datepicker.html';
        this.currentDate = new Date();
    }

    async install(parent) {
        const resp = await fetch(this.htmlPath);
        if (!resp.ok) {
            throw new error.RequestError(resp.status);
        }
        document.getElementById(parent).innerHTML = await resp.text();

        this.setup();
        this.updateDateTime(this.currentDate);
    }

    setup() {
        this.datePickerElement = document.querySelector('.date-time-picker');
        this.selectDateElement = document.querySelector('.date-time-picker .selected-date');
        this.datesTimeElement = document.querySelector('.date-time-picker .date-time');
        this.daysElement = document.querySelector('.date-time-picker .dates .days');
        this.hourElement = document.querySelector('.date-time-picker .date-time .time .hour .hr');
        this.minuteElement = document.querySelector('.date-time-picker .date-time .time .minute .min');

        this.selectDateElement.addEventListener('click', e => this.toggleDatePicker(e));
        document.querySelector('.date-time-picker .dates .month .arrows.next-mth').addEventListener('click', () => this.switchToNextMonth());
        document.querySelector('.date-time-picker .dates .month .arrows.prev-mth').addEventListener('click', () => this.switchToPrevMonth());
        document.querySelector('.date-time-picker .dates .days').addEventListener('click', e => this.selectDay(e));
        document.querySelector('.date-time-picker .date-time .time .hour .hr-up').addEventListener('click', (e) => this.setHour(e));
        document.querySelector('.date-time-picker .date-time .time .hour .hr-down').addEventListener('click', (e) => this.setHour(e));
        document.querySelector('.date-time-picker .date-time .time .minute .min-up').addEventListener('click', (e) => this.setMinute(e));
        document.querySelector('.date-time-picker .date-time .time .minute .min-down').addEventListener('click', (e) => this.setMinute(e));
        this.hourElement.addEventListener('input', e => this.changeHour(e));
        this.minuteElement.addEventListener('input', e => this.changeMinute(e));
    }

    toggleDatePicker() {
        this.datesTimeElement.classList.toggle('active');
        this.updateDateTime(this.currentDate);
    }

    updateDateTime(date) {
        const padTo2 = num => {
            return String(num).padStart(2, "0");
        };

        this.currentDate = date;
        this.selectDateElement.innerHTML = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${padTo2(date.getHours())}:${padTo2(date.getMinutes())}`;

        document.querySelector('.date-time-picker .dates .month .mth').innerHTML = `${date.getFullYear()}-${date.getMonth() + 1}`;

        this.daysElement.innerHTML = '';
        for (let i = 0; i < this.daysInMonth(date.getFullYear(), date.getMonth()); i++) {
            const d = document.createElement('div');
            d.classList.add('day');
            d.innerHTML = i + 1;
            this.daysElement.appendChild(d);
        }

        this.hourElement.value = padTo2(date.getHours());
        this.minuteElement.value = padTo2(date.getMinutes());

        this.datePickerElement.dispatchEvent(new CustomEvent('update', {detail: {date: this.currentDate}}));
    }

    switchToNextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.updateDateTime(this.currentDate);
    }

    switchToPrevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.updateDateTime(this.currentDate);
    }

    daysInMonth(year, month) {
        const start = new Date().setFullYear(year, month);
        const end = new Date().setFullYear(year, month + 1);
        return Math.trunc((end - start) / (24 * 3600 * 1000));
    }

    selectDay(e) {
        if (!e.target.classList.contains('day')) {
            return;
        }
        const selected = Number(e.target.innerHTML);
        this.currentDate.setDate(selected);
        this.updateDateTime(this.currentDate);
    }

    setHour(e) {
        if (e.target.classList.contains('hr-up')) {
            this.currentDate.setHours(this.currentDate.getHours() + 1);
        }
        if (e.target.classList.contains('hr-down')) {
            this.currentDate.setHours(this.currentDate.getHours() - 1);
        }
        this.updateDateTime(this.currentDate);
    }

    setMinute(e) {
        if (e.target.classList.contains('min-up')) {
            this.currentDate.setMinutes(this.currentDate.getMinutes() + 1);
        }
        if (e.target.classList.contains('min-down')) {
            this.currentDate.setMinutes(this.currentDate.getMinutes() - 1);
        }
        this.updateDateTime(this.currentDate);
    }

    changeHour(e) {
        if (Number(e.target.value) >= 0 && Number(e.target.value <= 23)) {
            this.currentDate.setHours(e.target.value);
            this.updateDateTime(this.currentDate);
        } else {
            e.target.value = this.currentDate.getHours();
        }
    }

    changeMinute(e) {
        if (Number(e.target.value) >= 0 && Number(e.target.value <= 59)) {
            this.currentDate.setMinutes(e.target.value);
            this.updateDateTime(this.currentDate);
        } else {
            e.target.value = this.currentDate.getMinutes();
        }
    }

    get value() {
        return this.currentDate;
    }
}