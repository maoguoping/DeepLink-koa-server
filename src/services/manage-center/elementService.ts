import sqlLink from '../../model';
const { Models, Fn, Page } = sqlLink;
export default class ElementService {
    // 构造
    constructor() {
    }

    /**
     * 获取元素类别列表
     */
    public static getElementTypeDic() {
        return new Promise((resolve, reject) => {
          Models.elementType.select().query().then((result: any)=>{
            let ret = {
              success: true,
              message: `获取元素类别列表成功！`,
              data: result
            };
            resolve(ret);
          }).catch((e: Error) =>{
            reject(e);
          })
        });
    }
}
