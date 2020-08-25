/*项目服务模块*/
import IdUtils from '../../utils/idUtil';
import sqlLink from '../../model';

const { Models, ModelList, Fn, Page } = sqlLink;
export default class ProjectService {
    // 构造
    constructor() {
    }

    /**
     * 新建项目
     */
    public static addProject(projectInfo: any) {
        return new Promise((resolve,reject) => {
          let {name,description} = projectInfo;
          let id = IdUtils.getUuidV1();
            Models.project.insert({
              id,name,description,
              createTime:Fn.now(),
              modifyTime:Fn.now(),
              path:`/${name}`,
              pathId:`/${id}`,
            }).query().then((result: any)=>{
              let ret = {success: true, message: `添加项目${name}成功！`};
              resolve(ret);
            }).catch((e: Error)=>{
              reject(e);
            })
        });
    }

    /**
     * 修改项目
     */
    public static updateProject(projectInfo: any) {
        return new Promise((resolve,reject)=> {
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
            modelList.query().then((result: any) => {
                let ret = {success: true, message: `修改项目${name}成功！`};
                resolve(ret);
            }).catch((e:Error) => {
                reject(e);
            })
        })
    }

    /**
     * 删除项目
     */
    public static deleteProject(projectInfo: any) {
        return new Promise((resolve,reject) => {
            let { id }= projectInfo;
            Promise.all([
              Models.project.delete().where({
                'project.id': id
              }).query(),
              Models.module.delete().where({
                pathId:Fn.like(id,(item: string) =>`'%${item}%'`)
              }).query()]).then((reslut)=>{
                  let  ret = {success: true, message: `删除项目成功！`};
                  resolve(ret);
            }).catch(e=>{
              reject(e);
            })
        });
    }

    /**
     * 获取项目列表
     */
    public static getProjectList(name: string, order: any, index: number, size: number) {
        return new Promise((resolve, reject) => {
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
                    message: '获取项目列表成功！'
                };
              resolve(ret);
            }).catch((e: Error) => {
              reject(e);
            })
        });
    }

    /**
     * 根据路径获取项目信息
     */
    public static getProjectInfoByPath(path: string) {
        return new Promise((resolve, reject) => {
          Models.project.select().where({
            'project.path': path
          }).query().then((result: any)=>{
            let ret = {
              success: true,
              message: `根据路径查询项目信息成功`,
              data: result[0]
            };
            resolve(ret)
          }).catch((e: Error)=>{
            reject(e)
          })
        });
    }

    /**
     * 根据路径id获取项目信息
     */
    public static getProjectInfoByPathId(pathId: string) {
        return new Promise((resolve, reject) => {
            Models.project.select().where({
              'project.pathId': pathId
            }).query().then((result: any)=>{
              let ret = {
                                success: true,
                                message: `根据路径id查询项目信息成功`,
                                data: result[0]
              };
              resolve(ret)
            }).catch((e: Error)=>{
              reject(e)
            })
        });
    }
}
