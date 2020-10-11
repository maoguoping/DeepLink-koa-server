CREATE TABLE `element_type_dic` (
  `id` bigint(50) NOT NULL COMMENT '主键id',
  `element_type_id` int(50) NOT NULL COMMENT '元素类型id',
  `element_type_name` varchar(100) NOT NULL COMMENT '元素类型名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;