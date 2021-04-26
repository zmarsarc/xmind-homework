// 前端开发约定参看 /docs/前端开发约定.md

import Dashbroad from './views/dashbroad.js';
import Month from './views/month.js';
import AddOne from './views/addone.js';

const navigateTo = url => {
    history.pushState(null, null, url);
    route();
};

const relocatedTo = url => {
    history.replaceState(null, null, url);
    route();
};

const pathToRegexp = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.router.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const route = async() => {
    const routers = [
        {path: "/dashbroad", view: Dashbroad},
        {path: "/month/:month", view: Month},
        {path: "/month", view: function() {
            // fake view, just redirect to current month
            this.show = () => {
                const url = "/month/" + String(new Date().getMonth() + 1);
                relocatedTo(url);
            }
        }}
    ];
    
    const protentialMatches = routers.map(r => {
        return {
            router: r,
            result: location.pathname.match(pathToRegexp(r.path))
        }
    })

    let matched = protentialMatches.find(r => r.result !== null)
    if (!matched) {
        matched = {
            router: routers[0],
            result: []
        }
    }

    const view = new matched.router.view(getParams(matched));

    try {
        await view.show();
    }
    catch (err) {
        console.log(err.message); // @todo: error handle
    }
};

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
});