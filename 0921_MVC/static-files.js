'use strict'

/**
 * 中间件：用于处理静态文件请求; 请求/static/ 并将 源文件地址为 dir + request.path.substring(url.length)  {url 为'/static/' 视图中指定的路径}
 * 
 */

const path = require('path');
const mime = require('mime');
const fs = require('mz/fs')

/**
 * 
 * @param {*需要调用的静态文件的路径：'/static/'} url 
 * @param {*static文件存放的实际路径绝对路径：__dirname + '/static'} dir 
 */
function staticFiles(url, dir){
    return async (ctx, next)=>{
        //静态文件请求路径
        let rpath = ctx.request.path;
        
        console.log(`静态文件请求：${rpath}  url:${ctx.request.url}`)
        //判断 rpath 是否以 /static/ 开头，如果是就是为静态资源请求
        if(rpath.startsWith(url)){
            // 去除/static/ 头，组合请求的绝对路径
            let fp = path.join(dir, rpath.substring(url.length));
            console.log(`startsWith('url') ${fp}`)
            if(await fs.exists(fp)){
                ctx.response.type = mime.lookup(rpath);
                ctx.response.body = await fs.readFile(fp);
            }else{
                console.log(`didn't found static: ${fp}`)
                ctx.response.status = 404;
            }
        }else{
            console.log(`无静态文件请求`)
            await next();
        }
    };
}

module.exports = staticFiles;