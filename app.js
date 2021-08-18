// 导入中间件
const express = require('express');
const cors = require('cors');
const express_jwt = require('express-jwt');
const config = require('./config/config.js')
const app = express();


// 处理跨域
app.use(cors());

// 处理www-form-urlencoded类型格式
app.use(express.urlencoded({
    extended: false
}))

// 静态托管uploads下的所有图片
app.use('/uploads', express.static('./uploads'))

// res.send()模块的封装,全局调用res.css封装函数
app.use((req, res, next) => {
    res.cc = (err, status = 1) => {
        return res.send({
            status,
            message: err instanceof Error ? err.message : err

        })
    }
    next();
})
// 注册token解密中间件
app.use(express_jwt({ secret: config.tokenSecret }).unless({ path: [/^\/api\//] }))

// 导入注册模块
const userRouter = require('./router/user.js');
app.use('/api', userRouter); //为路由添加前缀

// 导入用户信息模块,需要token验证
const userinfoRouter = require('./router/userinfo.js');
app.use('/my', userinfoRouter); //为路由添加前缀

// 导入文章类别模块
const article_cate = require('./router/article_cate.js');
app.use('/my', article_cate);

// 导入文章模块
const articles = require("./router/articles.js")
app.use('/my', articles);

// 错误中间件
const joi = require('joi')
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 登入token验证失败
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})

// 启动服务器
app.listen(80, () => {
    console.log("server start!");
})