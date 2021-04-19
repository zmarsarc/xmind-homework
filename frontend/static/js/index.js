const routers = [
    {path: "/dashbroad", view: () => console.log("view dashbroad")},
    {path: "/month", view: () => console.log('view month')}
]

function route() {
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
    
    const view = matched.router.view;
    view();
}

function navigateTo(url) {
    history.pushState(null, null, url);
    route();
}

window.addEventListener("popstate", route);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    })

    route();
})