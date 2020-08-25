export default {
    queryAllUser: `SELECT user_list.username AS username,user_list.password AS password,user_list.user_id AS userId,user_list.password_qes AS passwordQes,user_list.password_ans AS passwordAns,user_list.user_tick_name AS userTickName,user_list.create_time AS createTime,user_list.last_login_time AS lastLoginTime,user_list.login_count AS loginCount,user_list.head_sculpture AS headSculpture,user_list.status AS status FROM user_list`,
    addUser: `INSERT INTO user_list(username,password,user_id,password_qes,password_ans,user_tick_name,create_time,last_login_time,login_count,head_sculpture,status) VALUES('测试用户1','1231','testid1','1231','1212','测试昵称',NOW(),NOW(),'0','','')`,
    updateUser: `UPDATE user_list SET user_id = 'testid1',username = '测试用户1更新'`,
    deleteUser: `DELETE FROM user_list WHERE user_list.user_id='testid1' AND user_list.username='测试用户1更新'`
};
