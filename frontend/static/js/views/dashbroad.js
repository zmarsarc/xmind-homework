export default class {
    constructor() {}

    async getHtml() {
        const htmlPath = "/static/html/dashbroad.html";
        const resp = await fetch(htmlPath);
        if (!resp.ok) {
            return "<main>there are some error when get html.</main>";
        }
        return resp.text();
    }
    
    stylePath() {
        return "/static/css/dashbroad.css"
    }

    setupLogic() {
        console.log("setup logic")
    }
}