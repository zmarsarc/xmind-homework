import AbstractDialog from './abstract-dialog.js';
import DateTimePicker from '../components/date-time-picker.js';

export default class extends AbstractDialog {
    constructor() {
        super();
        this.htmlPath = '/static/html/addone.html';
        this.stylePath = '/static/css/addone.css';

        this.dateTimePicker = new DateTimePicker();
    }

    async show() {
        this.root.innerHTML = await this.getHtml(this.htmlPath);
        this.style = this.stylePath;
        await this.setup();
    }

    async setup() {
        await this.dateTimePicker.install('datepicker');

        document.getElementById('close-add-item-dialog-button').addEventListener('click', function() {
            document.getElementById('dialog').innerHTML = '';
            document.getElementById('dialog-style').remove();
        })

        document.getElementById('ok-button').addEventListener('click', function() {
            const input = document.querySelector('input[name="input"]:checked').value;
            const type = document.getElementById('type-selector').value;
            const item = {
                time: Date.parse(document.getElementById('ledger-item-time').value) / 1000,
                input: Number(input),
                type: type,
                amount: document.getElementById('amount').value
            }

            fetch('/api/ledger/item', {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(resp.statusText);
                }
                return resp.json();
            })
            .then(data => {
                if (data.code !== 0) {
                    throw new Error(data.msg);
                }
                alert('add ok');
                document.getElementById('dialog').innerHTML = '';
                document.getElementById('dialog-style').remove();
            })
            .catch(err => {
                alert(err.message);
            })
        })
    }
}