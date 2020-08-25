CREATE TABLE `role_list` (
  `id` bigint(50) NOT NULL AUTO_INCREMENT,
  `role_id` bigint(50) NOT NULL COMMENT '角色id',
  `parent_role_id` bigint(50) DEFAULT NULL COMMENT '父级角色id',
  `role_name` varchar(64) NOT NULL COMMENT '角色名称',
  `create_time` datetime NOT NULL COMMENT '角色创建时间',
  `description` varchar(200) DEFAULT NULL COMMENT '角色描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
