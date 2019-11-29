const express = require("express");
// 引入连接池模块
const pool = require("../../pool");
// console.log(pool)

// 创建路由器对象
let router = express.Router();

// 添加路由
// 1.查询首页公告栏所有信息列表
router.get("/v1/noticelist", (req, res) => {
  let sql = "select * from notice";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 2.根据 id 查看具体的公告栏信息
router.get("/v1/notice/:id", (req, res) => {
  let $id = req.params.id;
  let sql = "select * from notice where id = ?";
  pool.query(sql, [$id], (err, result) => {
    if (err) throw err;
    // console.log(result);
    // 查询数据库得到的是对象数组
    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.send("0");
    }
  });
});

// 3.导航栏
router.get("/v1/navbar_type", (req, res) => {
  let sql = "select * from navbar_type";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    // 返回当前登录信息用户
    // console.log(req.session.user);
    res.send({ user: req.session.user, nav: result });
  });
});

// 4.侧边栏目录
router.get("/v1/category/:tid", (req, res) => {
  let $tid = req.params.tid;
  let sql = "select * from category where tid = ?";
  pool.query(sql, [$tid], (err, result) => {
    // console.log(result);
    // 查询数据库得到的是对象数组
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send("0");
    }
  });
});

// 5.查询所有订单列表信息
router.get("/v1/orderlist", (req, res) => {
  let sql = "select * from order_list";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
// 5.1根据订单号查询订单 WS191025027
router.get("/v1/orderno/:no", (req, res) => {
  let $no = req.params.no;
  let sql = "select * from order_list where orderNo = ?";
  pool.query(sql, [$no], (err, result) => {
    if (err) throw err;
    // console.log(result);
    // 查询数据库得到的是对象数组
    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.send("0");
    }
  });
});
// 5.2根据订单状态查询订单 1页显示15条记录 不重要
router.get("/v1/orderstatus/:sid", (req, res) => {
  let $sid = req.params.sid;
  let sql =
    "select * from order_list where status = ? ORDER BY orderTime DESC LIMIT 0, 15";
  pool.query(sql, [$sid], (err, result) => {
    if (err) throw err;
    // console.log(result);
    // 查询数据库得到的是对象数组
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send("0");
    }
  });
});
// 5.3根据订单类型查询订单 1页显示15条记录 不重要
router.get("/v1/ordertype/:tid", (req, res) => {
  let $tid = req.params.tid;
  let sql =
    "select * from order_list where orderType = ? ORDER BY orderTime DESC LIMIT 0, 15";
  pool.query(sql, [$tid], (err, result) => {
    if (err) throw err;
    // console.log(result);
    // 查询数据库得到的是对象数组
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send("0");
    }
  });
});
// 5.4根据时间&类型&订单号&页数查询订单 1页显示5条记录 降序
// http://localhost/order/v1/ordertime/2019-10-23&2019-10-24&1&0
// WS191023023 PKS191023038
router.get("/v1/ordertime/:start&:end&:type&:no&:page", (req, res) => {
  let $start = req.params.start;
  let $end = req.params.end;
  let $type = req.params.type;
  let $no = req.params.no;
  let $page = req.params.page; // 转换成数值
  // 分页查询条件
  let $length = 5;
  let $skip = ($page - 1) * $length;
  // 初始化查询条件
  let $where = "";
  // 判断查询条件 SQL条件右边记得带上''
  if ($no != 0 && $type != 0) {
    $where = `orderTime > '${$start}' and orderTime < '${$end}' and orderType = ${$type} and orderNo = '${$no}'`;
  } else if ($no == 0 && $type != 0) {
    $where = `orderTime > '${$start}' and orderTime < '${$end}' and orderType = ${$type}`;
  } else if ($no != 0 && $type == 0) {
    $where = `orderTime > '${$start}' and orderTime < '${$end}' and orderNo = '${$no}'`;
  } else {
    $where = `orderTime > '${$start}' and orderTime < '${$end}'`;
  }
  // SQL语句
  let sql = `select * from order_list where ${$where} ORDER BY orderTime DESC limit ?, ?`;
  // 先查询到所有数据的数量
  let sql_total = `select count(1) as count from order_list where ${$where}`;

  /*pool.query(sql, [$skip, $length], (err, result) => {
    if (err) throw err;
    // console.log(result);
    // 查询数据库得到的是对象数组
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send("0");
    }
  });*/

  // 封装 Promise
  let fetch_all = function(sql, arr = {}) {
    return new Promise(function(resolve, reject) {
      pool.query(sql, arr, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
  // 返回数据结构 {orderlist: Array(0), count: 0, total_pages: 0}
  let obj = {};
  fetch_all(sql, [$skip, $length])
    .then(function(data) {
      // 查询所有列表数据
      obj["orderlist"] = data;
      return fetch_all(sql_total);
    })
    .then(function(data) {
      // 先查询到所有数据的数量
      obj["count"] = data[0]["count"];
      // 计算总页数
      obj["total_pages"] = data[0]["count"] / $length;
      res.send(obj);
    });
});

// 6.根据订单号修改订单状态 put PKS191025020 2->3
// 1-作废 2-未审核 3-已确认 4-已发货 5-已签收
router.get("/v1/updatestatus/:no&:status", (req, res) => {
  let $no = req.params.no;
  let $status = req.params.status;
  let sql = "update order_list set status = ? where orderNo = ?";
  pool.query(sql, [$status, $no], (err, result) => {
    if (err) throw err;
    console.log(result);
    if (result.affectedRows > 0) {
      // 更改成功
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

// 7.根据订单号上传订单信息 暂时没有写非空判断
router.put("/v1/updateorder", (req, res) => {
  // let $uid = req.body.uid;
  // let $email = req.body.email;
  // let $phone = req.body.phone;
  // let $user_name = req.body.user_name;
  // let $gender = req.body.gender;
  let obj = req.body;
  // console.log(obj);
  let sql = "update order_list set ? where orderNo = ?;";
  pool.query(sql, [obj, obj.orderNo], (err, result) => {
    if (err) throw err;
    // console.log(result);
    if (result.affectedRows > 0) {
      // 更改成功
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

// 8.新增订单
router.post("/v1/orderadd", (req, res) => {
  let obj = req.body;
  // console.log(obj);
  let sql = "insert into order_list set ? ";
  pool.query(sql, [obj], (err, result) => {
    if (err) throw err;
    // console.log(result);
    if (result.affectedRows > 0) {
      res.send("1");
    } else {
      res.send("0");
    }
  });
});

// 查询所有订单类型
router.get("/v1/order_type", (req, res) => {
  let sql = "select * from order_type";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
// 查询所有承运商
router.get("/v1/fwd", (req, res) => {
  let sql = "select * from fwd";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
// 查询所有订单状态
router.get("/v1/order_status", (req, res) => {
  let sql = "select * from order_status";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 导出路由器对象
module.exports = router;
