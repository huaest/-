// 导入数据库模块
const db = require('../db/index.js');
// 导入加密模块
const bcryptjs = require('bcryptjs');
// token密钥模块
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config/config');

// 注册函数
exports.register = (req, res) => {
    const userinfo = req.body;
    if (!userinfo.username || !userinfo.password) {
        return res.send({ status: 1, message: "用户名或密码不合法!" })
    }
    const sql = "select * from ev_users where username=?";
    db.query(sql, userinfo.username, (err, data) => {
        if (err) return res.cc(err.message);

        // 判断用户名是否被占用
        if (data.length > 0) {
            return res.cc("用户名被占用！");
        }

        // 对密码加密
        userinfo.password = bcryptjs.hashSync(userinfo.password, 10);

        // 可以注册
        const insertsql = "insert into ev_users set ? "
        db.query(insertsql, { username: userinfo.username, password: userinfo.password }, (err, data) => {
            if (err) return res.send({ status: 1, message: err.message });
            if (data.affectedRows != 1) return res.cc("注册失败！")
            return res.cc("注册成功！", 0);
        })
    })
}

// 用户登入
exports.login = (req, res) => {
    const loginsql = `select * from ev_users where username=?`
    db.query(loginsql, req.body.username, (err, data) => {
        if (err) return res.cc(err);
        if (data.length != 1) return res.cc("登入失败,用户名未注册！");
        // 比较加密的密码是否和输入的密码一致！
        const compareResult = bcryptjs.compareSync(req.body.password, data[0].password);
        if (!compareResult) res.send("登入失败！");
        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = { ...data[0], password: '', user_pic: '' }
        // 导入配置文件中的密钥，10小时有效
        const token = jwt.sign(user, config.tokenSecret, { expiresIn: "10h" })
        // 登入成功 
        res.send({ status: 0, message: "登入成功！", token: "Bearer " + token })
    })
}