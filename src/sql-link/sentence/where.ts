export type  WhereParams = string | any[] | any | object
/**
 * SQL 条件
 * @param whereObj {Object}
 */
export function where(whereObj: WhereParams) {
    let arr = [];
    let data = this.data;
      //参数为sql语句
    if (typeof whereObj == 'string'){
        this.sqlSections.where = `${whereObj}`;
      //参数为Fn对象
    } else if(whereObj.isFn){
        if (whereObj.name === 'or') {
          let fnObj = new this._FnObj(this, null, whereObj);
          this.sqlSections.where = ` ${fnObj.resolve()}`;
        } else {
          this.sqlSections.where = ` ${whereObj.reducer()}`;
        }
        //参数为数组
    } else if(Array.isArray(whereObj)){
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
    }
    //参数为普通对象
    else {
      let fnObj = new this._FnObj(this, null, whereObj);
      this.sqlSections.where = `${fnObj.resolve()}`;
    }
    return this;
};
