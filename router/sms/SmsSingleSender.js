// https是服务端发起请求的工具包 https.request
const https = require("https");
const url = require("url");
const crypto = require("crypto");
/**
 * Module exports
 * @ignore
 */
module.exports = SmsSingleSender;

/**
 * Get a random number
 *
 * @return {number}
 * @public
 */
function getRandom() {
  return Math.round(Math.random() * 99999);
}

/**
 * Get current time
 *
 * @return {number}
 * @public
 */
function getCurrentTime() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Calculate a request signature according to parameters
 *
 * @param  {string}  appkey - sdk appkey
 * @param  {string}  random - random string
 * @param  {number}  time - unix timestamp time
 * @param  {array}   phoneNumbers - phone number array
 * @return {string}
 * @public
 */
function calculateSignature(appkey, random, time, phoneNumbers) {
  return crypto
    .createHash("sha256")
    .update(
      "appkey=" +
        appkey +
        "&random=" +
        random +
        "&time=" +
        time +
        "&mobile=" +
        phoneNumbers.join(","),
      "utf-8"
    )
    .digest("hex");
}

/**
 * Make a request and call given callback
 *
 * @param  {object}    options - request options
 * @param  {function}  callback - request handler, method signature: function(error, response, responseData)
 * @public
 */
function request(options, callback) {
  var body;
  if (options.body) {
    body = options.body;
    delete options.body;
  }

  var req = https.request(options, function(res) {
    res.setEncoding("utf-8");
    var resData = "";

    res.on("data", function(data) {
      resData += data;
    });

    res.on("error", function(err) {
      callback(err, res, undefined);
    });

    res.on("end", function() {
      res.req = options;
      res.req.body = body;
      callback(undefined, res, JSON.parse(resData));
    });
  });

  req.on("error", function(err) {
    callback(err, undefined, undefined);
  });

  if (body) {
    if (Buffer.isBuffer(body)) {
      req.write(body);
    } else {
      req.write(JSON.stringify(body));
    }
  }
  req.end();
}

/**
 * SmsSingleSender
 *
 * @param  {string}  appid  - sdk appid
 * @param  {string}  appkey - sdk appkey
 * @constructor
 */
function SmsSingleSender(appid, appkey) {
  this.appid = appid;
  this.appkey = appkey;
  this.url = "https://yun.tim.qq.com/v5/tlssmssvr/sendsms";
}

/**
 * Send single SMS message with template paramters
 *
 * @param  {string}    nationCode - nation dialing code, e.g. China is 86, USA is 1
 * @param  {string}    phoneNumber - phone number
 * @param  {number}    templId - template id
 * @param  {array}     params - template parameters
 * @param  {string}    sign - SMS user sign
 * @param  {string}    extend - extend field, default is empty string
 * @param  {string}    ext - ext field, content will be returned by server as it is
 * @param  {function}  callback - request handler, signature: function(error, response, responseData)
 * @public
 */
SmsSingleSender.prototype.sendWithParam = function(
  nationCode,
  phoneNumber,
  templId,
  params,
  sign,
  extend,
  ext,
  callback
) {
  var reqUrl = url.parse(this.url);
  var random = getRandom();
  var now = getCurrentTime();
  var options = {
    host: reqUrl.host,
    path: reqUrl.path + "?sdkappid=" + this.appid + "&random=" + random,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      tel: {
        nationcode: nationCode + "",
        mobile: phoneNumber + ""
      },
      sign: sign,
      tpl_id: parseInt(templId),
      params: params,
      sig: calculateSignature(this.appkey, random, now, [phoneNumber]),
      time: now,
      extend: !extend ? "" : extend + "",
      ext: !ext ? "" : ext + ""
    }
  };

  request(options, callback);
};
