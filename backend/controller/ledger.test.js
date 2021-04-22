const koa = require('koa');
const koaRouter = require('koa-router');
const ledger = require('./ledger.js');
const sinon = require('sinon');
const request = require('supertest');
const expect = require('chai').expect;
const resp = require('./response.js');

class TestServerMaker {
    constructor() {
        this.servers = []
    }

    new(router) {
        const app = new koa();
        require('koa-validate')(app);
        app.context.logger = require('log4js').getLogger();
        app.use(require('koa-body')());
        app.use(router);
        
        const server = app.listen();
        this.servers.push(server);
        return server;
    }

    closeAll() {
        for (let s of this.servers) {
            s.close();
        }
    }
}

function fakeLogin(userid, username) {
    return async(ctx, next) => {
        ctx.user = {id: userid, name: username};
        await next();
    }
}

describe('test save ledger item', function() {
    const testServer = new TestServerMaker();
    const fakeUserId = 1
    const fakeUserName = 'admin';
    const apiPath = '/ledger/item';

    after(() => { testServer.closeAll() })

    const prepareRouter = (middleware) => {
        const backend = sinon.fake();
        const router = new koaRouter();
        if (middleware) {
            router.use(middleware);
        }
        router.post(apiPath, ledger.addItem(backend));

        return {backend: backend, router: router};
    }

    it('should login before save ledger item', function(done) {
        const env = prepareRouter();

        request(testServer.new(env.router.routes())).post(apiPath).expect(200).then(res => {
            expect(res.body.code).to.equal(resp.noAuth.code);
            expect(env.backend.notCalled).to.be.true;
            done();
        })
        .catch(done);
    })

    it('should check params before call backend', function(done) {
        const env = prepareRouter(fakeLogin(fakeUserId, fakeUserName));

        request(testServer.new(env.router.routes())).post(apiPath).then(res => {
            expect(res.body.code).to.equal(resp.invalidParams.code);
            expect(env.backend.notCalled).to.be.true;
            done();
        })
        .catch(done);
    })

    it('call backend with user id and item', function(done) {
        const env = prepareRouter(fakeLogin(fakeUserId, fakeUserName));

        const requestData = {time: Date.now(), input: 0, type: '123456abcdef', amount: 100.00};
        request(testServer.new(env.router.routes())).post(apiPath)
        .send(requestData)
        .then(res => {
            expect(res.body.code).to.equal(resp.ok.code);
            expect(env.backend.calledOnce).to.be.true;
            expect(env.backend.firstCall.firstArg).to.equal(1);
            expect(env.backend.firstCall.lastArg).to.deep.equal(requestData);
            done();
        })
        .catch(done);
    })
})

describe('test get ledger item by month', function() {
    const serverMaker = new TestServerMaker();
    const fakeUserId = 1;
    const fakeUserName = 'admin';
    const apiPath = '/ledger/item/month/:month';
    const testData = {name: 'abc'};

    after(() => { serverMaker.closeAll(); })

    const prepareRouter = (middleware) => {
        const backend = sinon.fake.resolves(testData);
        const router = new koaRouter();
        if (middleware) {
            router.use(middleware);
        }
        router.get(apiPath, ledger.getItemsInMonth(backend));

        return {backendStub: backend, router: router};
    }

    it('need login', function(done) {
        const testEnv = prepareRouter();

        request(serverMaker.new(testEnv.router.routes())).get('/ledger/item/month/3')
        .then(res => {
            expect(res.body.code).to.equal(resp.noAuth.code);
            done();
        })
        .catch(done)
    })

    it('should not match url', function(done) {
        const testEnv = prepareRouter(fakeLogin(fakeUserId, fakeUserName));
        
        request(serverMaker.new(testEnv.router.routes()))
        .get('/ledger/item/month')
        .expect(404, done);
    })

    it('should check url params', function(done) {
        const env = prepareRouter(fakeLogin(fakeUserId, fakeUserName));
        request(serverMaker.new(env.router.routes()))
        .get('/ledger/item/month/abc')
        .then(res => {
            expect(res.body.code).to.equal(resp.invalidParams.code);
            done();
        })
        .catch(done);
    })

    it('if ok, should call backend to get item', function(done) {
        const env = prepareRouter(fakeLogin(fakeUserId, fakeUserName));
        request(serverMaker.new(env.router.routes()))
        .get('/ledger/item/month/3')
        .then(res => {
            expect(res.body.code).to.equal(resp.ok.code);
            expect(res.body.data).to.deep.equal(testData);
            expect(env.backendStub.calledOnce).to.be.true;
            expect(env.backendStub.firstCall.firstArg).to.equal(fakeUserId);
            expect(env.backendStub.firstCall.lastArg).to.equal(3);
            done();
        })
        .catch(done);
    })
})