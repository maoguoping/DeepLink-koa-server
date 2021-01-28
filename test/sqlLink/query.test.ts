import { createLink } from '../../src/sql-link';
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
const sqlLink = createLink({
    dbConfig: config.mysql,
    modelPath: path.join(__dirname, '../../', 'src','model'),
    test: false
});
const { Fn, Models } = sqlLink
const { user } = Models;
describe('异步查询sql语句测试', () => {
    it('获取用户', (done: any) => {
        user.select().query().then((data: any) => {
            expect(data.length).to.least(1);
            done()
        })
    })
    it('获取指定用户', (done: any) => {
        user.select().where({
            username: 'admin'
        }).query().then((data: any) => {
            expect(data[0].username).to.equal('admin');
            done()
        })
    })
})