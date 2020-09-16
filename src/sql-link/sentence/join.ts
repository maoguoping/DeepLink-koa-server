/**
 * SQL插入
 * @param insertObj {Object} 插入配置
 * @return {AudioNode | void}
 */
import _ = require('lodash');
export interface JoinParams {
    [propName: string]: any;
}
export function join(joinObj: JoinParams) {
  let namespaceArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  let namespaceIndex = 0;
  let ModelsArr = Object.keys(joinObj);
  let Models = this.context.Models;
  let joinArr:string [] = [];
  let selectSql = this.sqlSections.select;
  let selectArr:string [] = [];
  ModelsArr.forEach((name) => {
    let model = Models[name];
    //name为混入Model名称
    if (name === this._name) {

    } else {
      let joinOption = joinObj[name];
      let sameModelArr = [];
      if (!Array.isArray(joinOption)) {
        sameModelArr.push(joinOption);
      } else {
        sameModelArr = joinOption;
      }

      sameModelArr.forEach(item => {
        let targetField = model[item.t];
        let sourceField = this[item.s];
        let spaceName = namespaceArr[namespaceIndex++];
        let str = ` LEFT JOIN ${Models[name].tableName} ${spaceName} ON ${spaceName}.${targetField}=${this.tableName}.${sourceField}`;
        joinArr.push(str);
        //join是否存在分组条件
        if (item._selectGroup && item._selectGroup.name) {
          let name = item._selectGroup.name;
          let _selectGroup = this._selectGroup;
          if (!_selectGroup[name]) {
            _selectGroup[name] = [];
          }
          _selectGroup[name].push({
            condition: item._selectGroup.condition,
            fullname: `${spaceName}.${model[item._selectGroup.field]}`
          });
        } else {
          let nameObj: any = {};
          nameObj[name] = [];
          nameObj[name].push(spaceName);
          this._joinField = Object.assign(
            this._joinField, nameObj
          );
          let joinModel = null;
          if (item.select) {
            joinModel = Models[name].mixin(spaceName, item.select);
            selectArr.push(joinModel.attrStr);
          } else {
            joinModel = Models[name].mixin(spaceName);
            selectArr.push(joinModel.attrStr);
          }
          Object.assign(this._keyWithField, joinModel._keyWithField);
        }
      })

    }
  });

  this.sqlSections.join = joinArr.join('');
  // if(selectSql === ''){
  selectSql += `,`;
  // }
  let _selectGroupArr = Object.keys(this._selectGroup);
  _selectGroupArr.forEach((name) => {
    let group = this._selectGroup[name];
    let sql = `CASE `;
    group.forEach((item: any) => {
      sql += `WHEN ${item.condition} THEN ${item.fullname} `
    });
    sql += ` END '${name}'`
    selectArr.push(sql);
  });
  selectSql += selectArr.join(',');
  this.sqlSections.select = selectSql;
  return this;
};
