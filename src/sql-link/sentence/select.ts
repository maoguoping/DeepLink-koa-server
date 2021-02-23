/**
 * SQL插入
 * @param insertObj {Object} 插入配置
 * @return {AudioNode | void}
 */
import { Model } from '../model'
import { dealMysqlKeyword } from '../utils'
import { Dispatch, SelectorDispatch } from '../dispatch'
export interface SelectParams {
    [propName: string]: any;
}
// select 名称变换
function fullNameChange (that: Model, dataArr: string[], tableName: string, arr: string[]): void {
  dataArr.length > 0 && dataArr.forEach((name: string) => {
    let nameStr = dealMysqlKeyword(name)
    let fullName = `${tableName}.${that[name]}`;
    that._keyWithField[name] = fullName;
    arr.push(`${fullName} AS ${nameStr}`);
  });
}
export function select(m: Model, selector?: string | undefined | SelectorDispatch | any[] | Record<string, any>): Model {
    //标注类型
    m.clearSqlSections();
    m.actionType = 'select';
    let arr: string[] = [],
      data = m.data,
      staticData = m.staticData;
     console.log('dataArr1', selector)
    //无参数即为查询Model全部数据
    if (selector === undefined || selector === null) {
      let dataArr = Object.keys(data);
      fullNameChange(m, dataArr, m.tableName, arr);
      if (staticData) {
        let staticDataArr = Object.keys(staticData);
        staticDataArr.length > 0 && staticDataArr.forEach(name => {
          let item = staticData[name];
          if (typeof item.value === 'string') {
            arr.push(`'${item.value}' AS ${name}`);
          } else if (typeof item.value === 'number') {
            arr.push(`${item.value} AS ${name}`);
          }
        });
      }
    } else if (selector instanceof Dispatch) {
      let excludeList = selector.reducer();
      let dataArr = Object.keys(data).filter((name) => {
        return !excludeList.includes(name);
      });
      fullNameChange(m,dataArr,m.tableName,arr);
      if (staticData) {
        let staticDataArr = Object.keys(staticData);
        staticDataArr.length > 0 && staticDataArr.forEach(name => {
          let item = staticData[name];
          if (typeof item.value === 'string') {
            arr.push(`'${item.value}' AS ${name}`);
          } else if (typeof item.value === 'number') {
            arr.push(`${item.value} AS ${name}`);
          }
        });
      }
    } else {
      // selector 是普通对象
      let dataArr = Object.keys(selector);
      if (dataArr.length === 0) {
        m.sqlSections.select = `SELECT `;
        m.attrStr = ``
        return m;
      } else {  
        console.log(selector, '是普通对象')
      }
    }
    console.log('非空结束')
    m.sqlSections.select = `SELECT ${arr.join(',')}`;
    m.attrStr = `${arr.join(',')}`;
    return m;
};
