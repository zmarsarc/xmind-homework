import errors from "../errors.js";

export default class {
    constructor() {

    }

    async getHtml(url) {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new errors.RequestError(resp.status);
        }
        return resp.text();
    }

    async install(parent) {}
}