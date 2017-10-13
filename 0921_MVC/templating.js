'use strict'

/**
 * 中间件：用于将env.render 封装到 async当中;
 */

const nunjucks = require('nunjucks');

function createEnv(path, opts){
    var autoescape = opts.autoescape === undefined ? true : opts.autoescape,
        noCahe = opts.noCahe || true,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path || 'views',{
                noCache: noCahe,
                watch: watch
            }),{
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            }
        );
    if(opts.filters){
        for(var f in opts.filters){
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}


//创建 ctx.render 
function templating(path, opts){
    // 创建模板渲染环境 /views/
    var env =createEnv(path, opts);
    //返回封装好的异步回调函数
    return async (ctx, next)=>{
        //编写 ctx.render(view, model)
        ctx.render = function(view ,model){
            ctx.response.body = env.render(view, Object.assign({},ctx.state ||{}, model ||{}));
            ctx.response.type = 'text/html';
        }
        await next();
    }
}


module.exports = templating;