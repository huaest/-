// 导入数据库模块
const mysql = require('mysql');

// 链接数据库
const db=mysql.createPool({
    // ip 只能写纯ip
    host:"127.0.0.1",
    user:"root",
    password:"ymh5317848",
    database:"event_api"
})

// 向外暴露db对象，以便于被require时获得
module.exports=db;