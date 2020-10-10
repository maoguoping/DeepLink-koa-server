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
      let sameModelArr = !Array.isArray(joinOption) ? [joinOption] : joinOption;
      sameModelArr.forEach(item => {
        item((s: string, t: string, joinOptions: any) => {
          let targetField = model[t];
          let sourceField = this[s];
          let spaceName = namespaceArr[namespaceIndex++];
          let str = ` LEFT JOIN ${model.tableName} ${spaceName} ON ${spaceName}.${targetField}=${this.tableName}.${sourceField}`;
          joinArr.push(str);
          //join是否存在分组条件
          if (joinOptions && joinOptions._selectGroup && joinOptions._selectGroup.name) {
            let name = joinOptions._selectGroup.name;
            let _selectGroup = this._selectGroup;
            if (!_selectGroup[name]) {
              _selectGroup[name] = [];
            }
            _selectGroup[name].push({
              condition: joinOptions._selectGroup.condition,
              fullname: `${spaceName}.${model[joinOptions._selectGroup.field]}`
            });
          } else {
            let nameObj: any = {};
            nameObj[name] = [spaceName];
            this._joinField = Object.assign(
              this._joinField, nameObj
            );
            let joinModel = null;
            joinModel = model.mixin(spaceName, joinOptions.select);
            selectArr.push(joinModel.attrStr);
            Object.assign(this._keyWithField, joinModel._keyWithField);
          }
          })
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
