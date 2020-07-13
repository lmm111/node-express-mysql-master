const express = require('express');
const app = express();

const indexRouter = require('./routers/get/indexRouter.js');
const formRouter = require('./routers/post/formRouter.js');

/*********************** 中间件 **********************/
// 暴露路由 login.html register.html
app.use(express.static(__dirname + '/templates'));    // 默认调用 next();

// 将 用户输入的数据 挂载到 请求体 request.body  上
app.use(express.urlencoded({ extended: true }));    // 默认调用 next();

app.use(indexRouter);
app.use(formRouter);

/**************** 端口号 3000, 启动服务器 ***************/
app.listen(3000, err => console.log(err ? err : '\n\n服务器已启动: http://localhost:3000\nHunting Happy!'));