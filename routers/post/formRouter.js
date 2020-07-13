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
    let findPwd = null;
    if (findName.length > 0) {
        userInfo.userPassword = sha1(userInfo.userPassword);
        findPwd = await query('select * from user where password = ? && name = ?', [userInfo.userPassword, findName[0].name]);
        if (findPwd.length > 0) {
            logged = true;
        }
    }
    response.send(logged ? { "msg": '登录成功', data: findPwd ,code: 200 } : { "msg": '用户名或密码错误', code: 101 });
});

formRouter.post('/register', async (request, response) => {
    const {
        user_name: uName,
        user_pwd: uPwd,
        user_repeat_pwd: urePwd,
        user_email: uEmail,
    } = request.body; /**** 解构赋值 ****/

    let userInfo = {
        "userName": uName,
        "userPassword": uPwd,
        "userEmail": uEmail
    };

    let errInfo = {};

    if (urePwd !== uPwd) {
        errInfo.repeatPassword = '两次输入不一致';
    };
    if (!(/^[a-zA-Z][a-zA-Z0-9_]{5,20}$/.test(uName))) {
        errInfo.name = '用户名不合法';
    };
    if (!(/^[a-zA-Z0-9_]{6,20}$/.test(uPwd))) {
        errInfo.password = '密码不合法';
    };
    if (!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(uEmail))) {
        errInfo.email = '邮箱不合法';
    };

    const badEmail = await query('select * from user where email = ?', [userInfo.userEmail]);
    if (badEmail.length > 0) {
        errInfo.emailRegistered = '邮箱已被注册';
    };

    if (errInfo.repeatPassword || errInfo.name || errInfo.password || errInfo.email || errInfo.emailRegistered) {
        response.send(errInfo);
        return;
    };
    const findName = await query('select * from user where name = ?', [userInfo.userName]);
    if (findName.length > 0) {
        response.send({ msg: '用户名已存在' });
    } else {
        userInfo.userPassword = sha1(userInfo.userPassword);
        let addUser = await query("insert into user(name,password,type,email) values(?,?,1,?)",[userInfo.userName,userInfo.userPassword,userInfo.userEmail]);

        if (addUser.protocol41) {
            response.send({ msg: '注册成功' });
        } else {
            response.send(addUser);
        };
    }
});

module.exports = formRouter;