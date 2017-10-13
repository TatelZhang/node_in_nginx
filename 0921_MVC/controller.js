'user strict'
/**
 * 中间件：用于批量处理 controllers 中的路由;
 */

const path = require('path');
const fs = require('fs');

// 获取路径中的js文件
function get_js(ctr_path){
    var abs_path = path.join(__dirname, ctr_path);
    var files = fs.readdirSync(abs_path);
    files.filter((f)=>{
        return f.endsWith('.js');
    });

    return files;
}

//导入js文件中的模块，并添加到router中
function addRouter(router, ctr_path){
    var files = get_js(ctr_path);
    for(var jsfile of files){
        var jsfile = require('.' + ctr_path + jsfile);
        for(var url_path in jsfile){
            if(url_path.startsWith('GET')){
                var real_url = url_path.substring(4);
                router.get(real_url, jsfile[url_path]);
            }else if(url_path.startsWith('POST')){
                var real_url = url_path.substring(5);
                router.post(real_url, jsfile[url_path]);
            }else{
                console.log(`wrong path:${url_path} at ${jsfile}`)
            }
        }
    }
    
}




module.exports = function(ctr_path){
    var router = require('koa-router')(),
    ctr_path = ctr_path || '/controllers/';
    // 封装 ctr_path 中的路由到 router 当中并返回
    addRouter(router, ctr_path);

    return router.routes();
}

// module.exports();
// addRouter('', '/controllers/')