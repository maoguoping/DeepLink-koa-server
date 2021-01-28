import sqlLink from '../../model';
const { Models } = sqlLink;
export default class ElementService {
    // 构造
    constructor() {
    }

    /**
     * 获取元素类别列表
     */
    public static async getElementTypeDic() {
      try {
        let result = await Models.elementType.select().query()
        return {
          success: true,
          message: `获取元素类别列表成功！`,
          data: result
        };
      } catch (e) {
        return {
          success: true,
          message: `获取元素类别列表失败！`,
          data: []
        };
      }
      
    }
}
