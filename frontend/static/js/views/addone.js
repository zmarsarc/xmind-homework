import AbstractDialog from './abstract-dialog.js';
import DateTimePicker from '../components/date-time-picker.js';
import CategorySelector from '../components/category-selector.js';
import errors from '../errors.js';

export default class extends AbstractDialog {
    constructor() {
        super();
        this.htmlPath = '/static/html/addone.html';
        this.stylePath = '/static/css/addone.css';

        this.dateTimePicker = new DateTimePicker();
        this.categorySelector = new CategorySelector();
    }

    async show() {
        this.root.innerHTML = await this.getHtml(this.htmlPath);
        this.style = this.stylePath;
        await this.setup();
    }

    async setup() {
        this.amountElement = document.getElementById('amount');

        await this.dateTimePicker.install('datepicker');
        await this.categorySelector.install('categoryselector');

        document.getElementById('close-add-item-dialog-button').addEventListener('click', () => this.close());
        document.getElementById('ok-button').addEventListener('click', () => this.addLedgerItem());
    }

    close() {
        document.getElementById('dialog').innerHTML = '';
        document.getElementById('dialog-style').remove();
    }

    addLedgerItem() {
        const time = this.dateTimePicker.value;
        const category = this.categorySelector.category;
        const amount = this.amountElement.value;
        const body = {
            time: time.getTime(),
            input: category.type,
            type: category.category,
            amount: amount
        }

        fetch('/api/ledger/item', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(resp => {
            if (!resp.ok) {
                throw new errors.RequestError(resp.status);
            }
            return resp.json();
        })
        .then(json => {
            if (json.code !== 0) {
                throw new errors.ApiError(json.code, json.msg);
            }
        })
        .then(() => {
            this.sendAddEvent({ok: true});
        })
        .catch(e => {
            this.sendAddEvent({ok: false, msg: e.message});
        })
        .then(() => this.close())
    }

    sendAddEvent(detail) {
        document.getElementById('dialog').dispatchEvent(new CustomEvent('add', {detail: detail}));
    }
}