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