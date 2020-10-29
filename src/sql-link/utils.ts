import { MYSQL_KEYWORDS } from './constant'
type inputValArray = Array<string | number>
type outputValArray = Array<string>
// 格式化数字与字符串的输入
export const inputValueFormat: (val: string | number | inputValArray) => string | outputValArray= function (val: string | number): string | outputValArray {
  if (Array.isArray(val)) {
    return val.map((item: string | number) => <string>inputValueFormat(item));
  } else {
    if (typeof val === 'string' ) {
      return `'${val}'`
    } else {
      return `${val}`
    }
  }
}
export const isMysqlKeyword: (val: string) => boolean = function (val: string) {
  return MYSQL_KEYWORDS[val] ? true : false
}
export const dealMysqlKeyword: (val: string | number | boolean) => string | number | boolean = function (val: string | number | boolean) {
  if (typeof val === 'string' && (isMysqlKeyword(val) || isMysqlKeyword(val.toUpperCase()))) {
    return '`'+ val + '`'
  } else {
    return val
  }
}