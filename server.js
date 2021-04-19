const koa = require('koa');
const serve = require('koa-static')
const mount = require('koa-mount')
const fs = require('fs')

const app = new koa();

app.use(async(ctx, next) => {
    await next();
    if (ctx.body === undefined) {
        ctx.type = 'html'
        ctx.body = fs.createReadStream('./frontend/index.html');
    }
})
app.use(mount('/static', serve('./frontend/static')))

app.listen(8000, "127.0.0.1")