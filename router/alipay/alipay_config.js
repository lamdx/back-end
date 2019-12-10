const fs = require("fs");
const path = require("path");

// 这里配置基本信息
const AlipayBaseConfig = {
  appId: "2016101500695833", // 应用 ID
  privateKey: fs.readFileSync(
    path.join(__dirname, "./sandbox-pem/private_pem2048.txt"),
    "ascii"
  ), // 应用私钥
  alipayPublicKey:
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqUAKY/z2huQeNKikGR1Nbs3IsbuSscq6ka/kMfrgtKw/qfOX/NtQv7Gy1Jk6agt3yE53PheDmdU7Wc4lmPWEhUGd6o07F1MnEA/7Fwpat5iqMmcDIFbbSUA5InON5YLWkXLakHdUVjPXITTaIDxTeUqKVoXbiElpDGzUvT4+m9g9IsEa5dl6dqS9cqsrXX2tUXgTc7Wbg28CIjYe3TiPbyjESuWRw1rwf1MEVcm2+QWRoEwQUcpVWGmVlxLCZb2LqI1H5A8GXaMj0zBYX1CrwxYbXJ2YDnytTs4ZV8hjw3zPATslCvv6ooghdAmhZHpIDOKMHWwBGQeVtp2p/DpKuQIDAQAB", // 支付宝公钥
  gateway: "https://openapi.alipaydev.com/gateway.do", // 支付宝的应用网关
  charset: "utf-8",
  version: "1.0",
  signType: "RSA2"
};

module.exports = {
  AlipayBaseConfig: AlipayBaseConfig
};
