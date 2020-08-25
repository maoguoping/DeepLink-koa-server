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
  public static getModuleListByParentPathId(parentPathId: string, name: string, order: any, index: number, size: number) {
    return new Promise((resolve, reject) => {
      let page = new Page(
        Models.module.select().join({
          folderType: [
            {
              s: 'typeId',
              t: 'id',
              select: Fn.exclude(['id'])
            },
            {
              s: 'parentTypeId',
              t: 'id',
              select: Fn.exclude(['id'])
            }
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
      page.query().then((results: any) => {
        let list = results[0];
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
        resolve(ret);
      }).catch((e: Error) => {
        reject(e);
      })
    });
  }

  /**
   * 新建模块
   */
  public static addModule(moduleInfo: any) {
    return new Promise((resolve, reject) => {
      let id = IdUtils.getUuidV1();
      let {name, description, moduleType, typeId, parentId, parentName, parentPath, parentPathId, parentType, parentTypeId} = moduleInfo;
      Models.module.insert({
        id,
        name,
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
      }).query().then((result: any) => {
        let ret = {success: true, message: `添加模块${name}成功！`};
        resolve(ret);
      }).catch((e: Error) => {
        reject(e);
      })
    });
  }

  /**
   * 修改模块

   */
  public static updateModule(moduleInfo: any) {
    return new Promise((resolve, reject) => {
      let {name, oldName, description, typeId, id} = moduleInfo;
      let modelList = new ModelList([
        Models.module.update({name, description, typeId, modifyTime: Fn.now()}).where({
          'module.id': id
        }),
        Models.module.update({
          path: Fn.replace(Models.module, 'path', oldName, name),
          parentPath: Fn.replace(Models.module, 'parentPath', oldName, name),
          parentName: Fn.replace(Models.module, 'parentName', oldName, name)
        }).where({
          'module.pathId': Fn.like('pathId', (item: any) => `'%${item}%'`)
        })
      ]);
      modelList.query().then((result: any) => {
        let ret = {success: true, message: `修改模块${name}成功！`};
        resolve(ret);
      }).catch((e: Error) => {
        reject(e);
      })
    });
  }

  /**
   * 删除模块
   * @param moduleInfo
   * @return {Promise<any>}
   */
  public static deleteModule(moduleInfo: any) {
    return new Promise((resolve, reject) => {
      let id = moduleInfo.id;
      let model = Models.module.delete().where({
        'module.pathId': Fn.like(id, (item: any) => `'%${item}%'`)
      }).query().then((result: any) => {
        let ret = {success: true, message: `删除模块${moduleInfo.name}成功！`};
        resolve(ret);
      }).catch((e: Error) => {
        reject(e);
      })
    });
  }

  /**
   * 获取模块类别列表
   */
  public static getFolderTypeDic() {
    return new Promise((resolve, reject) => {
      Models.folderType.select().query().then((result: any) => {
        let ret = {
          success: true,
          message: `获取模块类别列表成功！`,
          data: result
        };
        resolve(ret);
      }).catch((e: Error) => {
        reject(e);
      })
    });
  }


  /**
   * 根据路径id获取模块详情
   * @return {Promise<any>}
   */
  public static getModuleInfoByPathId(pathId: string) {
    return new Promise((resolve, reject) => {
      Models.module.select().join({
        folderType: [
          {
            s: 'typeId',
            t: 'id',
            select: Fn.definition({
              name: 'folderTypeName'
            }),
            _selectGroup: {
              name: 'typeName',
              condition: 'module_list.module_type=0',
              field: 'name'
            }
          },
          {
            s: 'parentTypeId',
            t: 'id',
            select: Fn.definition({
              name: 'folderParentTypeName'
            }),
            _selectGroup: {
              name: 'parentTypeName',
              condition: 'module_list.module_type=0',
              field: 'name'
            }
          }
        ],
        elementType: [
          {
            s: 'typeId',
            t: 'id',
            select: Fn.definition({
              name: 'elementTypeName'
            }),
            _selectGroup: {
              name: 'typeName',
              condition: 'module_list.module_type=1',
              field: 'name'
            }
          },
          {
            s: 'parentTypeId',
            t: 'id',
            select: Fn.definition({
              name: 'elementParentTypeName'
            }),
            _selectGroup: {
              name: 'parentTypeName',
              condition: 'module_list.module_type=1',
              field: 'name'
            }
          }
        ]
      }).where({
        'module.pathId': pathId
      }).query().then((results: any) => {
        let list = [],
          ret = null;
        list = results[0];
        ret = {
          success: true,
          data: list,
          message: '根据路径id获取模块详情成功！'
        };
        resolve(ret);
      }).catch((e: Error) => {
        reject(e);
      })
    });
  }
}
