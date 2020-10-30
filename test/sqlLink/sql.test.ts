import { SqlLink } from '../../src/sql-link/sqlLink';
import config from '../../config';
import path = require('path');
import testSql from '../testSql';
const {
    describe,
    it,
    should,
    before
} = require('mocha');
const {
    expect
} = require('chai');
const sqlLink: SqlLink = new SqlLink({
    dbConfig: config.mysql,
    modelPath: path.join(__dirname, '../../', 'src', 'model'),
    test: true
});
const { Fn, Models, Page } = sqlLink
const { user } = Models;
describe('基本sql语句测试', () => {
    it('获取用户', () => {
        const userFindSql = user.select().query()
        expect(userFindSql).to.equal(testSql.queryAllUser);
    })
    it('新增用户', () => {
        const userAddSql = user.insert({
            userId: 'testid1',
            username: '测试用户1',
            password: '1231',
            passwordQes: '1231', 
            passwordAns: '1212',
            userTickName: '测试昵称',
            createTime: Fn.now(),
            lastLoginTime: Fn.now(),
            loginCount:0
        }).query()
        expect(userAddSql).to.equal(testSql.addUser);
    })
    it('修改用户', () => {
        const userUpdateSql = user.update({
            userId: 'testid1',
            username: '测试用户1更新'
        }).query()
        expect(userUpdateSql).to.equal(testSql.updateUser);
    })
    it('删除用户', () => {
        const userDeleteSql = user.delete().where({
            userId: 'testid1',
            username: '测试用户1更新'
        }).query()
        expect(userDeleteSql).to.equal(testSql.deleteUser);
    })
})
describe('select语句测试', () => {
    it('select静态字段外加分页数据', () => {
        let staticPageSelect = new Page(Models.project.select(),{
            order:{
                by:'modifyTime',
                type:'DESC'
            },
            limit:{
                size: 5,
                index: 1
            }
        }).query();
        expect(staticPageSelect).to.equal(testSql.staticPageSelect);
    })
    it('多表混合查询', () => {
        let tableMixSelect = new Page(Models.module.select().join({
            folderType: [
              (join: any) => join('folderType.id', 'id', { select: Fn.exclude(['id'])}),
              (join: any) => join('folderType.parentId', 'id', { select: Fn.exclude(['id'])})
            ],
            elementType: [
              (join: any) => join('elementType.id', 'id', { select: Fn.exclude(['id'])}),
              (join: any) => join('elementType.parentId', 'id', { select: Fn.exclude(['id'])})
            ]
          }).where({
            'module.parentPathId': '/0bc367f0ff6711e889c6bbbdf87fbcd6'
          }),
          {
            order: {
              by: 'modifyTime',
              type: 'DESC'
            },
            limit: {
              size: 5,
              index: 1
            }
          }).query();
        expect(tableMixSelect).to.equal(testSql.tableMixSelect);
    })
})
describe('update语句测试', () => {
    it('update模块', () => {
        let info = { "parentId": "5fdedfd0199711eba09b5d45e80c714e", "parentPath": "/测试项目/测项文件夹", "parentPathId": "/92fb3510198a11ebad5a0d78c6db1ce4/5fdedfd0199711eba09b5d45e80c714e", "parentTypeId": 1, "id": "8b49e37019c111eb9234db7047043503", "name": "测试文件夹2", "oldName": "", "description": "12313121", "typeId": 2, "moduleType": "0" }
        let updateModule = Models.module.update({ moduleName: info.name, description:info.description, typeId: info.typeId, modifyTime: Fn.now() }).where({
            'module.id': '8b49e37019c111eb9234db7047043503'
        }).query()
        expect(updateModule).to.equal(testSql.updateModule);
    })
    it('update模块后repalce', () => {
        let info = { "parentId": "5fdedfd0199711eba09b5d45e80c714e", "parentPath": "/测试项目/测项文件夹", "parentPathId": "/92fb3510198a11ebad5a0d78c6db1ce4/5fdedfd0199711eba09b5d45e80c714e", "parentTypeId": 1, "id": "8b49e37019c111eb9234db7047043503", "name": "测试文件夹2", "oldName": "", "description": "12313121", "typeId": 2, "moduleType": "0" }
        let updateModuleReplace = Models.module.update({
            path: Fn.replace(Models.module, 'path', info.oldName, info.name),
            parentPath: Fn.replace(Models.module, 'parentPath', info.oldName, info.name),
            parentName: Fn.replace(Models.module, 'parentName', info.oldName, info.name)
        }).where({
            'module.pathId': Fn.like('pathId', (item: any) => `'%${info.id}%'`)
        }).query()
        expect(updateModuleReplace).to.equal(testSql.updateModuleReplace);
    })
    
})
describe('where语句测试', () => {
    it('where指定Model名称', () => {
        const whereModelparse = user.select().where(
            {
                'user.username': '123', 
            }
        ).query()
        expect(whereModelparse).to.equal(testSql.whereModelNameDeclare);
    })
})
describe('join语句测试', () => {
    it('join名称', () => {
        const renameJoin = Models.module.select().join({
            folderType: [
               (join: any) =>  join('folderType.id', 'typeId', {
                    select: Fn.definition({
                        name: 'folderTypeName'
                    }),
                    _selectGroup: {
                        name: 'typeName',
                        condition: 'module_list.module_type=0',
                        field: 'name'
                    }
               }),
               (join: any) =>  join('folderType.id', 'parentTypeId', {
                    select: Fn.definition({
                        name: 'folderParentTypeName'
                    }),
                    _selectGroup: {
                        name: 'parentTypeName',
                        condition: 'module_list.module_type=0',
                        field: 'name'
                    }
                })
            ],
            elementType: [
                (join: any) =>  join('elementType.id', 'typeId', {
                    select: Fn.definition({
                        name: 'elementTypeName'
                    }),
                    _selectGroup: {
                        name: 'typeName',
                        condition: 'module_list.module_type=1',
                        field: 'name'
                    }
                }),
                (join: any) =>  join('elementType.id', 'parentTypeId', {
                    select: Fn.definition({
                        name: 'elementParentTypeName'
                    }),
                    _selectGroup: {
                        name: 'parentTypeName',
                        condition: 'module_list.module_type=1',
                        field: 'name'
                    }
                })
            ]
          }).where({
            'module.pathId': '/111'
          }).query()
        expect(renameJoin).to.equal(testSql.renameJoin);
    })
    it('join不同表', () => {
        const getUserRights = Models.userRoleRelation.select({}).join({
            roleRightRelation: 
               (join: any) =>  join('roleRightRelation.roleId', 'userRoleRelation.roleId', {
                    select: Fn.definition({
                        roleId: 'roleId'
                    })
               })
            ,
            right: 
                (join: any) =>  join('right.rightId', 'roleRightRelation.rightId', {
                    select: Fn.definition({
                        rightId:'rightId',
                        rightName: 'rightName',
                        path: 'pagePath'
                    })
                })
            ,
            role: 
                (join: any) =>  join('role.roleId', 'userRoleRelation.roleId', {
                    select: Fn.definition({
                        roleName: 'roleName'
                    })
                })
          }).where({
            'userId': '7c3ae1e0cfa411e8aa3a6918e4f6bbab'
          }).query()
        expect(getUserRights).to.equal(testSql.getUserRights);
    })
})