CREATE TABLE `right_list` (
  `id` bigint(50) NOT NULL AUTO_INCREMENT,
  `right_id` varchar(64) NOT NULL COMMENT '权限id',
  `parent_right_id` varchar(64) DEFAULT NULL COMMENT '父级权限id',
  `right_name` varchar(64) NOT NULL COMMENT '权限名称',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `modify_time` datetime DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL COMMENT '页面路径',
  `description` varchar(200) DEFAULT NULL COMMENT '权限描述',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;