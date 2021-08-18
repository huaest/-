const { query } = require('../db/index');
const db = require('../db/index');
const { get } = require('../router/article_cate');

// 导出获取类别处理函数
exports.getCate = (req, res) => {
    const cateSql = "select * from ev_article_cate where id_delete=0 order by id asc";
    db.query(cateSql, (err, data) => {
        // 数据库错误
        if (err) return res.cc(err);
        // 获取成功
        res.send({ status: 0, message: "获取文章分类成功！", data: data })
    })
}


exports.addCate = (req, res) => {

    // 判别重复
    const selcetSql = "select * from ev_article_cate where name=? or alias=?";

    db.query(selcetSql, [req.body.name, req.body.alias], (err, data) => {
        // 数据库错误
        if (err) return res.cc(err);
        // 查询是否重复
        if (data.length === 2) return res.cc("名称和分类被占用")
        if (data.length === 1 && data[0].name == req.body.name && data[0].alias == req.body.alias) return res.cc("名称和分类被占用")
        if (data.length === 1 && data[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
        if (data.length === 1 && data[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

        // 添加数据
        const addSql = "insert into ev_article_cate set ?";
        db.query(addSql, { name: req.body.name, alias: req.body.alias }, (err, data) => {
            // 数据库错误
            if (err) return res.cc(err);
            if (data.affectedRows !== 1) return res.cc("添加文章失败！");
            res.cc("添加成功", 0);
        })
    })
}

// 根据id删除分类
exports.deleteCate = (req, res) => {
    const idSql = "select * from ev_article_cate where id=?";
    db.query(idSql, req.params.id, (err, data) => {
        // 数据库错误
        if (err) return res.cc(err);

        if (data.length !== 1) return res.cc("数据库操作错误");

        const deletSql = "update ev_article_cate set is_delete=1 where id=?";

        db.query(deletSql, req.params.id, (err, data) => {
            // 数据库错误
            if (err) return res.cc(err);

            // 删除成功
            res.cc("删除类别成功", 0);
        })
    })
}

// 根据id获取分类
exports.getCateById = (req, res) => {
    const getSqlBy = "select * from ev_article_cate where id=?";
    db.query(getSqlBy, req.params.id, (err, data) => {
        // 数据库错误
        if (err) return res.cc(err);

        if (data.length !== 1) return res.cc("数据库操作错误！");

        return res.send({ status: 0, message: "获取成功！", data: data[0] })
    })
}


// 根据id更新类别
exports.updateCateById = (req, res) => {
    const selectSql = `select * from ev_article_cate where Id=? and (name=? or alias=?)`

    db.query(selectSql, [req.body.id, req.body.name, req.body.alias], (err, data) => {
        // 数据库错误
        if (err) return res.cc(err);

        if (data.length > 0) return res.cc("类别重复");

        // 没有重复，则更新
        const updateSql = "update ev_article_cate set ? where id=?"
        db.query(updateSql, [{ name: req.body.name, alias: req.body.alias }, req.body.id], (err, data) => {
            // 数据库错误
            if (err) return res.cc(err);

            if (data.affectedRows !== 1) return res.cc("数据库操作错误！")

            return res.cc("更新类别成功！", 0);

        })

    })




}