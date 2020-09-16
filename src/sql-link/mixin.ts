import { Dispatch, SelectorDispatch } from './dispatch'
export function mixin(spaceName: string, selector: string | undefined | SelectorDispatch | any[]) {
  if (selector == '' || selector == undefined) {
    let arr: string[] = [];
    let data = this.data;
    let staticData = this.staticData;
    let dataArr = Object.keys(data);
    if (dataArr.length > 0) {
      dataArr.forEach(name => {
        let item = data[name];
        let fullName = `${spaceName}.${this[name]}`;
        this._keyWithField[name] = fullName;
        arr.push(`${spaceName}.${this[name]} AS ${name}`);
      });
    }
    if (staticData) {
      let staticDataArr = Object.keys(staticData);
      staticDataArr.length > 0 && staticDataArr.forEach(name => {
        let item = staticData[name];
        this._keyWithField[name] = name;
        arr.push(`'${item.value}' AS ${name}`);
      });
    }
    this.sqlSections.select = `SELECT ${arr.join(',')}`;
    this.attrStr = `${arr.join(',')}`;
  } else if (selector instanceof Dispatch) {
    let arr = [];
    let data = this.data;
    let staticData = this.staticData;
    let dataArr = [];
    if (selector.name === 'exclude') {
      let excludeList = selector.reducer();
      dataArr = Object.keys(data).filter((name) => {
        return !excludeList.includes(name);
      });
      if (dataArr.length > 0) {
        dataArr.forEach(name => {
          let item = data[name];
          let fullName = `${spaceName}.${this[name]}`;
          this._keyWithField[name] = fullName;
          arr.push(`${fullName} AS ${name}`);
        });
      }
    } else if (selector.name === 'definition') {
      let definition = selector.reducer(this.context.Models[this._name], spaceName);
      arr.push(definition);
    }

    if (staticData) {
      let staticDataArr = Object.keys(staticData);
      staticDataArr.length > 0 && staticDataArr.forEach(name => {
        let item = staticData[name];
        this._keyWithField[name] = name;
        arr.push(`'${item.value}' AS ${name}`);
      });
    }
    this.sqlSections.select = `SELECT ${arr.join(',')}`;
    this.attrStr = `${arr.join(',')}`;
  }
  return this;
}