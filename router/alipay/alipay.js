const express = require("express");
const path = require("path");
// 引入连接池模块
const query = require("../../pool");

// 创建路由器对象
let router = express.Router();

// 前端响应要创建订单的数据对象
router.get("/payinfo", (req, res) => {
  let data = req.query;
  res.send(
    Object.assign(data, {
      code: 200
    })
  );
  //   做一个简单的商品判断
  //   if (
  //     data &&
  //     (data.goodsName === "大卫龙" ||
  //       data.goodsName === "冰阔咯" ||
  //       data.goodsName === "雪碧" ||
  //       data.goodsName === "QQB") &&
  //     data.count &&
  //     data.cost
  //   ) {
  //     res.send(
  //       Object.assign(data, {
  //         code: 200
  //       })
  //     );
  //   } else {
  //     res.setHeader("content-type", "application/javascript");
  //     res.send('alert("信息有误，请重新尝试！！！")');
  //   }
});

// 获取创建订单的自定义模块
const createOrder = require(path.join(__dirname, "./createOrder.js"))
  .createOrder;
// 获取验签自定义模块
const checkSign = require(path.join(__dirname, "./checkSign.js"));

// 生成订单请求
router.post("/createOrder", (req, res) => {
  console.log(req.body.price);
  req.body.pack_params = {
    payName: req.body.payName,
    goodsName: req.body.goodsName,
    price: req.body.price,
    count: req.body.count,
    cost: req.body.cost
  };

  async function asyncCreate() {
    const result = await createOrder(req.body);
    res.send(result);
  }
  asyncCreate();
});

// 支付的信息展示
router.get("/payresult", (req, res) => {
  // let htmlStr = "";
  // htmlStr += `<p>` + "商户订单号" + ": " + req.query.out_trade_no + "</p>";
  // htmlStr += `<p>` + "支付宝交易订单号" + ": " + req.query.trade_no + "</p>";
  // htmlStr += `<p>` + "交易金额" + ": " + req.query.total_amount + "￥</p>";
  // htmlStr += `<p>` + "交易时间" + ": " + req.query.timestamp + "￥</p>";
  // htmlStr +=
  //   '<h1 style:"text-align:center;">支付成功！！！<a href="./index.html">返回首页!</a></h1>';
  // res.send(htmlStr);
  res.redirect("http://localhost:8080/cart");
});

router.post("/notify.html", (req, res) => {
  // 输出验签结果
  async function checkResult(postData) {
    let result = await checkSign(postData);
    if (result) {
      // console.log('订单成功支付！！！请做处理')
      // console.log(req.body);
      let data = req.body;
      let goods = JSON.parse(data.passback_params);
      let sql = `insert into paylist values("${data.out_trade_no}",
                "${data.trade_no}",
                "${goods.goodsName}",
                ${goods.price},
                ${goods.count},
                ${data.total_amount},
                "支付成功",
                "${goods.payName}");`;
      // 响应支付宝 success 处理成功，否则支付宝会一直定时发送异步通知
      res.end("success");
      // pool.query(sql, (err, result) => {
      //   if (err) throw err;
      //   res.send(result);
      // });
      query(sql, {}).then(() => console.log(1));
    }
  }
  checkResult(req.body);
});

// 查询订单接口
router.get("/getorder", (req, res) => {
  let sql = "select * from order_list";
  pool.query(sql, (err, result) => {
    if (err) throw err;
    result = Object.assign({
      code: 200,
      msg: "获取成功",
      list: JSON.stringify(result)
    });
    res.send(result);
  });
});

// 导出路由器对象
module.exports = router;
