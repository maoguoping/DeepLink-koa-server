/*项目服务模块*/
import IdUtils from '../../utils/idUtil';
import sqlLink from '../../model';
import { ModelList, Fn, Page } from '../../sql-link';
const { Models } = sqlLink;
export default class ProjectService {
    // 构造
    constructor() {
    }

    /**
     * 新建项目
     */
    public static async addProject(projectInfo: any) {
      let {name,description} = projectInfo;
      let id = IdUtils.getUuidV1();
      await  Models.project.insert({
        id,name,description,
        createTime:Fn.now(),
        modifyTime:Fn.now(),
        path:`/${name}`,
        pathId:`/${id}`,
      }).query()
      return {success: true, message: `添加项目${name}成功！`};
    }

    /**
     * 修改项目
     */
    public static async updateProject(projectInfo: any) {
      let {name, oldName, description, id} = projectInfo;
      let modelList = new ModelList([
          Models.project.update({name, description, modifyTime: Fn.now(),path:`/${name}`}).where({
            'project.id': id
          }),
          Models.module.update({
              path: Fn.replace(Models.module, 'path', oldName, name),
              parentPath: Fn.replace(Models.module, 'parentPath', oldName, name),
              parentName: Fn.replace(Models.module, 'parentName', oldName, name)
          }).where({
              'module.pathId': Fn.like('pathId', (item: string) => `'%${item}%'`)
          })
      ]);
      await modelList.query()
      return  {success: true, message: `修改项目${name}成功！`};
    }

    /**
     * 删除项目
     */
    public static async deleteProject(projectInfo: any) {
      let { id }= projectInfo;
      await Promise.all([
        Models.project.delete().where({
          'project.id': id
        }).query(),
        Models.module.delete().where({
          pathId:Fn.like(id,(item: string) =>`'%${item}%'`)
        }).query()
      ])
      return {success: true, message: `删除项目成功！`};
    }

    /**
     * 获取项目列表
     */
    public static async getProjectList(name: string, order: any, index: number, size: number) {
      let page = new Page(Models.project.select(),{
        order:{
          by:name,
          type:order
        },
        limit:{
          size,
          index
        }
      });
      let results: any = await page.query()
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
          message: '获取项目列表成功！'
      };
      return ret
    }

    /**
     * 根据路径获取项目信息
     */
    public static async getProjectInfoByPath(path: string) {
      let result = await Models.project.select().where({
        'project.path': path
      }).query()
      let ret = {
        success: true,
        message: `根据路径查询项目信息成功`,
        data: result[0]
      };
      return ret
    }

    /**
     * 根据路径id获取项目信息
     */
    public static async getProjectInfoByPathId(pathId: string) {
      let result = await Models.project.select().where({
        'project.pathId': pathId
      }).query()
      let ret = {
        success: true,
        message: `根据路径id查询项目信息成功`,
        data: result[0]
      };
      return ret;
    }
}
