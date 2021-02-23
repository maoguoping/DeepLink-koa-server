import { Dispatch, DispatchProps} from './dispatch'
import { Model } from './model';
interface Definition {
  (DefinitionProps: {
    [propName: string]: any;
  }): any;
}
function arrStringChange(list: any[]): any[] {
  let returnList = [];
  if (list.length > 0) {
    if (typeof list[0] === 'string' ) {
      returnList = list.map((item)=>`'${item}'`);
    } else {
      returnList = list;
    }
  }
  return  returnList
}
export const Fn = {
   now: () => {
    return new Dispatch({
      name: 'now',
      param: null,
      reducer(fullname: string) {
        return `NOW()`
      }
    })
  },
  add: (number: number) => {
    return new Dispatch({
      name: 'add',
      param: number,
      reducer(fullname: string) {
        return `${this.name}+${number}`
      }
    })
  },
  in: (value: any[]) => {
    return new Dispatch({
      name: 'in',
      param: value,
      reducer(fullname: string) {
        let list = arrStringChange(value);
        return `${fullname} in (${list.join(',')})`;
      }
    })
  },
  or: (param: any) => {
    return new Dispatch({
      name: 'or',
      param: param,
      reducer(fullname: string) {
        return '';
      }
    })
  },
  like: (value: any[] | string, para: any) => {
    return new Dispatch({
      name: 'like',
      param: {value, para},
      reducer(fullname: string) {
        let flag = 0;
        let isParaFun =  typeof para === 'function';
        if (Array.isArray(value)) {
          let arr = [];
          arr = value.map((item: any) => {
            return `${fullname} LIKE ${isParaFun ? para(value) : para}`
          });
          return arr.join(' OR ');
        } else {
          return `${fullname} LIKE ${isParaFun ? para(value) : para}`
        }
      }
    })
  },
  between: (value: any[]) => {
    let emptyRes: DispatchProps = {
      name: 'between',
      param: {value}
    };
    let res = null;
    if (value.length > 0 ) {
      value = arrStringChange(value);
      emptyRes.reducer = function (fullname: string) {
        res = `${fullname} BETWEEN ${value[0]} AND ${value[1]}`;
        return res;
      }
    }
    return new Dispatch(emptyRes);
  },
  definition: (selectObj: any) =>{
    return new Dispatch({
      name: 'definition',
      param: selectObj,
      reducer(model, spaceName: string) {
        let arr = Object.keys(selectObj);
        let selectArr: string[] = []
        arr.forEach((item) => {
            selectArr.push(`${spaceName}.${model[item]} AS ${selectObj[item]}`)
        })
        return selectArr.join(',')
      }
    })
  },
  exclude: (nameList: any) => {
    return new Dispatch({
      name: 'exclude',
      param: {nameList},
      reducer(fullname: string) {
        return nameList;
      }
    })
  },
  replace: (model: Model, key: string, a: string, b: string) => {
    return new Dispatch({
      name: 'replace',
      param: {model, key, a, b},
      reducer() {
        return `REPLACE(${model[key]},  '${a}', '${b}')`;
      }
    })
  },
  //传入空查询不做为查询条件
  equalEmptyAll: (value: any, model: Model, fn?: any) => {
    let emptyRes: DispatchProps = {
      name:'equalEmptyAll',
      param: {value, model, fn}
    };
    return new Dispatch(emptyRes);
  },
  unEqual: (value: any) => {
      return new Dispatch({
          name: 'unEqual',
          param: {value},
          reducer: (fullname: string) => {
              return `${fullname} <> ${value}`;
          }
      })
  }
};
