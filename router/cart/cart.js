const express = require("express");

// 引入连接池query模块
const query = require("../../pool");

// 创建路由器对象
let router = express.Router();

// 查询购物车
router.get("/cart", (req, res) => {
  let sql = "select * from cart ORDER BY id DESC";
  query(sql, {})
    .then(result => res.send(result))
    .catch(err => {
      throw err;
    });
});

// 添加购物车
router.post("/cart", (req, res) => {
  let obj = req.body;
  let sql = "select * from cart where id = ?";
  query(sql, [obj.id])
    .then(result => {
      if (result.length > 0) {
        // 已存在商品则累加商品数量
        let num = parseInt(result[0].num) + parseInt(obj.num);
        let sql = "update cart set num = ? where id = ?";
        return query(sql, [num, obj.id]);
      } else {
        // 不存在商品则插入商品
        let sql = "insert into cart set ?";
        return query(sql, [obj]);
      }
    })
    .then(result => {
      result.affectedRows > 0 ? res.send("1") : res.send("0");
    });
});

// 修改购物车
router.put("/cart", (req, res) => {
  let obj = req.body;
  let sql = "update cart set ? where id = ?";
  query(sql, [obj, obj.id]).then(result =>
    result.affectedRows > 0 ? res.send("1") : res.send("0")
  );
});

// 删除购物车
router.delete("/cart", (req, res) => {
  let obj = req.body;
  // 批量删除
  if (obj instanceof Array) {
    let str = obj.join(",");
    let sql = `delete from cart where id in (${str})`;
    query(sql, {}).then(result => {
      console.log(sql);
      result.affectedRows > 0 ? res.send("1") : res.send("0");
    });
  } else {
    // 单项删除
    let sql = "delete from cart where id = ?";
    query(sql, [obj.id]).then(result =>
      result.affectedRows > 0 ? res.send("1") : res.send("0")
    );
  }
});

// 导出路由器对象
module.exports = router;
