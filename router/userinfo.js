const express = require('express');

// 获取路由
const router = express.Router();

// 验证模块
const expressJoi = require('@escook/express-joi')
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

// 获取处理函数
const userInfo = require('../router_handler/userinfo.js');

// 获取用户基本信息的路由
router.get('/userinfo', userInfo.getInfo)

// 更新用户信息的路由+局部验证中间件
router.post("/updateinfo", expressJoi(update_userinfo_schema), userInfo.updateInfo)

// 更新密码模块
router.post("/updatePwd", expressJoi(update_password_schema), userInfo.updatePwd)

// 更新头像
router.post("/updateAvatar", expressJoi(update_avatar_schema), userInfo.updateAvatar)

// 导出路由
module.exports = router;