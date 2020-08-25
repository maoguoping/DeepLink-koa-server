--模块类型列表初始化
CREATE TABLE `folder_type_dic` (
  `id` bigint(50) NOT NULL COMMENT '主键id',
`folder_type_id` int(50) NOT NULL COMMENT '文件夹类型id',
`folder_type_name` varchar(100) NOT NULL COMMENT '文件夹类型名称',
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
