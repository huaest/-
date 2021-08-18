const express = require('express');
const router = express.Router();
const expressJoi = require('@escook/express-joi')
const articles = require('../router_handler/articles');
const { add_article_schema } = require('../schema/user')
// 表单解析模块
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 添加文章路由,两个局部中间件！
router.post("/add",upload.single('cover_img'), expressJoi(add_article_schema), articles.addArt)


module.exports = router;