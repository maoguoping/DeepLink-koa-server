/*项目服务模块*/
import UserService from '../common/userService';
import IdUtils from '../../utils/idUtil';
import sqlLink from '../../model';
import { Fn, Page } from '../../sql-link'
import { IGetRoleListParams } from '../../typings/service'
const { Models } = sqlLink;

export default class RoleSettingService {
    // 构造
    constructor() {
    }
    /**
     * 获取角色列表
     */
    public static async getRoleList(searchData: IGetRoleListParams) {
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
        let results: any = await page.query()
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
        return ret
    }
    /**
     * 验证角色是否存在
     */
    public static async checkRoleExist(roleInfo: any, type: string) {
        let {roleName, roleId} = roleInfo;
        if (type == 'new') {
            return await Models.role.select().where(
                Fn.or([
                    {roleId},
                    {roleName}
                ])
            ).query()
        } else {
            return await Models.role.select().where(
                {
                    'role.roleName': roleName,
                    'role.roleId': Fn.unEqual(roleId)
                }
            ).query()
        }
    }

    /**
     * 新增角色
     */
    public static async addRole(roleInfo: any) {
        let {roleName, roleId, description} = roleInfo;
        return await Models.role.insert({
            roleId,
            parentRoleId: 1,
            roleName,
            createTime: Fn.now(),
            description
        }).query()
    }

    /**
     * 更新角色
     */
    public static async updateRole(roleInfo: any) {
        let {roleName, roleId, description} = roleInfo;
        return await Models.role.update({
            roleName,
            description
        }).where({
            'role.roleId': roleId
        }).query()
    }
}
