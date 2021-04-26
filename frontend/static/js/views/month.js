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
        this.root.innerHTML = await this.getHtml(this.htmlPath)
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

        const categoryResp = await fetch('/api/category');
        if (!categoryResp.ok) {
            throw new error.RequestError(resp.status);
        }
        const category = Object.fromEntries((await categoryResp.json()).data.map(c => {
            return [c.id, c.name]
        }));

        const listBody = document.getElementById('ledger-month-list-body');
        for (let item of data.data) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${new Date(item.eventTime).toLocaleString()}</td><td>${item.type}</td><td>${category[item.category]}</td><td>${item.amount}</td>`
            listBody.appendChild(row);
        }
    }
}