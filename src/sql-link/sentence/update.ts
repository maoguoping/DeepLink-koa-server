import { Model } from "../model";
export interface UpdateParams {
    [propName: string]: any;
}
/**
 * SQL更新
 * @param updateObj {Object} 查询配置
 * @return {AudioNode | void}
 */
export function update(m: Model, updateObj: UpdateParams): Model {
    let arr: string[] = [];
    let updateObjArr = Object.keys(updateObj);
    updateObjArr.length > 0 &&　updateObjArr.forEach(name => {
        let item = updateObj[name];
        let value = '';
        if (typeof item === 'object') {
            let obj = {
                name:m[name],
                reducer: item.reducer
            };
            value = `${obj.name} = `+ obj.reducer();
        } else {
            value = `${m[name]} = '${item}'`
        }
        arr.push(value);
    });
    m.sqlSections.update =`UPDATE ${m.tableName} SET ${arr.join(',')}`;
    return m;
};
