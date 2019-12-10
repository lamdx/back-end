SET NAMES UTF8;
DROP DATABASE IF EXISTS alipay;
CREATE DATABASE alipay CHARSET=UTF8;
USE alipay;

DROP TABLE IF EXISTS `order_list`;
CREATE TABLE `order_list` (
  `out_trade_no` varchar(255) NOT NULL,
  `trade_no` varchar(255) NOT NULL,
  `goods_name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `total_amount` int(11) NOT NULL,
  `trade_status` varchar(255) DEFAULT NULL,
  `payName` varchar(255) NOT NULL
);

INSERT INTO `order_list` VALUES ('1', '1', '1', 1, 1, 1, '1', '1');