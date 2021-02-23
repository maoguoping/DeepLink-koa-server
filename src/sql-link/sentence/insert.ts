/**
 * SQL插入
 * @param insertObj {Object} 插入配置
 * @return {AudioNode | void}
 */
import { Model } from '../model';
import { inputValueFormat } from '../utils'
export interface InsertParams {
    [propName: string]: any;
}
export function insert(m: Model, insertObj: InsertParams): Model {
    let data = m.data;
    let dataArr = Object.keys(data);
    let fieldArr: string[] = [];
    let valueArr: string[] = [];
    if(Array.isArray(insertObj)  && insertObj.length > 0 ){
        // 获取插入对象的真实field
        let nameArr = Object.keys(insertObj[0]);
        fieldArr = nameArr.map( obj => m[obj]);
        insertObj.forEach(item => {
            let innerArr: string[] = [];
            nameArr.forEach((name)=>{
                let obj = item[name];
                if(obj === undefined || obj === null){
                    innerArr.push(data[name].default());
                }else {
                    innerArr.push(<string>inputValueFormat(obj));
                }
            });
            valueArr.push(`(${innerArr.join(',')})`);
        });
        m.sqlSections.insert =`INSERT INTO ${m.tableName}(${fieldArr.join(',')}) VALUES${valueArr.join(',')}`;
    }else {
        dataArr.length > 0 && dataArr.forEach(name => {
            let item = insertObj[name];
            let field = m[name];
            fieldArr.push(field);
            let value = null;
            if(item === undefined || item === null){
                value = data[name].default();
            } else if (typeof item === 'object') {
                let obj = {
                    name: m[name],
                    reducer: item.reducer
                };
                value = obj.reducer();
            } else {
                value = `'${item}'`;
            }
            valueArr.push(value);
        });
        m.sqlSections.insert =`INSERT INTO ${m.tableName}(${fieldArr.join(',')}) VALUES(${valueArr.join(',')})`;
    }
    return m;
};
