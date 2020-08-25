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
    public static getRightList(searchData: IGetRightListParams) {
        return new Promise(async (resolve, reject) => {
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
            right.query().then((results: any) => {
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
     * 获取拥有权限的角色
     */
    public static getRoleByRight(searchData: any) {
        return new Promise(async (resolve, reject) => {
            //数据库查找用户
            let { rightId } = searchData;
            //let createTimeArr = (createTime === '') ? [] : createTime.split(',');
            let roleList = Models.roleRightRelation.select().join({
                role: [
                    {
                        s: 'roleId',
                        t: 'roleId',
                        select: Fn.definition({
                            roleName: 'roleName'
                        })
                    }
                ]
            }).where({
                rightId
            }).query().then((results: any) => {
                let list = results;
                let ret = {
                    list
                };
                resolve(ret);
            }).catch((e: Error) => {
                reject(e);
            })
        });
    }
    /**
     * 新增权限
     */
    public static addRight(rightInfo: any) {
        return new Promise(async (resolve, reject) => {
            let {rightName, description} = rightInfo;
            let rightId = IdUtils.getUuidV1()
            Models.right.insert({
                rightId,
                parentRightId: rightId,
                rightName,
                createTime: Fn.now(),
                modifyTime: Fn.now(),
                description
            }).query().then((res: any) => {
                resolve({rightId});
            }).catch((err: Error) => {
                reject(err);
            })
        });
    }
    /**
     * 更新权限
     */
    public static updateRight(rightInfo: any) {
        return new Promise(async (resolve, reject) => {
            let {rightName, rightId, description} = rightInfo;
            Models.right.update({
                rightName,
                description
            }).where({
                'right.rightId': rightId
            }).query().then((res: any) => {
                resolve(res);
            }).catch((err: Error) => {
                reject(err);
            })
        });
    }
     /**
     * 删除权限
     */
    public static deleteRight(rightInfo: any) {
        return new Promise(async (resolve, reject) => {
            let { rightId } = rightInfo;
            Models.right.delete().where({
                'right.rightId': rightId
            }).query().then((res: any) => {
                resolve(res);
            }).catch((err: Error) => {
                reject(err);
            })
        });
    }
    /**
     * 验证权限是否存在
     */
    public static checkRightExist(rightInfo: any, type: string) {
        return new Promise(async (resolve, reject) => {
            let {rightName, rightId} = rightInfo;
            if (type == 'new') {
                Models.right.select().where(
                    {
                        'right.rightName': rightName
                    }
                ).query().then((res: any) => {
                    resolve(res);
                }).catch((err: any) => {
                    reject(err);
                })
            } else {
                Models.right.select().where(
                    {
                        'right.rightName': rightName
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
     * 修改角色权限
     */
    public static changeRoleRight(changeInfo: any) {
        return new Promise(async (resolve, reject) => {
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
                Promise.all(promiseList).then((res) => {
                    resolve({ success: true, message: '修改权限角色成功'});
                }).catch(err => {
                    resolve({ success: false, message: '修改权限角色失败'});
                })
            } else {
                resolve({ success: false, message: '参数异常'});
            }
        })  
    }
}
