const express = require("express");
// 引入短信模块
const SmsSingleSender = require("./SmsSingleSender");

// 创建路由器对象
let router = express.Router();

// 点击发送验证码,后台接入腾讯短信服务接口
// http://localhost:3000/sms/13510740753
router.get("/sms/:phone", (req, res) => {
  let phone = req.params.phone;
  let rand = (parseInt(Math.random() * 9999) + "").padStart(4, 0);
  // 短信应用 SDK AppID
  let appid = 1400291999;
  // 短信应用 SDK AppKey
  let appkey = "db4896e8a61d391a226ae2e5d49c1757";
  // 短信模板 ID，需要在短信控制台中申请
  let templateId = 485357;
  // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`
  let smsSign = "lamdx";
  // 实例化 msSingleSender
  let ssender = new SmsSingleSender(appid, appkey);
  let params = [`${rand}`, "2"];
  ssender.sendWithParam(
    "86",
    phone,
    templateId,
    params,
    smsSign,
    "",
    "",
    callback
  );
  // 设置请求回调处理, 用户需要自定义相应处理回调
  function callback(err, result, resData) {
    if (err) {
      console.log("err: ", err);
    } else {
      console.log("request data: ", result.req);
      console.log("response data: ", resData);
      res.send({ data: rand });
    }
  }
});

// 导出路由器对象
module.exports = router;
