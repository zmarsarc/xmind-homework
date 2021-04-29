import AbstraceView from './abstract-view.js';

export default class extends AbstraceView{
    constructor() {
        super();
        this.htmlPath = "/static/html/dashbroad.html";
        this.stylePath = "/static/css/dashbroad.css";
    }

    async show() {
        this.root.innerHTML = await this.getHtml(this.htmlPath);
        this.style = this.stylePath;
    }
}