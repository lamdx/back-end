const express = require("express");
// 引入连接池模块
const pool = require("../../pool");
// console.log(pool)

// 创建路由器对象
let router = express.Router();

// 添加路由
// 1.登录模块 get
router.get("/v1/login/:eid&:pwd", (req, res) => {
  let $eid = req.params.eid;
  let $pwd = req.params.pwd;
  let sql = "select * from user where eid = ? and pwd = ?";
  pool.query(sql, [$eid, $pwd], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      req.session.user = result[0];
      return res.send("1");
    } else {
      return res.send("0");
    }
  });
});

/*
// 2.查询所有用户 get
router.get("/v1/userlist", (req, res) => {
  let sql = "select * from user";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 3.根据 ID 删除一个用户 delete
router.delete("/v1/deluser/:uid", (req, res) => {
  let $uid = req.params.uid;
  let sql = "delete from user where uid = ?";
  pool.query(sql, [$uid], (err, result) => {
    if (err) throw err;
    if (result.affectedRows > 0) {
      // 删除成功
      res.send("1");
    } else {
      res.send("0");
    }
  });
});
*/
// 4.根据 工号 查询一个用户信息 get
router.get("/v1/searchuser/:eid", (req, res) => {
  let $eid = req.params.eid;
  let sql = "select * from user where eid = ?";
  pool.query(sql, [$eid], (err, result) => {
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

// 5.修改用户密码 put
router.put("/v1/updateuser", (req, res) => {
  // let $uid = req.body.uid;
  // let $email = req.body.email;
  // let $phone = req.body.phone;
  // let $user_name = req.body.user_name;
  // let $gender = req.body.gender;
  let obj = req.body;
  // console.log(obj);
  if (!obj.opwd) {
    return res.send("-1");
  }
  if (!obj.pwd) {
    return res.send("-2");
  }
  if (!obj.cpwd) {
    return res.send("-3");
  }
  if (obj.opwd == obj.pwd) {
    return res.send("-4");
  }
  let sql = "update user set pwd = ? where eid = ? and pwd = ?;";
  pool.query(sql, [obj.pwd, obj.eid, obj.opwd], (err, result) => {
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

// 6.根据工号查询用户是否存在 get
router.get("/v1/checkeid/:eid", (req, res) => {
  let $eid = req.params.eid;
  let sql = "select * from user where eid = ?";
  pool.query(sql, [$eid], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      // 用户名存在
      return res.send("0");
    } else {
      // 用户名不存在
      return res.send("1");
    }
  });
});

// 7.注册新用户 post
router.post("/v1/reguser", (req, res) => {
  let obj = req.body;
  console.log(obj);
  if (!obj.eid) {
    return res.send("-1");
  }
  if (!obj.pwd) {
    return res.send("-2");
  }
  if (!obj.cpwd) {
    return res.send("-3");
  }
  if (!obj.email) {
    return res.send("-4");
  }
  if (!obj.phone) {
    return res.send("-5");
  }
  if (!obj.user_name) {
    return res.send("-6");
  }
  if (!obj.gender) {
    return res.send("-7");
  }
  delete obj.cpwd;
  // 用户名/手机号码验证唯一
  let sql = "select * from user where eid = ? or phone = ?";
  pool.query(sql, [obj.eid, obj.phone], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      // 用户名/手机号码已存在
      return res.send("0");
    } else {
      // 用户名不存在
      let sql = "insert into user set ? ";
      pool.query(sql, [obj], (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.affectedRows > 0) {
          res.send("1");
        } else {
          res.send("2");
        }
      });
    }
  });
});

// 8.退出登录
router.get("/v1/logout", (req, res) => {
  // 清除登录状态
  req.session.user = null;
  // 重定向到登录页
  res.send("1");
});

// 导出路由器对象
module.exports = router;
