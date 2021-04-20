const koa = require('koa');
const koaRouter = require('koa-router');
const ledger = require('./ledger.js');
const sinon = require('sinon');
const request = require('supertest');
const expect = require('chai').expect;
const resp = require('./response.js');

describe('test save ledger item', function() {
    const servers = []
    const testServer = (router) => {
        const app = new koa();
        require('koa-validate')(app);
        app.context.logger = require('log4js').getLogger();
        app.use(require('koa-body')());
        app.use(router);
        
        const server = app.listen();
        servers.push(server);
        return server;
    }

    const login = async(ctx, next) => {
        ctx.user = {id: 1, name: 'admin'};
        await next();
    }

    after(function() {
        for (let s of servers) {
            s.close();
        }
    })

    it('should login before save ledger item', function(done) {
        const backend = sinon.fake();
        const router = new koaRouter();
        router.post('/ledger/item', ledger.addItem(backend));

        request(testServer(router.routes())).post('/ledger/item').expect(200).then(res => {
            expect(res.body.code).to.equal(resp.noAuth.code);
            expect(backend.notCalled).to.be.true;
            done();
        })
        .catch(done);
    })

    it('should check params before call backend', function(done) {
        const backend = sinon.fake();
        const router = new koaRouter();
        router.use(login);
        router.post('/ledger/item', ledger.addItem(backend));

        request(testServer(router.routes())).post('/ledger/item').then(res => {
            expect(res.body.code).to.equal(resp.invalidParams.code);
            expect(backend.notCalled).to.be.true;
            done();
        })
        .catch(done);
    })

    it('call backend with user id and item', function(done) {
        const backend = sinon.fake.resolves();
        const router = new koaRouter();
        router.use(login);
        router.post('/ledger/item', ledger.addItem(backend));
        const requestData = {time: Date.now(), input: 0, type: '123456abcdef', amount: 100.00};
        request(testServer(router.routes())).post('/ledger/item')
        .send(requestData)
        .then(res => {
            expect(res.body.code).to.equal(resp.ok.code);
            expect(backend.calledOnce).to.be.true;
            expect(backend.firstCall.firstArg).to.equal(1);
            expect(backend.firstCall.lastArg).to.deep.equal(requestData);
            done();
        })
        .catch(done);
    })
})