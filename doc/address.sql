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

