const koaRouter = require('koa-router');
const ledger = require('./controller/ledger.js');
const file = require('./model/file.js');
const body = require('koa-body');

const fileBackend = new file('./data');

const apiRouter = new koaRouter();

// 全部使用admin身份，暂时不需要登录实际的账号
apiRouter.use(async(ctx, next) => {
    ctx.user = {
        id: 1,
        name: 'admin'
    };
    await next();
})

apiRouter.use(body());

// api接口默认返回的是json数据
apiRouter.use(async(ctx, next) => {
    ctx.type = 'json';
    await next();
})

apiRouter.prefix('/api');
apiRouter.post('/ledger/item', ledger.addItem(fileBackend.saveItem));

module.exports = apiRouter;