import MonthItem from '../components/month-item-list.js';
import AbstractView from './abstract-view.js';

export default class extends AbstractView {
    constructor(params) {
        super();
        this.items = new MonthItem(params);
    }

    async show() {
        this.root.innerHTML = await this.getHtml('/static/html/month.html');
        await this.items.install('month-list');
    }
    
    async update() {
        this.items.update();
    }
}