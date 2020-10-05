import { Dispatch, SelectorDispatch } from './dispatch'
export function mixin(spaceName: string, selector: string | undefined | SelectorDispatch | any[]) {
  let _keyWithField = this._keyWithField
  function handleStaticData (staticData: any): string[] {
    let staticDataArr = Object.keys(staticData);
    let arr:string [] = []
    staticDataArr.length > 0 && staticDataArr.forEach(name => {
      let item = staticData[name];
      _keyWithField[name] = name;
      arr.push(`'${item.value}' AS ${name}`);
    });
    return arr
  }
  function handleDataArr(data:any, dataArr: any): string[]{
    let arr: string[] = []
    dataArr.forEach((name: string) => {
      let item = data[name];
      let fullName = `${spaceName}.${this[name]}`;
      _keyWithField[name] = fullName;
      arr.push(`${fullName} AS ${name}`);
    });
    return arr
  }
  if (selector == '' || selector == undefined) {
    let arr: string[] = [];
    let data = this.data;
    let staticData = this.staticData;
    let dataArr = Object.keys(data);
    if (dataArr.length > 0) {
      arr = arr.concat(handleDataArr(data, dataArr))
    }
    if (staticData) {
      arr = arr.concat(handleStaticData(staticData))
    }
    this.sqlSections.select = `SELECT ${arr.join(',')}`;
    this.attrStr = `${arr.join(',')}`;
  } else if (selector instanceof Dispatch) {
    let arr: string[] = [];
    let data = this.data;
    let staticData = this.staticData;
    let dataArr = [];
    if (selector.name === 'exclude') {
      let excludeList = selector.reducer();
      dataArr = Object.keys(data).filter((name) => {
        return !excludeList.includes(name);
      });
      if (dataArr.length > 0) {
        arr = arr.concat(handleDataArr(data, dataArr))
      }
    } else if (selector.name === 'definition') {
      let definition = selector.reducer(this.context.Models[this._name], spaceName);
      arr.push(definition);
    }

    if (staticData) {
      arr = arr.concat(handleStaticData(staticData))
    }
    this.sqlSections.select = `SELECT ${arr.join(',')}`;
    this.attrStr = `${arr.join(',')}`;
  }
  return this;
}