import uuidv1 = require('uuid/v1');
export default class IdUtil {
  // 构造
  constructor() {
  }

  public static genNonDuplicateID(randomLength: number) {
    return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36)
  }

  public static getUuidV1(){
    let id = uuidv1();
    return id.replace(/-/g,'')
  }
}
