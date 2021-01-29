import { Model } from "../model";
/**
 * SQL插入
 * @param insertObj {Object} 插入配置
 * @return {AudioNode | void}
 */
export interface JoinParams {
    [propName: string]: any;
}
export type SelectGroupOption = {
  name: string,
  condition: string,
  field: string
}
export type SelectGroupItem = {
  condition: string,
  fullname: string
}
export type SelectGroup = Record<string, SelectGroupItem[]>
export type JoinOptions = {
  _selectGroup?: SelectGroupOption;
  select?: any;
}
export type JoinField =  Record<string, string[]>;
export type KeyWithField =  Record<string, string>;
/**
 *
 * @param name
 * @return {*|string}
 */
function getFullName(m: Model, name: string, spaceName?: string){
  let fullName = '';
  let nameArr = name.split('.');
  if (nameArr.length === 1) {
    let currentModelName = m.tableName;
    if(spaceName) {
      fullName = `${spaceName}.${m[name]}`
    } else if (m._joinField[name]) {
      fullName = m._joinField[name][0]
    } else {
      fullName = `${currentModelName}.${m[name]}`
    }
  } else {
    let modelName = nameArr[0];
    let fieldName = nameArr[1];
    let joinModelName = m.context.Models[modelName].tableName;
    if (m._joinField[modelName]) {
      joinModelName = m._joinField[modelName][0]
    }
    let contextFieldName = m.context.Models[modelName][fieldName]
    if(spaceName) {
      fullName = spaceName + '.' + contextFieldName;
    } else {
      fullName = (joinModelName ? joinModelName : m.tableName) + '.' + contextFieldName;
    }
  }

  return fullName;
}
export function join(m: Model, joinObj: JoinParams): Model {
  let namespaceArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  let namespaceIndex = 0;
  let ModelsArr: string[] = Object.keys(joinObj);
  let Models = m.context.Models;
  let joinArr:string [] = [];
  let selectSql = m.sqlSections.select;
  let selectArr:string [] = [];
  ModelsArr.forEach((name: string) => {
    let model = Models[name];
    //name为混入Model名称
    if (name === m._name) {

    } else {
      let joinOption = joinObj[name];
      let sameModelArr = !Array.isArray(joinOption) ? [joinOption] : joinOption;
      sameModelArr.forEach(item => {
        item((t: string, s: string, joinOptions: JoinOptions) => {
          let spaceName = namespaceArr[namespaceIndex++];
          let targetField = getFullName(m, t, spaceName);
          let sourceField = getFullName(m, s);
          let str = ` LEFT JOIN ${model.tableName} ${spaceName} ON ${targetField}=${sourceField}`;
          joinArr.push(str);
          //join是否存在分组条件
          if (joinOptions && joinOptions._selectGroup && joinOptions._selectGroup.name) {
            // console.log('join是否存在分组条件', joinOptions)
            let name = joinOptions._selectGroup.name;
            let _selectGroup: SelectGroup = m._selectGroup;
            if (!_selectGroup[name]) {
              _selectGroup[name] = [];
            }
            _selectGroup[name].push({
              condition: joinOptions._selectGroup.condition,
              fullname: `${spaceName}.${model[joinOptions._selectGroup.field]}`
            });
          } else {
            let nameObj: JoinField = Object.create(null);
            nameObj[name] = [spaceName];
            m._joinField = Object.assign(
              m._joinField, nameObj
            );
            let joinModel: Model = model.mixin(spaceName, joinOptions ? joinOptions.select : undefined);
            selectArr.push(joinModel.attrStr);
            Object.assign(m._keyWithField, joinModel._keyWithField);
          }
          })
      })
    }
  });

  m.sqlSections.join = joinArr.join('');
  // if(selectSql === ''){
  if (m.attrStr)  {
    selectSql += `,`;
  }
  // }
  let _selectGroupArr: string[] = Object.keys(m._selectGroup);
  console.log('join是否存在分组条件', m._selectGroup);
  _selectGroupArr.forEach((name: string) => {
    let group: SelectGroupItem[] = m._selectGroup[name];
    let sql = ``;
    if (group.every(item => item.condition !== undefined)) {
      sql = `CASE `;
      group.forEach((item) => {
        sql += `WHEN ${item.condition} THEN ${item.fullname} `
      });
      sql += ` END '${name}'`
    } else {
      sql = ``
    }
    selectArr.push(sql);
  });
  selectSql += selectArr.join(',');
  m.sqlSections.select = selectSql;
  return m;
};
