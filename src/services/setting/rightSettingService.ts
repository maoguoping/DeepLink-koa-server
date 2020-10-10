/*项目服务模块*/
import UserService from '../common/userService';
import IdUtils from '../../utils/idUtil';
import sqlLink from '../../model';
import { IGetRightListParams } from '../../typings/service'
const { Models, Fn, Page } = sqlLink;
export default class RightSettingService {
    // 构造
    constructor() {
    }
    /**
     * 获取权限列表
     */
    public static async getRightList(searchData: IGetRightListParams) {
        //数据库查找用户
        let {rightName, rightId, orderName, orderType, index, pageSize} = searchData;
        //let createTimeArr = (createTime === '') ? [] : createTime.split(',');
        let right = new Page(Models.right.select().where({
            rightName: Fn.equalEmptyAll(rightName, Models.right, Fn.like(rightName, () => `'%${rightName}%'`)),
            rightId: Fn.equalEmptyAll(rightId, Models.right, Fn.like(rightId, () => `'%${rightId}%'`)),
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
        let results: any = await right.query()
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
     * 获取拥有权限的角色
     */
    public static async getRoleByRight(searchData: any) {
        //数据库查找用户
        let { rightId } = searchData;
        //let createTimeArr = (createTime === '') ? [] : createTime.split(',');
        let results = await Models.roleRightRelation.select().join({
            role: (join: any) => join('roleId', 'roleId', {
                select: Fn.definition({
                    roleName: 'roleName'
                })
            })
        }).where({
            rightId
        }).query()
        let list = results;
        let ret = {
            list
        };
        return ret
    }
    /**
     * 新增权限
     */
    public static async addRight(rightInfo: any) {
        let {rightName, description} = rightInfo;
        let rightId = IdUtils.getUuidV1()
        await Models.right.insert({
            rightId,
            parentRightId: rightId,
            rightName,
            createTime: Fn.now(),
            modifyTime: Fn.now(),
            description
        }).query()
        return {rightId}
    }
    /**
     * 更新权限
     */
    public static async updateRight(rightInfo: any) {
        let {rightName, rightId, description} = rightInfo;
        let res = await Models.right.update({
            rightName,
            description
        }).where({
            'right.rightId': rightId
        }).query()
        return res
    }
     /**
     * 删除权限
     */
    public static async deleteRight(rightInfo: any) {
        let { rightId } = rightInfo;
        let res = await Models.right.delete().where({
            'right.rightId': rightId
        }).query()
        return res
    }
    /**
     * 验证权限是否存在
     */
    public static async checkRightExist(rightInfo: any, type: string) {
        let {rightName, rightId} = rightInfo;
        if (type == 'new') {
            return await Models.right.select().where(
                {
                    'right.rightName': rightName
                }
            ).query()
        } else {
            return await Models.right.select().where(
                {
                    'right.rightName': rightName
                }
            ).query()
        }
    }
    /**
     * 修改角色权限
     */
    public static async changeRoleRight(changeInfo: any) {
        let { rightId, addRoleIds, deleteRoleIds } = changeInfo;
        let addRoleIdArr = addRoleIds === "" ? [] : addRoleIds.split(',');
        let deleteRoleArr = deleteRoleIds === "" ? [] : deleteRoleIds.split(',');
        let addRoleParams: any[] = [];
        let delRoleParams = [];
        let promiseList = [];
        if (addRoleIdArr.length > 0) {
            addRoleParams = addRoleIdArr.map((id: string) => ({
                relationId: IdUtils.getUuidV1(),
                roleId: parseInt(id),
                rightId,
                rightType: 0
            }));
            promiseList.push(new Promise((resolveAdd, rejectAdd) => {
                Models.roleRightRelation.insert(addRoleParams).query().then((res: any) => {
                    resolveAdd(res);
                }).catch((err: Error) => {
                    rejectAdd(err);
                })
            }))
        }
        if (deleteRoleArr.length > 0) {
            deleteRoleArr.forEach((id: any) => {
                id = parseInt(id)
            });
            promiseList.push(new Promise((resolveDel, rejectDel) => {
                Models.roleRightRelation.delete().where({
                    rightId,
                    roleId: Fn.in(deleteRoleArr)
                }).query().then((res: any) => {
                    resolveDel(res);
                }).catch((err: Error) => {
                    rejectDel(err);
                })
            }))
        }
        if (promiseList.length > 0) {
            try {
                await Promise.all(promiseList)
                return { success: false, message: '修改权限角色成功'}
            } catch (err) {
                return { success: false, message: '修改权限角色失败'}
            }
        } else {
            return { success: false, message: '参数异常'};
        } 
    }
}
