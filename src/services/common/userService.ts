import sqlLink from '../../model';
import IdUtils from '../../utils/idUtil';
import { AliRam }  from '../../aliyun/aliYun';
import * as User from '../../model/user'
const { Models, Fn, Page } = sqlLink;
export default class UserService {
    /**
     * 登录
     */
    public static async login(username: string, password: string) {
        //数据库查找用户
        try {
            let ret = null;
            let serviceRes: any = await UserService.getUserListByUserName(username);
            if (serviceRes.length > 0) {
                let user = serviceRes[0];
                if (user.password != password) {
                    ret = {success: false, message: '密码错误！'};
                } else {
                    let loginRecordRes = await UserService.loginRecord(user.userId);
                    if(loginRecordRes){
                        ret = {success: true, message: '登录成功！'};
                    }else {
                        ret = {success: true, message: '登录记录失败！'};
                    }
                }
            } else {
                ret = {success: false, message: '用户不存在！'};
            }
            return ret
        } catch (e) {
            throw new Error(e);   
        }
    }

    /**
     * 登录更新记录
     */
    public static async loginRecord(userId: string) {
        await Models.user.update({
            lastLoginTime:Fn.now(),
            loginCount:Fn.add(1)
        }).where({
          'user.userId': userId
        }).query()
        return true
    }

    /**
     * 用户注册
     * @param registerInfo
     */
    public static async register(registerInfo: any) {
        //数据库查找用户
        try {
            let ret = null;
            let serviceRes: any = await UserService.getUserListByUserName(registerInfo.username);
            if (serviceRes.length > 0) {
                //用户已被注册
                ret = {
                    success: true,
                    registerSuccess: false,
                    message: '用户已被注册'
                };
                return ret
            } else {
                let {username, password,passwordQes, passwordAns,userTickName} = registerInfo;
                let userId = IdUtils.getUuidV1();
                try {
                    await Models.user.insert({
                        userId, username, password,passwordQes, passwordAns,userTickName,
                        createTime:Fn.now(),
                        lastLoginTime: Fn.now(),
                        loginCount:0
                    }).query()
                    let ret = {
                        success: true,
                        registerSuccess: true,
                        message: `创建用户${username}登录记录成功！`
                    };
                    await UserService.addUserRoleRelation([{
                        userId,
                        roleId: 1
                    }]);
                    return ret
                } catch (e) {
                    return {
                        success: false,
                        registerSuccess: false,
                        message: `创建用户${username}登录记录失败！`
                    };
                }  
            }
        } catch (err) {
            throw new Error(err); 
        }
    }

    /**
     * 通过用户名获取用户列表
     */
    public static async getUserListByUserName(username: string) {
        try {
            let results = await Models.userRoleRelation.select(
                Fn.exclude(['userId','roleId'])
            ).join({
                user:{
                s:'userId',
                t:'userId'
                },
                role:{
                s:'roleId',
                t:'roleId'
                }
            }).where({
            'user.username': username
            }).query()
            let ret: User.User[] = [];
            if (results.length > 0) {
                ret = results
            }
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    }

    /**
     * 通过用户名获取用户列表
     */
    public static async getUserListByUserId(userId: string) {
        let results = await Models.userRoleRelation.select(
            Fn.exclude(['userId','roleId'])
        ).join({
            user:{
                s:'userId',
                t:'userId'
            },
            role:{
                s:'roleId',
                t:'roleId'
            }
        }).where({
            'user.userId': userId
        }).query()
        let ret =null;
        if (results.length > 0) {
            ret = {success: true, userList:results,}
        } else {
            ret = {success: true, userList: []};
        }
        return ret
    }

    /**
     *  添加用户角色
     */
    public static async addUserRoleRelation(addList: any[]) {
        try {
            let list = [];
            list = addList.map(item => {
                item.relationId = IdUtils.getUuidV1();
                return item;
            });
            await Models.userRoleRelation.insert(list).query()
            return {success: true, message: '添加用户角色成功！'};
        } catch (e) {
            return {success: false, message: '添加用户角色失败！'};
        }     
    }

    /**
     *  获取角色列表
     * @return {Promise<any>}
     */
    public static async getRoleDic() {
        let results = await Models.role.select().query()
        results = results.map((item: any) => {
            return {
                id: item.roleId,
                name: item.roleName
            }
        });
        return {success: true, data: results};
    }

    /**
     *  修改用户名称
     */
    public static async updateName(userId: string, username: string, userTickName: string) {
        await Models.user.update({
            username,
            userTickName
        }).where({
          'user.userId': userId
        }).query()
        return true
    }

    /**
     *  修改用户角色
     */
    public static async updateRole(userId: string, roleId: string) {
        await Models.userRoleRelation.update({
            roleId
        }).where({
            'user.userId': userId
        }).query()
        return true
    }

    /**
     *  修改阿里云ram用户角色信息
     */
    public static async updateAliYunUser(username:  string,newUsername: string,userTickName: string) {
        let aliyunRam = new AliRam();
        await aliyunRam.updaterUser({username, userTickName, newUsername})
        return true
    }
    /**
     * 数据过滤
     */
    public static userFilter(user: any){
        let {username,userId,userTickName,status,roleId,roleName,createTime,lastLoginTime,loginCount,headSculpture} = user;
        return {username,userId,userTickName,status,roleId,roleName,createTime,lastLoginTime,loginCount,headSculpture};
    }
}