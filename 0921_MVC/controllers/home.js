'use strict'

var home = async (ctx, next)=>{
    ctx.render('index.html',{
        title: 'Welcome'
    })
};

module.exports = {
    'GET /': home
};