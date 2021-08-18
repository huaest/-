const express = require('express');
// 导入数据库
const db = require('../db/index.js');
// 密码加密模块
const bcrypt = require('bcryptjs')
// 获取信息
exports.getInfo = (req, res) => {
    // 查询语句定义
    const infoSql = "select id,username,nickname,email,user_pic from ev_users where id=?";
    // 操作数据库
    db.query(infoSql, req.user.id, (err, data) => {
        // 数据库报错
        if (err) return res.cc(err);
        // 获取失败
        if (data.length !== 1) return res.cc("用户信息获取失败！")
        // 获取数据成功
        res.send({ status: 0, message: "获取信息成功！", data: data })
    })
}

// 更新信息
exports.updateInfo = (req, res) => {
    // id 不能变，否则token解析的id就会不一致，在数据库中唯一的值不能变！！
    delete req.body.id
    const updateSql = "update ev_users set ? where id=?";
    db.query(updateSql, [req.body, req.user.id], (err, data) => {
        // 数据库报错
        if (err) return res.cc(err);

        // 执行 SQL 语句成功，但影响行数不为 1
        if (data.affectedRows !== 1) return res.cc('修改用户基本信息失败！')

        console.log(req.user.id);
        // 修改用户信息成功
        return res.cc('修改用户基本信息成功！', 0)

    })
}

// 更新密码
exports.updatePwd = (req, res) => {
    // 查询对应用户数据语句
    const selectSql = "select * from ev_users where id=?";

    db.query(selectSql, req.user.id, (err, data) => {
        // 数据库报错
        if (err) return res.cc(err);

        if (data.length !== 1) return res.cc("获取用户信息失败！");

        // 比较密码
        const compareOldPwdResult = bcrypt.compareSync(req.body.oldPwd, data[0].password)
        if (!compareOldPwdResult) return res.send({ status: 0, message: "原密码输入错误！" });

        // 加密密码
        newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        // 更新密码语句
        const updatPwdeSql = "update ev_users set ? where id=?";
        db.query(updatPwdeSql, [{ password: newPwd }, req.user.id], (err, data) => {
            // 数据库报错
            if (err) return res.cc(err);

            // 执行 SQL 语句成功，但影响行数不为 1
            if (data.affectedRows !== 1) return res.cc('修改密码失败！')

            // 修改用户信息成功
            return res.cc('修改密码成功！', 0)
        })
    })
}

// 更换头像
exports.updateAvatar = (req, res) => {
    const avatarSql = "update ev_users set ? where id=?";
    db.query(avatarSql, [{ user_pic: req.body.user_pic }, req.user.id], (err, data) => {
        
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (data.affectedRows !== 1) return res.cc('更新头像失败！')

        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
    })
}


