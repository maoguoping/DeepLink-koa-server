--项目列表初始化
CREATE TABLE `project_list` (
  `id` bigint(50) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `project_id` varchar(50) NOT NULL COMMENT '项目id',
  `project_name` varchar(100) NOT NULL COMMENT '项目名称',
  `project_description` varchar(500) DEFAULT NULL COMMENT '项目描述',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `modify_time` datetime NOT NULL COMMENT '修改时间',
  `path` varchar(1000) NOT NULL COMMENT '路径',
  `path_id` varchar(1000) NOT NULL COMMENT '路径id',
  `tag` varchar(1000) DEFAULT NULL COMMENT '标记',
  `children` varchar(10000) DEFAULT NULL COMMENT '子节点',
  PRIMARY KEY (`id`),
  KEY `IX_path_id` (`path_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;


