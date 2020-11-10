/**
 * SQL插入
 * @param insertObj {Object} 插入配置
 * @return {AudioNode | void}
 */
export interface JoinParams {
    [propName: string]: any;
}
/**
   *
   * @param name
   * @return {*|string}
   */
  function getFullName(name: string, spaceName: string){
    let fullName = '';
    let nameArr = name.split('.');
    if (nameArr.length === 1) {
      let currentModelName = this.tableName;
      if(spaceName) {
        fullName = `${spaceName}.${this[name]}`
      } else if (this._joinField[name]) {
        fullName = this._joinField[name]
      } else {
        fullName = `${currentModelName}.${this[name]}`
      }
    } else {
      let modelName = nameArr[0];
      let fieldName = nameArr[1];
      let joinModelName = this.context.Models[modelName].tableName;
      if (this._joinField[modelName]) {
        joinModelName = this._joinField[modelName][0]
      }
      let contextFieldName = this.context.Models[modelName][fieldName]
      if(spaceName) {
        fullName = spaceName + '.' + contextFieldName;
      } else {
        fullName = (joinModelName ? joinModelName : this.tableName) + '.' + contextFieldName;
      }
    }

    return fullName;
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
        item((t: string, s: string, joinOptions: any) => {
          let spaceName = namespaceArr[namespaceIndex++];
          let targetField = getFullName.call(this, t, spaceName);
          let sourceField = getFullName.call(this, s);
          let str = ` LEFT JOIN ${model.tableName} ${spaceName} ON ${targetField}=${sourceField}`;
          joinArr.push(str);
          //join是否存在分组条件
          if (joinOptions && joinOptions._selectGroup && joinOptions._selectGroup.name) {
            // console.log('join是否存在分组条件', joinOptions)
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
            let nameObj: any = Object.create(null);
            nameObj[name] = [spaceName];
            this._joinField = Object.assign(
              this._joinField, nameObj
            );
            let joinModel = null;
            joinModel = model.mixin(spaceName, joinOptions ? joinOptions.select : undefined);
            selectArr.push(joinModel.attrStr);
            Object.assign(this._keyWithField, joinModel._keyWithField);
          }
          })
      })
    }
  });

  this.sqlSections.join = joinArr.join('');
  // if(selectSql === ''){
  if (this.attrStr)  {
    selectSql += `,`;
  }
  // }
  let _selectGroupArr = Object.keys(this._selectGroup);
  console.log('join是否存在分组条件', this._selectGroup);
  _selectGroupArr.forEach((name: string) => {
    let group: any[] = this._selectGroup[name];
    let sql = ``;
    if (group.every(item => item.condition !== undefined)) {
      sql = `CASE `;
      group.forEach((item: any) => {
        sql += `WHEN ${item.condition} THEN ${item.fullname} `
      });
      sql += ` END '${name}'`
    } else {
      sql = ``
    }
    selectArr.push(sql);
  });
  selectSql += selectArr.join(',');
  this.sqlSections.select = selectSql;
  return this;
};
