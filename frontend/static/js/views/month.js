import AbstractView from './abstract-view.js';
import error from '../errors.js'

export default class extends AbstractView {
    constructor(params) {
        super();
        this.htmlPath = '/static/html/month.html';
        this.stylePath = '/static/css/month.css';
        this.month = params.month;
    }

    async show() {
        const resp = await fetch(this.htmlPath);
        if (!resp.ok) {
            throw new error.RequestError(resp.status);
        }
        this.root.innerHTML = await resp.text();
        this.style = this.stylePath;
        await this.setup();
    }

    async setup() {
        // @todo: 获取当月的总览
        const resp = await fetch('/api/ledger/item/month/' + this.month);
        if (!resp.ok) {
            throw new error.RequestError(resp.status);
        }
        const data = await resp.json();
        if (data.code !== 0) {
            throw new error.ApiError(data.code, data.msg);
        }
        const listBody = document.getElementById('ledger-month-list-body');
        for (let item of data.data) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.eventTime}</td><td>${item.type}</td><td>${item.category}</td><td>${item.amount}</td>`
            listBody.appendChild(row);
        }
        // @todo: 需要正则路由支持
    }
}