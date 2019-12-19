const express = require("express");

// 引入连接池query模块
const query = require("../../pool");

// 创建路由器对象
let router = express.Router();

// 查询地址
router.get("/address", (req, res) => {
  let sql = "select * from address ORDER BY id DESC";
  query(sql, {})
    .then(result => res.send(result))
    .catch(err => {
      throw err;
    });
});

// 添加地址
router.post("/address", (req, res) => {
  let obj = req.body;
  console.log(req.body.isDefault);
  if (req.body.isDefault === true) {
    // 如果新增地址为默认地址，则把之前所有地址取消默认
    let sql = "update address set isDefault = false;";
    query(sql, {}).then(() => {
      let sql = "insert into address set ? ";
      query(sql, [obj]).then(result =>
        result.affectedRows > 0 ? res.send("1") : res.send("0")
      );
    });
  } else {
    let sql = "insert into address set ? ";
    query(sql, [obj]).then(result =>
      result.affectedRows > 0 ? res.send("1") : res.send("0")
    );
  }
});

// 修改地址
router.put("/address/:id", (req, res) => {
  let $id = req.params.id;
  let obj = req.body;
  if (req.body.isDefault === true) {
    // 如果修改地址为默认地址，则把所有地址取消默认
    let sql = "update address set isDefault = false;";
    query(sql, {}).then(() => {
      let sql = "update  address set ? where id = ?";
      query(sql, [obj, $id]).then(result =>
        result.affectedRows > 0 ? res.send("1") : res.send("0")
      );
    });
  } else {
    let sql = "update address set ? where id = ?";
    query(sql, [obj, $id]).then(result =>
      result.affectedRows > 0 ? res.send("1") : res.send("0")
    );
  }
});

// 删除地址
router.delete("/address/:id", (req, res) => {
  let $id = req.params.id;
  let sql = "delete from address where id = ?";
  query(sql, [$id]).then(result =>
    result.affectedRows > 0 ? res.send("1") : res.send("0")
  );
});

// 导出路由器对象
module.exports = router;
