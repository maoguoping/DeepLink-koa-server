--模块列表初始化
CREATE TABLE `module_list` (
  `id` bigint(50) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `module_id` varchar(50) NOT NULL COMMENT '模块id',
  `module_name` varchar(100) NOT NULL COMMENT '模块名称',
  `module_description` varchar(500) DEFAULT NULL COMMENT '模块描述',
  `module_type_id` int(50) NOT NULL COMMENT '模块类型id',
  `module_type` int(50) NOT NULL COMMENT '模块类型',
  `tag` varchar(500) DEFAULT NULL COMMENT '标签',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `modify_time` datetime NOT NULL COMMENT '修改时间',
  `path` varchar(1000) NOT NULL COMMENT '路径',
  `path_id` varchar(1000) NOT NULL COMMENT '路径id',
  `parent_path` varchar(1000) NOT NULL COMMENT '父节点路径',
  `parent_path_id` varchar(1000) NOT NULL COMMENT '父节点路径id',
  `parent_id` varchar(50) NOT NULL COMMENT '父节点id',
  `parent_name` varchar(100) NOT NULL COMMENT '父节点名称',
  `parent_type_id` int(50) NOT NULL COMMENT '父节点类型id',
  `children` varchar(10000) DEFAULT NULL COMMENT '子节点',
  PRIMARY KEY (`id`),
  KEY `IX_path_id` (`path_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;


