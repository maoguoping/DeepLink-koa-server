/**
 * SQL插入
 * @param insertObj {Object} 插入配置
 * @return {AudioNode | void}
 */
import _ = require('lodash');
import { Model } from '../model'
import { Dispatch, DispatchType } from '../dispatch'
export interface SelectParams {
    [propName: string]: any;
}
export function select(selector: SelectParams) {
    //标注类型
    this.clearSqlSections();
    this.actionType = 'select';
    let arr: any[] = [],
      data = this.data,
      staticData = this.staticData;
    let fullNameChange = function (that: Model, dataArr: any[], tableName: string, arr: any[]) {
      dataArr.length > 0 && dataArr.forEach((name: string) => {
        let fullName = `${tableName}.${that[name]}`;
        that._keyWithField[name] = fullName;
        arr.push(`${fullName} AS ${name}`);
      });
    }
    //无参数
    if (_.isEmpty(selector)) {
      let dataArr = Object.keys(data);
      fullNameChange(this, dataArr, this.tableName, arr);
      if (staticData) {
        let staticDataArr = Object.keys(staticData);
        staticDataArr.length > 0 && staticDataArr.forEach(name => {
          let item = staticData[name];
          let fullName = `${this.tableName}.${item.value}`;
          this._keyWithField[name] = name;
          arr.push(`'${fullName}' AS ${name}`);
        });
      }
      this.sqlSections.select = `SELECT ${arr.join(',')}`;
      this.attrStr = `${arr.join(',')}`;
    } else if (selector instanceof Dispatch) {
      let excludeList = selector.reducer();
      let dataArr = Object.keys(data).filter((name) => {
        return !excludeList.includes(name);
      });
      fullNameChange(this,dataArr,this.tableName,arr);
      if (staticData) {
        let staticDataArr = Object.keys(staticData);
        staticDataArr.length > 0 && staticDataArr.forEach(name => {
          let item = staticData[name];
          this._keyWithField[name] = name;
          arr.push(`'${item.value}' AS ${name}`);
        });
      }
      this.sqlSections.select = `SELECT ${arr.join(',')}`;
      this.attrStr = `${arr.join(',')}`;
    }
    return this;
};
