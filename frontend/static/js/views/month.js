export default class {
    constructor() {}

    async getHtml() {
        const htmlPath = "/static/html/month.html";
        const resp = await fetch(htmlPath);
        if (!resp.ok) {
            return "<main>there are some error when loading month view.</main>"
        }
        return resp.text();
    }

    stylePath() {
        return "/static/css/month.css";
    }

    setupLogic() {
        
    }
}