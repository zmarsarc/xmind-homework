export default class {
    constructor() {}

    async getHtml() {
        return ''
    }

    stylePath() {
        return ''
    }

    setupLogic() {}

    async requestHtml(url) {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error(`request ${url} not ok`);
        }
        return resp.text();
    }
}