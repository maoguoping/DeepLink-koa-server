export type  WhereParams = string | any[] | any | object
/**
 * SQL 条件
 * @param whereObj {Object}
 */
export function where(whereObj: WhereParams) {
    //参数为sql语句
  if (typeof whereObj == 'string'){
    this.sqlSections.where = `${whereObj}`;
  } else if(Array.isArray(whereObj)){
    //参数为数组
    let arr: string[] =[];
    whereObj.forEach(item =>{
      let [modelName, key] = item.name.split('.')
      // 转换为join后的名字
      if(this._joinField[modelName][0]){
        modelName = this._joinField[modelName][0];
      }
      if(item.equal){
        arr.push(`${modelName}.${key} = '${item.equal}'`);
      }
    });
    if (arr.length > 0){
      this.sqlSections.where =`${arr.join(',')}`;
    }
  } else if(whereObj.isFn){
    //参数为Fn对象
    if (whereObj.name === 'or') {
      let fnObj = new this._FnObj(this, null, whereObj);
      this.sqlSections.where = ` ${fnObj.resolve()}`;
    } else {
      this.sqlSections.where = ` ${whereObj.reducer()}`;
    }   
  } else {
    //参数为普通对象
    let fnObj = new this._FnObj(this, null, whereObj);
    this.sqlSections.where = `${fnObj.resolve()}`;
  }
  return this;
};
