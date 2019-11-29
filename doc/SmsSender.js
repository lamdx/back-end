const sender = require('./SmsSender.js')
// 点击发送验证码，后台接入腾讯短信服务接口
app.get("/sendSms", (req, res) => {
  // 获取前台输入的手机号
  var phoneNumbers = [req.query.phone];
  // 这是sdkappid和appkey
  sender.config.sdkappid = 1400278193;
  sender.config.appkey = "05f8e469cb020ac14c44d85513fb9e98";

  /**
   * 带模板单发短信接口
   * @param {string} nationCode 国家码，如果中国 86
   * @param {string} phoneNumber 手机号
   * @param {number} templId 短信模板参数，如不清楚，请在 https:/console.qcloud.com/sms/smsContent 查看
   * @param {array} params 模板参数数组，元素类型为 {string}，元素个数不要超过模板参数个数
   * @param {string} sign 短信签名
   * @param {string} extend 扩展字段，如无需要请填空字符串
   * @param {string} ext 此字段腾讯云后台服务器会按原样在应答中
   * @param {function} cb 异步结果回调函数
   */
  var rand = (Math.random() * 99999999999999999 + "").substring(0, 4);
  console.log(rand);
  // 调用发送的函数
  sender.singleSmsSendWithParam(
    "86",
    phoneNumbers[0],
    454808,
    [`${rand}`, "2"],
    "深圳民治龙舟队",
    "",
    "",
    function(data) {
      var ret = JSON.parse(data);
      if (0 != ret.result) {
        console.log(ret);
      }
    }
  );
  // 将随机数返回前台
  res.send({ code: 1, data: rand });
});


/***************************以下为模块内容***************************/
var crypto = require("crypto");
// request是服务端发起请求的工具包
var request = require("request");

var config = { sdkappid: "", appkey: "" };

var singleSmsUrl = "https://yun.tim.qq.com/v5/tlssmssvr/sendsms";

function getSmsSig(rand, curTime, phoneNumbers) {
  var phoneNumberStr = phoneNumbers[0];
  for (var i = 1; i < phoneNumbers.length; i++) {
    phoneNumberStr += "," + phoneNumbers[i];
  }

  // 一定要使用 utf-8 编码
  return crypto
    .createHash("sha256")
    .update(
      "appkey=" +
        config.appkey +
        "&random=" +
        rand +
        "&time=" +
        curTime +
        "&mobile=" +
        phoneNumberStr,
      "utf-8"
    )
    .digest("hex");
}

/**
 * 带模板单发短信接口
 * @param {string} nationCode 国家码，如果中国 86
 * @param {string} phoneNumber 手机号
 * @param {number} templId 短信模板参数，如不清楚，请在 https://console.qcloud.com/sms/smsContent 查看
 * @param {array} params 模板参数数组，元素类型为 {string}，元素个数请不要超过模板参数个数
 * @param {string} sign 短信签名
 * @param {string} extend 扩展字段，如无需要请填空字符串
 * @param {string} ext 此字段腾讯云后台服务器会按原样在应答中
 * @param {function} cb 异步结果回调函数
 */
function singleSmsSendWithParam(
  nationCode,
  phoneNumber,
  templId,
  params,
  sign,
  extend,
  ext,
  cb
) {
  var rand = Math.round(Math.random() * 99999);
  var curTime = Math.floor(Date.now() / 1000);

  var reqObj = {
    tel: {
      nationcode: nationCode + "",
      mobile: phoneNumber + ""
    },
    sign: sign,
    tpl_id: Number(templId),
    params: params,
    sig: getSmsSig(rand, curTime, [phoneNumber]),
    time: curTime,
    extend: extend,
    ext: ext
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      cb(body);
    } else if (!error && response.statusCode != 200) {
      retObj = {
        result: -1,
        errmsg: "http code " + response.statusCode
      };
      cb(JSON.stringify(retObj));
    } else {
      var retObj = {
        result: -2,
        errmsg: error.toString()
      };
      cb(JSON.stringify(retObj));
    }
  }

  request(
    {
      url: singleSmsUrl + "?sdkappid=" + config.sdkappid + "&random=" + rand,
      method: "POST",
      json: false,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqObj)
    },
    callback
  );
}

exports.singleSmsSendWithParam = singleSmsSendWithParam;
exports.config = config;
