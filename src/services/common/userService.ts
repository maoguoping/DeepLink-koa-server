import sqlLink from '../../model';
import IdUtils from '../../utils/idUtil';
import { AliRam }  from '../../aliyun/aliYun';
import * as User from '../../model/user'
const { Models, Fn, Page } = sqlLink;
export default class UserService {
    /**
     * 登录
     */
    public static login(username: string, password: string) {
        return new Promise(async (resolve, reject) => {
            //数据库查找用户
            try {
                let ret = null;
                let serviceRes = await UserService.getUserListByUserName(username);
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
                resolve(ret);
            } catch (e) {
                reject(e)
            }
        });
    }

    /**
     * 登录更新记录
     */
    public static loginRecord(userId: string) {
        return new Promise((resolve, reject) => {
            Models.user.update({
                lastLoginTime:Fn.now(),
                loginCount:Fn.add(1)
            }).where({
              'user.userId': userId
            }).query().then((results: any) => {
                resolve(true)
            }).catch((e: Error) => {
                reject(e)
            })
        })
    }

    /**
     * 用户注册
     * @param registerInfo
     */
    public static register(registerInfo: any) {
        return new Promise(async (resolve, reject) => {

            //数据库查找用户
            try {
                let ret = null;
                let serviceRes = await UserService.getUserListByUserName(registerInfo.username);
                if (serviceRes.length > 0) {
                    //用户已被注册
                    ret = {
                        success: true,
                        registerSuccess: false,
                        message: '用户已被注册'
                    };
                    resolve(ret);
                } else {
                    let {username, password,passwordQes, passwordAns,userTickName} = registerInfo;
                    let userId = IdUtils.getUuidV1();
                    Models.user.insert({
                        userId, username, password,passwordQes, passwordAns,userTickName,
                        createTime:Fn.now(),
                        lastLoginTime: Fn.now(),
                        loginCount:0
                    }).query().then(async (result: any)=>{
                        let ret = {
                            success: true,
                            registerSuccess: true,
                            message: `创建用户${username}登录记录成功！`
                        };
                        await UserService.addUserRoleRelation([{
                            userId,
                            roleId: 1
                        }]);
                        resolve(ret);
                    }).catch((e: Error)=>{
                        reject(e);
                    })
                }
            } catch (err) {
                reject(err)
            }
        })
    }

    /**
     * 通过用户名获取用户列表
     */
    public static getUserListByUserName(username: string) {
        return new Promise<User.User[]>((resolve, reject) => {
            try {
                Models.userRoleRelation.select(
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
                  }).query().then((results: any)=>{
                    let ret: User.User[] = [];
                    if (results.length > 0) {
                        ret = results
                    }
                    resolve(ret);
                  }).catch((e: Error)=>{
                      console.log(e);
                      reject(e)
                  })
            } catch (e) {
                console.log(e);
                reject(e)
            }
            
        })
    }

    /**
     * 通过用户名获取用户列表
     */
    public static getUserListByUserId(userId: string) {
        return new Promise((resolve, reject) => {
            Models.userRoleRelation.select(
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
            }).query().then((results: any)=>{
                let ret =null;
                if (results.length > 0) {
                    ret = {success: true, userList:results,}
                } else {
                    ret = {success: true, userList: []};
                }
                resolve(ret);
            }).catch((e: Error)=>{
                console.log(e);
                reject(e)
            })
        })
    }

    /**
     *  添加用户角色
     */
    public static addUserRoleRelation(addList: any[]) {
        return new Promise((resolve, reject) => {
                let list = [];
                list = addList.map(item => {
                    item.relationId = IdUtils.getUuidV1();
                    return item;
                });
                Models.userRoleRelation.insert(list).query().then((result: any)=>{
                  let ret = {success: true, message: '添加用户角色成功！'};
                  resolve(ret);
                }).catch((e: Error)=>{
                  reject(e);
                })
        })
    }

    /**
     *  获取角色列表
     * @return {Promise<any>}
     */
    public static getRoleDic() {
        return new Promise((resolve, reject) => {
            Models.role.select().query().then((results: any) => {
                results = results.map((item: any) => {
                    return {
                        id: item.roleId,
                        name: item.roleName
                    }
                });
                let ret = {success: true, data: results};
                resolve(ret)
            }).catch((e: Error) => {
                reject(e)
            })
        })
    }

    /**
     *  修改用户名称
     */
    public static updateName(userId: string, username: string, userTickName: string) {
        return new Promise((resolve, reject) => {
            Models.user.update({
                username,
                userTickName
            }).where({
              'user.userId': userId
            }).query().then((results: any) => {
                resolve(true)
            }).catch((e: Error) => {
                reject(e)
            })
        })
    }

    /**
     *  修改用户角色
     */
    public static updateRole(userId: string, roleId: string) {
        return new Promise((resolve, reject) => {
          Models.userRoleRelation.update({
            roleId
          }).where({
            'user.userId': userId
          }).query().then((reslut: any)=>{
              resolve(true);
          }).catch((e: Error)=>{
              reject(e)
          })
        })
    }

    /**
     *  修改阿里云ram用户角色信息
     */
    public static updateAliYunUser(username:  string,newUsername: string,userTickName: string) {
        return new Promise((resolve, reject) => {
            let aliyunRam = new AliRam();
            aliyunRam.updaterUser({username, userTickName, newUsername}).then((res) => {
                resolve(true);
            }).catch(err => {
                reject(err);
            })
        })
    }
    /**
     * 数据过滤
     */
    public static userFilter(user: any){
        let {username,userId,userTickName,status,roleId,roleName,createTime,lastLoginTime,loginCount,headSculpture} = user;
        return {username,userId,userTickName,status,roleId,roleName,createTime,lastLoginTime,loginCount,headSculpture};
    }
}