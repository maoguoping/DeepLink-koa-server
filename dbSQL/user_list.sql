CREATE TABLE `user_list` (
  `id` bigint(50) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) NOT NULL COMMENT '平台用户id',
  `username` varchar(64) NOT NULL COMMENT '用户账号名称',
  `password` varchar(64) NOT NULL COMMENT '用户密码',
  `password_qes` varchar(64) NOT NULL COMMENT '用户密保问题',
  `password_ans` varchar(100) NOT NULL COMMENT '用户密码答案',
  `user_tick_name` varchar(64) DEFAULT NULL COMMENT '用户昵称',
  `create_time` datetime NOT NULL COMMENT '用户创建时间',
  `last_login_time` datetime DEFAULT NULL COMMENT '用户上次登录时间',
  `head_sculpture` varchar(512) DEFAULT NULL COMMENT '用户头像',
  `login_count` bigint(64) DEFAULT '0' COMMENT '用户登录次数',
  `status` varchar(64) DEFAULT NULL COMMENT '用户状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;