CREATE TABLE `right_list` (
  `id` bigint(50) NOT NULL AUTO_INCREMENT,
  `right_id` bigint(50) NOT NULL COMMENT '权限id',
  `parent_right_id` bigint(50) DEFAULT NULL COMMENT '父级权限id',
  `right_name` varchar(64) NOT NULL COMMENT '权限名称',
  `description` varchar(200) DEFAULT NULL COMMENT '权限描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;