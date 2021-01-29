import { createLink, Fn, Page } from '../../src/sql-link';
import config from '../../config';
import path = require('path');
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
    test: true
});
describe('启动测试', () => {
    it('获取modelList', () => {
        const modelNameList = sqlLink.modelNameList;
        expect(modelNameList.length).to.equal(9);
    })
    it('获取User', () => {
        const user = sqlLink.Models.user;
        expect(user._name).to.equal('user');
    })
    it('获取Page', () => {
        expect(Page instanceof Function).to.equal(true);
    })
    it('获取Fn', () => {
        expect(Fn.add instanceof Function).to.equal(true);
    })
})