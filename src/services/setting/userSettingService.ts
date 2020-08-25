import UserService from '../common/userService';
import sqlLink from '../../model';
import { IGetUserListParams } from '../../typings/service'

const { Models, Fn, Page } = sqlLink;
export default class UserSettingService {
    /**
     * 获取用户列表
     */
    public static getUserList(searchData: IGetUserListParams) {
        return new Promise(async (resolve, reject) => {
            //数据库查找用户
            let {username, userId, userTickName, roleId, createTime, lastLoginTime, orderName, orderType, index, pageSize} = searchData;
            let roleIdArr = (roleId === '') ? [] : roleId.split(',');
            let createTimeArr = (createTime === '') ? [] : createTime.split(',');
            let lastLoginTimeArr = (lastLoginTime === '') ? [] : lastLoginTime.split(',');
            let page = new Page(Models.userRoleRelation.select().join({
                user: [
                    {
                        s: 'userId',
                        t: 'userId',
                        select: Fn.exclude(['userId'])
                    }
                ],
                role: [
                    {
                        s: 'roleId',
                        t: 'roleId',
                        select: Fn.exclude(['roleId'])
                    }
                ]
            }).where({
                'user.username': Fn.equalEmptyAll(username, Fn.like(username, () => `'%${username}%'`)),
                'user.userId': Fn.equalEmptyAll(userId, Fn.like(userId, () => `'%${userId}%'`)),
                'user.userTickName': Fn.equalEmptyAll(userTickName, Fn.like(userTickName, () => `'%${userTickName}%'`)),
                'user.roleId': Fn.equalEmptyAll(roleIdArr),
                'user.createTime': Fn.equalEmptyAll(createTimeArr, Fn.between(createTimeArr)),
                'user.lastLoginTime': Fn.equalEmptyAll(lastLoginTimeArr, Fn.between(lastLoginTimeArr))
            }), {
                order: {
                    by: orderName,
                    type: orderType
                },
                limit: {
                    size: pageSize,
                    index
                }
            });
            page.query().then((results: any) => {
                console.log(results)
                let userList = results[0];
                let total = results[1][0].total;
                let ret = {
                    success: true, data: {
                        userList,
                        total,
                        pageSize: pageSize,
                        page: index
                    }
                };
                resolve(ret);
            }).catch((e: Error) => {
                console.error(e)
                reject(e);
            })
        });
    }

    /**
     * 修改用户信息
     */
    public static saveUserInfo(userInfo: any) {
        return new Promise(async (resolve, reject) => {
            try {
                let {userId, username, userTickName, roleId} = userInfo;
                let userInfoRes: any = await UserService.getUserListByUserId(userId);
                let userInfoDb = userInfoRes.userList[0];
                let usernameSrc = userInfoDb.username;
                await UserService.updateAliYunUser(usernameSrc, username, userTickName);
                await UserService.updateName(userId, username, userTickName);
                await UserService.updateRole(userId, roleId);
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 登录
     * @param {String} username 用户名
     * @param {String} password 用户密码
     * @return {Promise<any>}
     */
    static login(username: string, password: string) {
        return new Promise(async (resolve, reject) => {
            //数据库查找用户
            try {
                let ret = null;
                let serviceRes: any = await UserService.getUserListByUserName(username);
                if (serviceRes.userList.length > 0) {
                    let user = serviceRes.userList[0];
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
     * 通过用户名获取用户列表
     * @param username
     * @return {Promise<any>}
     */
    static getUserListByUserName(username: string) {
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
            }).where([{
              name:'user.username',
              equal:username
            }]).query().then((results: any)=>{
                let ret =null;
              if (results.length > 0) {
                  ret = {success: true, userList:results,}
              } else {
                  ret = {success: true, userList: []};
              }
              resolve(ret);
            }).catch((e: any)=>{
                reject(e)
            })
        })
    }
}