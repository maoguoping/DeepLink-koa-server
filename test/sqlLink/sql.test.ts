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
    modelPath: path.join(__dirname, '../../', 'src','model'),
    test: true
});
const { Fn, Models } = sqlLink
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
               (join: any) =>  join('typeId', 'id', {
                    select: Fn.definition({
                        name: 'folderTypeName'
                    }),
                    _selectGroup: {
                        name: 'typeName',
                        condition: 'module_list.module_type=0',
                        field: 'name'
                    }
               }),
               (join: any) =>  join('parentTypeId', 'id', {
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
                (join: any) =>  join('typeId', 'id', {
                    select: Fn.definition({
                        name: 'elementTypeName'
                    }),
                    _selectGroup: {
                        name: 'typeName',
                        condition: 'module_list.module_type=1',
                        field: 'name'
                    }
                }),
                (join: any) =>  join('parentTypeId', 'id', {
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
})