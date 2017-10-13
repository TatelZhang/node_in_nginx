'use strict'

const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const isProduction = process.env.NODE_ENV === 'production';
const templating = require('./templating');

var controller = require('./controller');

// 创建服务端 app
var app = new koa();

// 创建程序入口
app.use(async (ctx, next)=>{
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var start = new Date().getTime(),
        execTime;
    await next();//继续执行下一步;待下一步都执行完成后，在执行后续代码
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}`);
});


// 判断是为生产环境，如果不是则。。。
if(!isProduction){
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static/'));
}
//app.use(staticFiles('/static/', __dirname+'/static'));


// 使用koa-bodyparser解析request请求中的字段;
app.use(bodyParser());

// 使用模板渲染，模板文件在 views
app.use(templating('views', {
    noCahce: !isProduction,
    watch: !isProduction
}));

// 导入路由中间件
app.use(controller());

// 出现问题不会报错，404 界面
app.use(async (ctx, next)=>{
    ctx.response.status = 404;
    ctx.response.body = `something wrong`;
    
});


// 开始监听
app.listen(8080);
console.log('process start http://127.0.0.1:8080')