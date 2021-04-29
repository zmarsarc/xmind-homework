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
        let items, categories;
        [items, categories] = await Promise.all([this.getLedgerList(), this.getCategories()]);
        this.insertItemIntoTable(items, categories);
    }

    async update() {
        let items, categories;
        [items, categories] = await Promise.all([this.getLedgerList(), this.getCategories()]);
        document.getElementById('ledger-month-list-body').innerHTML = '';
        this.insertItemIntoTable(items, categories);
    }

    async getLedgerList() {
        const resp = await fetch('/api/ledger/item/month/' + this.month);
        if (!resp.ok) {
            throw new error.RequestError(resp.status);
        }
        const json = await resp.json();
        if (json.code !== 0) {
            throw new error.ApiError(json.code, json.msg);
        }
        return json.data;
    }

    async getCategories() {
        const resp = await fetch('/api/category');
        if (!resp.ok) {
            throw new error.RequestError(resp.status);
        }
        const json = await resp.json();
        if (json.code !== 0) {
            throw new error.ApiError(json.code, json.msg);
        }
        return Object.fromEntries(json.data.map(c => {
            return [c.id, c.name]
        }));
    }

    insertItemIntoTable(items, categories) {
        const typeName = {
            0: '支出',
            1: '收入'
        }
        const listBody = document.getElementById('ledger-month-list-body');
        for (let i of items) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${new Date(i.eventTime).toLocaleString()}</td><td>${typeName[i.type]}</td><td>${categories[i.category]}</td><td>${i.amount}</td>`
            listBody.appendChild(row);
        }
    }
}