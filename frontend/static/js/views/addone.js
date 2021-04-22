import AbstractView from './abstract-view.js';

export default class extends AbstractView {
    constructor() {
        super();
    }

    getHtml() {
        const url = '/static/html/addone.html';
        return this.requestHtml(url);
    }

    stylePath() {
        return '/static/css/addone.css';
    }

    setupLogic() {
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