import AbstraceComponent from './abstract-component.js';
import error from '../errors.js';

export default class extends AbstraceComponent {
    constructor(params) {
        super();
        this.htmlPath = '/static/html/monthitem.html';
        this.month = params.month;
    }

    async install(parent) {
        document.getElementById(parent).innerHTML = await this.getHtml(this.htmlPath)
        await this.setup();
    }

    async setup() {
        let items, categories, overview;
        [items, categories, overview] = await Promise.all([this.getLedgerList(), this.getCategories(), this.getOverview()]);
        this.updateOverview(overview);
        this.insertItemIntoTable(items, categories);
    }

    async update() {
        let items, categories, overview;
        [items, categories, overview] = await Promise.all([this.getLedgerList(), this.getCategories(), this.getOverview()]);
        document.getElementById('ledger-month-list-body').innerHTML = '';
        this.updateOverview(overview);
        this.insertItemIntoTable(items, categories);
    }

    async sendGetRequest(url) {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new error.RequestError(resp.status);
        }
        const json = await resp.json();
        if (json.code !== 0) {
            throw new error.ApiError(json.code, json.msg);
        }
        return json;
    }

    async getOverview() {
        const json = await this.sendGetRequest('/api/overview/month/' + this.month)
        return json.data;
    }

    async getLedgerList() {
        const json = await this.sendGetRequest('/api/ledger/item/month/' + this.month)
        return json.data;
    }

    async getCategories() {
        const json = await this.sendGetRequest('/api/category')
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

    updateOverview(overview) {
        document.getElementById('month-input-value').innerText = overview.input;
        document.getElementById('month-output-value').innerText = overview.output;
    }
}