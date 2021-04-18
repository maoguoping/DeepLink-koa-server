import { Dispatch, SelectorDispatch } from './dispatch'
import { Model } from './model';
type KeyWithField = Record<string, string>
function handleStaticData (staticData: any, keyWithField: KeyWithField): string[] {
  let staticDataArr = Object.keys(staticData);
  let arr:string [] = []
  staticDataArr.length > 0 && staticDataArr.forEach(name => {
    let item = staticData[name];
    keyWithField[name] = name;
    arr.push(`'${item.value}' AS ${name}`);
  });
  return arr
}
function handleDataArr(m: Model, dataArr: any, keyWithField: KeyWithField, spaceName: string): string[]{
  let arr: string[] = []
  dataArr.forEach((name: string) => {
    let fullName = `${spaceName}.${m[name]}`;
    keyWithField[name] = fullName;
    arr.push(`${fullName} AS ${name}`);
  });
  return arr
}
export function mixin(m: Model, spaceName: string, selector: string | undefined | SelectorDispatch | any[]): Model {
  let _keyWithField: Record<string, string> = m._keyWithField;
  let _this = m;
  if (selector == '' || selector == undefined) {
    let arr: string[] = [];
    let data = m.data;
    let staticData = m.staticData;
    let dataArr = Object.keys(data);
    if (dataArr.length > 0) {
      arr = arr.concat(handleDataArr(m, dataArr, _keyWithField, spaceName))
    }
    if (staticData) {
      arr = arr.concat(handleStaticData(staticData, _keyWithField))
    }
    m.sqlSections.select = `SELECT ${arr.join(',')}`;
    m.attrStr = `${arr.join(',')}`;
  } else if (selector instanceof Dispatch) {
    let arr: string[] = [];
    let data = m.data;
    let staticData = m.staticData;
    let dataArr = [];
    if (selector.name === 'exclude') {
      let excludeList = selector.reducer();
      dataArr = Object.keys(data).filter((name) => {
        return !excludeList.includes(name);
      });
      if (dataArr.length > 0) {
        arr = arr.concat(handleDataArr(m, dataArr, _keyWithField, spaceName))
      }
    } else if (selector.name === 'definition') {
      let definition = selector.reducer(m.context.Models[m._name], spaceName);
      arr.push(definition);
    }

    if (staticData) {
      arr = arr.concat(handleStaticData(staticData, _keyWithField))
    }
    m.sqlSections.select = `SELECT ${arr.join(',')}`;
    m.attrStr = `${arr.join(',')}`;
  }
  return m;
}