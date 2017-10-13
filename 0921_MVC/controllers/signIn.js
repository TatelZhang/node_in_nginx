'use strict'

var signin = async (ctx, next)=>{
    var email = ctx.request.body.email || '',
        passwd = ctx.request.body.password || '';
    if(email==='admin@example.com'&&passwd === '123456'){
        ctx.render('signin-ok.html',{
            title:'Sign In OK',
            name: 'Tatel'
        });
    }else{
        // 使用中间件的render 方法;
        ctx.render('signin-failed.html',{
            title: 'Losed!'
        });
    }
};

module.exports = {
    'POST /signin': signin
}