export type  WhereParams = string | any | object
/**
 * SQL 条件
 * @param whereObj {Object}
 */
export function where(whereObj: WhereParams) {
    //参数为sql语句
  if (typeof whereObj == 'string'){
    this.sqlSections.where = `${whereObj}`;
  }  else if(whereObj.isFn){
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
