import Dashbroad from './views/dashbroad.js'
import Month from './views/month.js'
import AddOne from './views/addone.js'

const routers = [
    {path: "/dashbroad", view: Dashbroad},
    {path: "/month", view: Month}
]

async function route() {
    const protentialMatches = routers.map(r => {
        return {
            router: r,
            isMatch: r.path === location.pathname
        }
    })

    let matched = protentialMatches.find(r => r.isMatch)
    if (!matched) {
        matched = {
            router: routers[0],
            isMatch: true
        }
    }

    const view = new matched.router.view();

    // 加载视图
    const html = await view.getHtml();
    document.getElementById('app').innerHTML = html;

    // 装载样式
    let style = document.getElementById('current-view-style');
    if (!style) {
        style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.id = 'current-view-style';
        document.head.appendChild(style);
    }
    style.href = view.stylePath();

    // 绑定交互逻辑
    view.setupLogic();
}

function navigateTo(url) {
    history.pushState(null, null, url);
    route();
}

window.addEventListener("popstate", route);

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('add-one-button').addEventListener('click', function() {
        const view = new AddOne();
        view.getHtml().then(text => {
            document.getElementById('dialog').innerHTML = text;
            const style = document.createElement('link');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            style.href = view.stylePath();
            style.id = 'dialog-style';
            document.head.appendChild(style);
            view.setupLogic();
        })
        .catch(err => {
            alert(err.message);
        })
    })


    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    })

    route();
})