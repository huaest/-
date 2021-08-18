const express = require('express');
const expressJoi = require('@escook/express-joi')



// 获取处理函数
const article_cate = require('../router_handler/article_cate.js');
const { add_cate_schema } = require('../schema/user.js')
const { delete_cate_schema } = require('../schema/user')
const { update_cate_schema } = require('../schema/user')
// 本路由对象
const router = express.Router();

// 文章分类路由
router.get('/cates', article_cate.getCate)

// 添加类别
router.post('/addCate', expressJoi(add_cate_schema), article_cate.addCate)

// 根据id删除类别
router.get('/deleteCate/:id', expressJoi(delete_cate_schema), article_cate.deleteCate)

// 根据id获取类别
router.get('/cates/:id', expressJoi(delete_cate_schema), article_cate.getCateById)

// 根据id更新类别
router.post('/updateCate', expressJoi(update_cate_schema), article_cate.updateCateById)



// 导出路由对象
module.exports = router;