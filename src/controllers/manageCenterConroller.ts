import { Controller, Param, Body, Get, Post, Put, Delete } from "routing-controllers";
import ProjectService from '../services/manage-center/projectService';
import ModuleService from '../services/manage-center/moduleService';
import ElementService from '../services/manage-center/elementService';
import Page from '../page'
@Controller()
export class ApiController {
    @Post("/manageCenter/getViewDataByPathId")
    async getViewDataByPathId(@Body() body: any) {
        try {
            let pathId = body.pathId,
                resultJson = {
                    data: {}
                },
                page = new Page('listView');
            page.currentPage = body.currentPage;
            page.pageSize = body.pageSize;
            let order = body.order;
            let name = body.sortBy,
                index = body.currentPage,
                size = body.pageSize;
            let ret: any;
            if (pathId == "") {
                //获取项目列表
                ret = await ProjectService.getProjectList(name, order, index, size);
            } else {
                //获取项目详情列表
                //获取项目列表
                ret = await ModuleService.getModuleListByParentPathId(pathId, name, order, index, size);
            }
            page.list = ret.data.list;
            page.total = ret.data.total;
            resultJson.data = page;
            return resultJson;
        } catch (err) {
            return err;
        }
    }

    @Post("/manageCenter/addProject")
    async addProject(@Body() body: any) {
        try {
            return await ProjectService.addProject(body);
        } catch (err) {
            return err;
        }
    }

    @Post("/manageCenter/updateProject")
    async updateProject(@Body() body: any) {
        try {
            return await ProjectService.updateProject(body);
        } catch (err) {
            return err;
        }
    }

    @Post("/manageCenter/deleteProject")
    async deleteProject(@Body() body: any) {
        try {
            return await ProjectService.deleteProject(body);
        } catch (err) {
            return err;
        }
    }

    @Post("/manageCenter/addModule")
    async addModule(@Body() body: any) {
        try {
            return await ModuleService.addModule(body);
        } catch (err) {
            return err;
        }
    }

    @Post("/manageCenter/updateModule")
    async updateModule(@Body() body: any) {
        try {
            return await ModuleService.updateModule(body);
        } catch (err) {
            return err;
        }
    }

    @Post("/manageCenter/deleteModule")
    async deleteModule(@Body() body: any) {
        try {
            return await ModuleService.deleteModule(body);
        } catch (err) {
            return err;
        }
    }

    @Post("/manageCenter/getInfoByPathId")
    async getInfoByPathId(@Body() body: any) {
        try {
            let path = body.pathId ?? "";
            let length = path.split('/').length;
            let ret = null;
            if (length == 2) {
                ret = await ProjectService.getProjectInfoByPathId(body.pathId);
            } else {
                ret = await ModuleService.getModuleInfoByPathId(body.pathId);
            }
            return ret;
        } catch (err) {
            return err;
        }
    }
}