import { Fn } from './fn'
import { Model } from './model';
class FnObj {
  public currentModel: Model;
  public currentFn: any;
  public objName: string;
  public childObj: any[];
  public childResolveList: any[];
  public currentOutput: string;
  public srcParam: any;
  public param: any;
  public isFn: boolean;
  public contextModels: any;
  constructor(currentModel: Model, objName: string, param: any) {
    this.currentModel = currentModel;
    this.objName= objName;
    this.currentFn = '';
    this.childObj = [];
    this.childResolveList = [];
    this.currentOutput = '';
    this.srcParam = param;
    this.param = param.param || param;
    this.isFn = param.isFn || false;
    this.contextModels = this.currentModel.context.Models;
    if (this.isFn) {
      this.currentFn = this.srcParam.name;
      //传入参数为Fn对象
      if (param.name === 'or') {
        this.childObj = this.param;
      } else {
        this.currentOutput = this.srcParam.reducer(this.getFullName(objName));
      }
    } else if (Array.isArray(this.param)) {
      this.childObj = this.param;
    } else if (typeof this.param === 'object') {
      if (!(this.param instanceof FnObj)) {
        this.currentOutput = this.objResolve(this.param);
      }
    } else {
      this.currentOutput = this.param;
    }
  }

  /**
   * FnObj解析函数
   * @return {string}
   */
  resolve(): string {
    let output = '';
    //子节点解析
    if (this.childObj.length > 0) {
      //遍历子节点
      this.childObj.forEach((item) => {
        let resolveOutput = '';
        if (typeof item === 'string') {
          resolveOutput = item;
        } else if(!(item instanceof FnObj)){
          //子节点不是FnObj对象
          let obj = new FnObj(this.currentModel, this.objName, item);
          resolveOutput = obj.resolve();
        }
        this.childResolveList.push(resolveOutput);
      });
      if (this.currentFn === 'or') {
        output += this.childResolveList.join(' OR ');
      } else {
        output += this.childResolveList.join(',');
      }
    }
    output += this.currentOutput;
    return output;
  }

  /**
   * obj解析函数
   * @param  obj {object}
   */
  objResolve(obj: any) {
    let objKeyArr = Object.keys(obj);
    let outputArr: string[] = [];
    let simpleResolve = (obj: any, fullname: string) => {
      if (obj instanceof  FnObj){
        //值为FnObj对象
        return obj.resolve();
      } else if (typeof obj == 'number') {
        //值为纯数字
        return `${fullname}=${obj}`;
      } else if (typeof obj == 'string') {
        //值为纯字符串
        return `${fullname}='${obj}'`;
      } else if (Array.isArray(obj)) {
        //值为数组
        let filterArr = this.arrStringChange(obj);
        return `${fullname} IN (${filterArr.join(',')})`;
      }
    };
    objKeyArr.forEach((item) => {
      let objVal = obj[item];
      let fullName = this.getFullName(item);
      if (objVal.isFn){
        // 值为空跳过语句
        if(objVal.name === 'equalEmptyAll') {
          let val = objVal.param.value;
          let fn = objVal.param.fn;
          if (!(val === '' || val === undefined || val === null || val.length == 0)) {
            if(fn != undefined){
              // outputArr.push(simpleResolve(objVal,fullName));
              let fnObj = new FnObj(this.currentModel, item, fn);
              outputArr.push(fnObj.resolve());
            } else {
              outputArr.push(simpleResolve(val,fullName));
            }
          }
        } else {
          outputArr.push (objVal.reducer(fullName));
        }
      } else {
        outputArr.push(simpleResolve(objVal,fullName));
      }
    });
    return outputArr.join(' AND ');
  }

  /**
   *
   * @param list
   * @return {Array}
   */
  arrStringChange(list: any[]) {
    let returnList = [];
    if (list.length > 0) {
      if (typeof list[0] === 'string' ) {
        returnList = list.map((item: string)=>`'${item}'`);
      } else {
        returnList = list;
      }
    }
    return  returnList
  }

  /**
   *
   * @param name
   * @return {*|string}
   */
  getFullName(name: string){
    let fullName = '';
    let nameArr = name.split('.');
    if (nameArr.length === 1) {
      let currentModelName = this.currentModel.tableName;
      //如果值来自于关联表
      fullName = `${currentModelName}.${this.currentModel[name]}`
    } else {
      let modelName = nameArr[0];
      let fieldName = nameArr[1];
      let joinModelName = this.currentModel._joinField[modelName];
      let contextFieldName = this.contextModels[modelName][fieldName]
      fullName = (joinModelName ? joinModelName[0] : this.currentModel.tableName) + '.' + contextFieldName;
    }

    return fullName;
  }
}

export default FnObj;
