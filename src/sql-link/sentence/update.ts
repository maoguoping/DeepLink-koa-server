export interface UpdateParams {
    [propName: string]: any;
}
/**
 * SQL更新
 * @param updateObj {Object} 查询配置
 * @return {AudioNode | void}
 */
export function update(updateObj: UpdateParams) {
    let arr: string[] = [];
    let updateObjArr = Object.keys(updateObj);
    updateObjArr.length > 0 &&　updateObjArr.forEach(name => {
        let item = updateObj[name];
        let value = '';
        if (typeof item === 'object') {
            let obj = {
                name:this[name],
                reducer: item.reducer
            };
            value = `${obj.name} = `+ obj.reducer();
        } else {
            value = `${this[name]} = '${item}'`
        }
        arr.push(value);
    });
    this.sqlSections.update =`UPDATE ${this.tableName} SET ${arr.join(',')}`;
    return this;
};
