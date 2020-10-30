import { update } from "lodash";

export default {
    queryAllUser: `SELECT user_list.username AS username,user_list.password AS password,user_list.user_id AS userId,user_list.password_qes AS passwordQes,user_list.password_ans AS passwordAns,user_list.user_tick_name AS userTickName,user_list.create_time AS createTime,user_list.last_login_time AS lastLoginTime,user_list.login_count AS loginCount,user_list.head_sculpture AS headSculpture,user_list.status AS status FROM user_list`,
    addUser: `INSERT INTO user_list(username,password,user_id,password_qes,password_ans,user_tick_name,create_time,last_login_time,login_count,head_sculpture,status) VALUES('测试用户1','1231','testid1','1231','1212','测试昵称',NOW(),NOW(),'0','','')`,
    updateUser: `UPDATE user_list SET user_id = 'testid1',username = '测试用户1更新'`,
    deleteUser: `DELETE FROM user_list WHERE user_list.user_id='testid1' AND user_list.username='测试用户1更新'`,
    whereModelNameDeclare: `SELECT user_list.username AS username,user_list.password AS password,user_list.user_id AS userId,user_list.password_qes AS passwordQes,user_list.password_ans AS passwordAns,user_list.user_tick_name AS userTickName,user_list.create_time AS createTime,user_list.last_login_time AS lastLoginTime,user_list.login_count AS loginCount,user_list.head_sculpture AS headSculpture,user_list.status AS status FROM user_list WHERE user_list.username='123'`,
    renameJoin: `SELECT module_list.module_id AS id,module_list.module_name AS name,module_list.module_type AS moduleType,module_list.module_type_id AS typeId,module_list.tag AS tag,module_list.module_description AS description,module_list.create_time AS createTime,module_list.modify_time AS modifyTime,module_list.path AS path,module_list.path_id AS pathId,module_list.parent_id AS parentId,module_list.parent_name AS parentName,module_list.parent_type_id AS parentTypeId,module_list.parent_path AS parentPath,module_list.parent_path_id AS parentPathId,module_list.children AS children,CASE WHEN module_list.module_type=0 THEN a.folder_type_name WHEN module_list.module_type=1 THEN c.element_type_name  END 'typeName',CASE WHEN module_list.module_type=0 THEN b.folder_type_name WHEN module_list.module_type=1 THEN d.element_type_name  END 'parentTypeName' FROM module_list LEFT JOIN folder_type_dic a ON a.folder_type_id=module_list.module_type_id LEFT JOIN folder_type_dic b ON b.folder_type_id=module_list.parent_type_id LEFT JOIN element_type_dic c ON c.element_type_id=module_list.module_type_id LEFT JOIN element_type_dic d ON d.element_type_id=module_list.parent_type_id WHERE module_list.path_id='/111'`,
    getUserRights:`SELECT a.role_id AS roleId,b.right_id AS rightId,b.right_name AS rightName,b.path AS pagePath,c.role_name AS roleName FROM user_role_relation LEFT JOIN role_right_relation a ON a.role_id=user_role_relation.role_id LEFT JOIN right_list b ON b.right_id=a.right_id LEFT JOIN role_list c ON c.role_id=user_role_relation.role_id WHERE user_role_relation.user_id='7c3ae1e0cfa411e8aa3a6918e4f6bbab'`,
    staticPageSelect: `SELECT SQL_CALC_FOUND_ROWS  project_list.project_id AS id,project_list.project_name AS name,project_list.project_description AS description,project_list.create_time AS createTime,project_list.modify_time AS modifyTime,project_list.path AS path,project_list.path_id AS pathId,project_list.tag AS tag,project_list.children AS children,'project' AS type,0 AS typeId FROM project_list   ORDER BY project_list.modify_time DESC LIMIT 0,5;SELECT FOUND_ROWS() as total`,
    tableMixSelect: `SELECT SQL_CALC_FOUND_ROWS  module_list.module_id AS id,module_list.module_name AS moduleName,module_list.module_type AS moduleType,module_list.module_type_id AS typeId,module_list.tag AS tag,module_list.module_description AS description,module_list.create_time AS createTime,module_list.modify_time AS modifyTime,module_list.path AS path,module_list.path_id AS pathId,module_list.parent_id AS parentId,module_list.parent_name AS parentName,module_list.parent_type_id AS parentTypeId,module_list.parent_path AS parentPath,module_list.parent_path_id AS parentPathId,module_list.children AS children,a.folder_parent_type_id AS parentId,a.folder_type_name AS name,b.folder_parent_type_id AS parentId,b.folder_type_name AS name,c.element_parent_type_id AS parentId,c.element_type_name AS name,d.element_parent_type_id AS parentId,d.element_type_name AS name FROM module_list  LEFT JOIN folder_type_dic a ON a.folder_type_id=module_list.module_id LEFT JOIN folder_type_dic b ON b.folder_parent_type_id=module_list.module_id LEFT JOIN element_type_dic c ON c.element_type_id=module_list.module_id LEFT JOIN element_type_dic d ON d.element_parent_type_id=module_list.module_id  WHERE module_list.parent_path_id='/0bc367f0ff6711e889c6bbbdf87fbcd6' ORDER BY module_list.modify_time DESC LIMIT 0,5;SELECT FOUND_ROWS() as total`,
    updateModule: `UPDATE module_list SET module_name = '测试文件夹2',module_description = '12313121',module_type_id = '2',modify_time = NOW() WHERE module_list.module_id='8b49e37019c111eb9234db7047043503'`,
    updateModuleReplace: `UPDATE module_list SET path = REPLACE(path,  '', '测试文件夹2'),parent_path = REPLACE(parent_path,  '', '测试文件夹2'),parent_name = REPLACE(parent_name,  '', '测试文件夹2') WHERE module_list.path_id LIKE '%8b49e37019c111eb9234db7047043503%'`
};
