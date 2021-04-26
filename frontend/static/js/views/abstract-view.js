export default class {
    constructor() {
        this.root = document.getElementById('app');
    }

    set style(path) {
        const styleNodeId = 'view-style';
        let style = document.getElementById(styleNodeId);
        if (!style) {
            style = document.createElement('link');
            style.id = styleNodeId;
            style.type = 'text/css';
            style.rel = 'stylesheet';
            document.head.appendChild(style);
        }
        style.href = path;
    }
}