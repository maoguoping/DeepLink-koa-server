/*项目服务模块*/
import UserService from '../common/userService';
import IdUtils from '../../utils/idUtil';
import sqlLink from '../../model';
import { IGetRoleListParams } from '../../typings/service'
const { Models, Fn, Page } = sqlLink;

export default class RoleSettingService {
    // 构造
    constructor() {
    }
    /**
     * 获取角色列表
     */
    public static getRoleList(searchData: IGetRoleListParams) {
        return new Promise(async (resolve, reject) => {
            //数据库查找用户
            let {roleName, roleId, orderName, orderType, index, pageSize} = searchData;
            //let createTimeArr = (createTime === '') ? [] : createTime.split(',');
            let page = new Page(Models.role.select().where({
                roleName: Fn.equalEmptyAll(roleName, Models.role, Fn.like(roleName, () => `'%${roleName}%'`)),
                roleId: Fn.equalEmptyAll(roleId, Models.role, Fn.like(roleId, () => `'%${roleId}%'`)),
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
                let list = results[0];
                let total = results[1][0].total;
                let ret = {
                    success: true, data: {
                        list,
                        total,
                        pageSize: pageSize,
                        page: index
                    }
                };
                resolve(ret);
            }).catch((e: Error) => {
                reject(e);
            })
        });
    }
    /**
     * 验证角色是否存在
     */
    public static checkRoleExist(roleInfo: any, type: string) {
        return new Promise(async (resolve, reject) => {
            let {roleName, roleId} = roleInfo;
            if (type == 'new') {
                Models.role.select().where(
                    Fn.or([
                        {roleId},
                        {roleName}
                    ])
                ).query().then((res: any) => {
                    resolve(res);
                }).catch((err: Error) => {
                    reject(err);
                })
            } else {
                Models.role.select().where(
                    {
                        'role.roleName': roleName,
                        'role.roleId': Fn.unEqual(roleId)
                    }
                ).query().then((res: any) => {
                    resolve(res);
                }).catch((err: Error) => {
                    reject(err);
                })
            }
        });
    }

    /**
     * 新增角色
     */
    public static addRole(roleInfo: any) {
        return new Promise(async (resolve, reject) => {
            let {roleName, roleId, description} = roleInfo;
            Models.role.insert({
                roleId,
                parentRoleId: 1,
                roleName,
                createTime: Fn.now(),
                description
            }).query().then((res: any) => {
                resolve(res);
            }).catch((err: Error) => {
                reject(err);
            })
        });
    }

    /**
     * 更新角色
     */
    public static updateRole(roleInfo: any) {
        return new Promise(async (resolve, reject) => {
            let {roleName, roleId, description} = roleInfo;
            Models.role.update({
                roleName,
                description
            }).where({
                'role.roleId': roleId
            }).query().then((res: any) => {
                resolve(res);
            }).catch((err: Error) => {
                reject(err);
            })
        });
    }
}
