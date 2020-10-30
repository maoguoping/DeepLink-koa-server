/*项目服务模块*/
import IdUtils from '../../utils/idUtil';
import sqlLink from '../../model';
const { Models, ModelList, Fn, Page } = sqlLink;

export default class ModuleService {
  // 构造
  constructor() {
  }

  /**
   * 根据父节点路径查找模块
   */
  public static async getModuleListByParentPathId(parentPathId: string, name: string, order: any, index: number, size: number) {
    let page = new Page(
      Models.module.select().join({
        folderType: [
          (join: any) => join('folderType.id', 'id', { select: Fn.exclude(['id'])}),
          (join: any) => join('folderType.parentId', 'id', { select: Fn.exclude(['id'])})
        ],
        elementType: [
          (join: any) => join('elementType.id', 'id', { select: Fn.exclude(['id'])}),
          (join: any) => join('elementType.parentId', 'id', { select: Fn.exclude(['id'])})
        ]
      }).where({
        'module.parentPathId': parentPathId
      }),
      {
        order: {
          by: name,
          type: order
        },
        limit: {
          size,
          index
        }
      });
    let results = await page.query()
    let list = results[0].map((item: any) => {
      let name = item.moduleName
      delete item.moduleName
      return {
        ...item,
        name
      }

    });
    let total = results[1][0].total;
    let ret = {
      success: true,
      data:{
        list,
        total,
        currentPage: index,
        pageSize: size
      },
      message: `根据父节点路径查找模块成功！`
    };
    return ret
  }

  /**
   * 新建模块
   */
  public static async addModule(moduleInfo: any) {
    let id = IdUtils.getUuidV1();
    let {name, description, moduleType, typeId, parentId, parentName, parentPath, parentPathId, parentType, parentTypeId} = moduleInfo;
    let result = await Models.module.insert({
      id,
      moduleName: name,
      description,
      moduleType,
      typeId,
      parentId,
      parentName,
      parentPath,
      parentPathId,
      parentType,
      parentTypeId,
      createTime: Fn.now(),
      modifyTime: Fn.now(),
      path: `${parentPath}/${name}`,
      pathId: `${parentPathId}/${id}`
    }).query()
    let ret = {success: true, message: `添加模块${name}成功！`};
    return ret
  }

  /**
   * 修改模块

   */
  public static async updateModule(moduleInfo: any) {
    try {
      let {name, oldName, description, typeId, id} = moduleInfo;
      let modelList = new ModelList([
        Models.module.update({moduleName: name, description, typeId, modifyTime: Fn.now()}).where({
          'module.id': id
        }),
        Models.module.update({
          path: Fn.replace(Models.module, 'path', oldName, name),
          parentPath: Fn.replace(Models.module, 'parentPath', oldName, name),
          parentName: Fn.replace(Models.module, 'parentName', oldName, name)
        }).where({
          'module.pathId': Fn.like('pathId', (item: any) => `'%${id}%'`)
        })
      ]);
      await modelList.query()
      let ret = {success: true, message: `修改模块${name}成功！`};
      return ret
    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   * 删除模块
   * @param moduleInfo
   * @return {Promise<any>}
   */
  public static async deleteModule(moduleInfo: any) {
    let id = moduleInfo.id;
    await Models.module.delete().where({
      'module.pathId': Fn.like(id, (item: any) => `'%${item}%'`)
    }).query()
    let ret = {success: true, message: `删除模块${moduleInfo.name}成功！`};
    return ret
  }

  /**
   * 获取模块类别列表
   */
  public static async getFolderTypeDic() {
    let result = await Models.folderType.select().query()
    return {
      success: true,
      message: `获取模块类别列表成功！`,
      data: result
    };
  }


  /**
   * 根据路径id获取模块详情
   * @return {Promise<any>}
   */
  public static async getModuleInfoByPathId(pathId: string) {
    let results = await Models.module.select().join({
      folderType: [
        (join: any) =>  join('folderType.id', 'typeId', {
             select: Fn.definition({
                 name: 'folderTypeName'
             }),
             _selectGroup: {
                 name: 'typeName',
                 condition: 'module_list.module_type=0',
                 field: 'name'
             }
        }),
        (join: any) =>  join('folderType.id', 'parentTypeId', {
             select: Fn.definition({
                 name: 'folderParentTypeName'
             }),
             _selectGroup: {
                 name: 'parentTypeName',
                 condition: 'module_list.module_type=0',
                 field: 'name'
             }
         })
     ],
     elementType: [
         (join: any) =>  join('elementType.id', 'typeId', {
             select: Fn.definition({
                 name: 'elementTypeName'
             }),
             _selectGroup: {
                 name: 'typeName',
                 condition: 'module_list.module_type=1',
                 field: 'name'
             }
         }),
         (join: any) =>  join('elementType.id', 'parentTypeId', {
             select: Fn.definition({
                 name: 'elementParentTypeName'
             }),
             _selectGroup: {
                 name: 'parentTypeName',
                 condition: 'module_list.module_type=1',
                 field: 'name'
             }
         })
     ]
    }).where({
      'module.pathId': pathId
    }).query()
    let list = [],
      ret = null;
    list = results[0];
    ret = {
      success: true,
      data: list,
      message: '根据路径id获取模块详情成功！'
    };
    return ret
  }
}
