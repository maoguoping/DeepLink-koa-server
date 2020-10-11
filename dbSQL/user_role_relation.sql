CREATE TABLE `user_role_relation` (
  `id` bigint(50) NOT NULL AUTO_INCREMENT,
  `relation_id` varchar(64) NOT NULL COMMENT '用户角色管理关联id',
  `user_id` varchar(64) NOT NULL COMMENT '用户id',
  `role_id` bigint(50) NOT NULL COMMENT '角色id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;