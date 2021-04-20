const resp = require('./response.js');

module.exports = {
    // 添加账目中间件
    //
    // saveItem是具有async function(userid, item)签名的函数
    // 其中item结构如 {time: [number], input: [number], type: [string], amount: [number]}
    // userid是用户的id
    addItem: (saveItem) => {

        // 添加一条账目
        // 
        // router: [post] /api/ledger/item
        //
        // param: [json] {time: 123123123, input: 0, type: "12348abcd", amount: 100.00}
        //      time [number]: 账目时间，unix时间
        //      input [number]: 入账？0代表出账，1代表入账
        //      type [string]: 类型，用户自定的分类，记录的是分类的uuid
        //      amount [number]: 金额
        //
        // response: [json] {code: 0, msg: "ok"}
        //      code [number]: 错误码，成功为0，否则非0
        //      msg [string]: 错误提示信息
        return async(ctx, next) => {
            if (!ctx.user) {
                ctx.logger.error('try add ledger item but no auth, need login.');
                ctx.body = resp.noAuth;
                return;
            }

            ctx.checkBody('time').notEmpty().isInt();
            ctx.checkBody('input').notEmpty().isInt().isIn([0, 1]);
            ctx.checkBody('type').notEmpty();
            ctx.checkBody('amount').notEmpty().isFloat();
            if (ctx.errors) {
                ctx.logger.error(`invalid params when add ledger item to user ${ctx.user.name}`);
                ctx.body = resp.invalidParams;
                return;
            }

            try {
                await saveItem(ctx.user.id, ctx.request.body);
                ctx.body = resp.ok;
                return;
            }
            catch (err) {
                ctx.logger.error(`save ledger item of user ${ctx.user.name}, error is ${err.message}`);
                ctx.body = resp.internalError;
                return;
            }
        }
    }
}