CREATE TABLE `role_right_relation` (
  `id` bigint(50) NOT NULL,
  `relation_id` varchar(64) NOT NULL COMMENT '角色权限关联记录id',
  `role_id` bigint(50) NOT NULL COMMENT '角色id',
  `right_id` bigint(50) NOT NULL COMMENT '权限id',
  `right_type` int(11) NOT NULL DEFAULT '0' COMMENT '权限类型（0:可访问，1:可授权）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;