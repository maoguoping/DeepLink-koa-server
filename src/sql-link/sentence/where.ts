import FnObj from '../FnObj'
import { Model } from '../model';
export type  WhereParams = string | any | object
/**
 * SQL 条件
 * @param whereObj {Object}
 */
export function where(m: Model, whereObj: WhereParams) {
    //参数为sql语句
  if (typeof whereObj == 'string'){
    m.sqlSections.where = `${whereObj}`;
  }  else if(whereObj.isFn){
    //参数为Fn对象
    if (whereObj.name === 'or') {
      let fnObj = new FnObj(m, null, whereObj);
      m.sqlSections.where = ` ${fnObj.resolve()}`;
    } else {
      m.sqlSections.where = ` ${whereObj.reducer()}`;
    }   
  } else {
    //参数为普通对象
    let fnObj = new FnObj(m, null, whereObj);
    m.sqlSections.where = `${fnObj.resolve()}`;
  }
  return m;
};
