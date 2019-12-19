# 地址
CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `name` varchar(16) NOT NULL,
  `tel` varchar(16) NOT NULL,
  `country` varchar(16) NOT NULL,
  `province` varchar(16) NOT NULL,
  `city` varchar(16) NOT NULL,
  `county` varchar(16) NOT NULL,
  `areaCode` varchar(16) NOT NULL,
  `postalCode` varchar(16) NOT NULL,
  `addressDetail` varchar(128) NOT NULL,
  `isDefault` tinyint(1) NOT NULL,
  `address` varchar(128) NOT NULL
);

INSERT INTO `address` (`id`, `name`, `tel`, `country`, `province`, `city`, `county`, `areaCode`, `postalCode`, `addressDetail`, `isDefault`, `address`) VALUES
(9, 'jack', '13510740753', '', '天津市', '天津市', '河东区', '120102', '110101', '万寿路', 1, '天津市天津市河东区万寿路'),
(12, 'lam', '13510740753', '', '北京市', '北京市', '东城区', '110101', '110101', '万寿路', 0, '北京市北京市东城区万寿路');

# 购物车
CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `num` int(11) NOT NULL,
  `size` int(11) NOT NULL,
  `isDelete` tinyint(1) NOT NULL,
  `isSelected` tinyint(1) NOT NULL,
  `price` int(11) NOT NULL,
  `desc` varchar(128) NOT NULL,
  `title` varchar(128) NOT NULL,
  `thumb` varchar(128) NOT NULL
);

INSERT INTO `cart` (`id`,`uid`,`productId`,`num`,`size`,`isDelete`,`isSelected`,`price`,`desc`,`title`,`thumb`) VALUES
(1,1,1,1,42,0,1,6999,"酷睿双核i5处理器|256GB SSD|8GB内存|英特尔HD显卡620含共享显卡内存","Apple MacBook Air系列","http://112.74.206.213/img/product/md/57ad359dNd4a6f130.jpg"),
(2,1,2,2,42,0,1,3899,"酷睿双核i5处理器|512GB SSD|2GB内存|英特尔HD独立显卡","小米Air 金属超轻薄","http://112.74.206.213/img/product/md/57ad8846N64ac3c79.jpg"),(3,1,3,1,42,0,1,99,"华硕(ASUS)13.3英寸RX310UQ金属超极本 学生 商务手提轻薄便携超薄笔记本13.3英寸I3-7100U/4G/128G固态","华硕RX310 金属超极本","http://112.74.206.213/img/product/md/57ba6a56N1e3e3d63.jpg");

# 支付宝alipay
CREATE TABLE `paylist` (
  `out_trade_no` varchar(255) NOT NULL,
  `trade_no` varchar(255) NOT NULL,
  `goods_name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `total_amount` int(11) NOT NULL,
  `trade_status` varchar(255) DEFAULT NULL,
  `payName` varchar(255) NOT NULL
);

INSERT INTO `paylist` VALUES ('1', '1', '1', 1, 1, 1, '1', '1');