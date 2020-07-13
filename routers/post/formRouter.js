const express = require('express');
const sha1 = require('sha1');

const query = require('../../db/connect');

const formRouter = new express.Router();

/************************ post ***********************/
let logged = false;
formRouter.post('/login', async (request, response) => {
    logged = false;
    let uName = request.body['user_name'];
    let uPwd = request.body['user_pwd'];
    let userInfo = {
        "userName": uName,
        "userPassword": uPwd
    };
    // if (!(/^[a-zA-Z][a-zA-Z0-9_]{5,20}$/.test(uName))) {
    //     logged = false;    // 用户名不存在
    // } else if (!(/^[a-zA-Z0-9_]{6,20}$/.test(uPwd))) {
    //     logged = false;    // 密码错误
    // };
    let findName = await query('select * from user where name = ?', [userInfo.userName]);
    if (findName.length > 0) {
        let findPwd = await query('select * from user where password = ? && name = ?',[userInfo.userPassword,findName[0].name]);
        if (findPwd.length > 0){
            logged = true;
        }
    }   
    response.send(logged ? { "success": '登录成功' } : { "error": '用户名或密码错误' });
});

// promiseConnect.then(async result => {
//     console.log(result);

//     formRouter.post('/register', async (request, response) => {
//         const {
//             user_name: uName,
//             user_pwd: uPwd,
//             user_repeat_pwd: urePwd,
//             user_email: uEmail,
//         } = request.body;    /**** 解构赋值 ****/

//         userInfo = {
//             "userName": uName,
//             "userPassword": uPwd,
//             "userEmail": uEmail
//         };

//         let errInfo = {};

//         if (urePwd !== uPwd) {
//             errInfo.repeatPassword = '两次输入不一致';
//         };
//         if (!(/^[a-zA-Z][a-zA-Z0-9_]{5,20}$/.test(uName))) {
//             errInfo.name = '用户名不合法';
//         };
//         if (!(/^[a-zA-Z0-9_]{6,20}$/.test(uPwd))) {
//             errInfo.password = '密码不合法';
//         };
//         if (!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(uEmail))) {
//             errInfo.email = '邮箱不合法';
//         };

//         const badEmail = await userInfoModel.findOne({ "userEmail": uEmail });
//         if (badEmail) {
//             errInfo.emailRegistered = '邮箱已被注册';
//         };

//         if (errInfo.repeatPassword || errInfo.name || errInfo.password || errInfo.email) {
//             response.send(errInfo);
//             return;
//         };

//         const fond = await userInfoModel.findOne({ "userName": uName });
//         if (fond) {
//             response.send({ "error": '用户名已被注册' });
//         } else {
//             userInfo.userPassword = sha1(userInfo.userPassword);
//             await userInfoModel.create(userInfo);
//             response.redirect('/login');    // http://localhost:3000/login
//         };
//     });

// }).catch(err => console.log(err));

module.exports = formRouter;