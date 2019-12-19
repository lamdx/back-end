const express = require("express");

// 引入连接池query模块
const query = require("../../pool");

// 创建路由器对象
let router = express.Router();

// 添加路由
// 查询所有订单类型
router.get("/carousel", (req, res) => {
  let sql = "select * from carousel";
  query(sql, {}).then(result => res.send(result));
});

// 导出路由器对象
module.exports = router;
