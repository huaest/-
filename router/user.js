const express = require('express');
const router_handler = require('../router_handler/user.js');
// 注册路由
const router = express.Router();

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象 ,结构，只需要里面的reg对象
const { reg_login_schema } = require('../schema/user.js')

// 注册新用户
// 3. 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 3.2 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
// 注册用户
router.post("/register", expressJoi(reg_login_schema), router_handler.register);

//登入模块
router.post("/login", expressJoi(reg_login_schema), router_handler.login);
// 道出路由-->只有导出才能被require到！

module.exports = router