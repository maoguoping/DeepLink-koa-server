import { Controller, Param, Body, Get, Post, Put, Delete, Ctx, UseBefore, State } from "routing-controllers";
import UserSettingService from '../services/setting/userSettingService';
import RoleSettingService from '../services/setting/roleSettingService';
import RightSettingService from '../services/setting/rightSettingService';
import { IGetRightListParams, IGetRoleListParams, IGetUserListParams} from '../typings/service';
import passport from '../passport';
@Controller()
export class SettingController {
    // 获取用户列表
    @Post("/setting/getUserList")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async getUserList(@Body() body: any, @Ctx() ctx: any) {
        try {
            console.log('ctx', ctx);
            let searchData: any = JSON.parse(body.searchData);
            let res = await UserSettingService.getUserList(searchData);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 保存用户信息
    @Post("/setting/saveUserInfo")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async saveUserInfo(@Body() body: any) {
        try {
            let userInfo: any = JSON.parse(body.userInfo);
            let res = await UserSettingService.saveUserInfo(userInfo);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 获取角色列表
    @Post("/setting/getRoleList")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async getRoleList(@Body() body: any) {
        try {
            let searchData: any = JSON.parse(body.searchData);
            let res = await RoleSettingService.getRoleList(searchData);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 检查角色是否存在
    @Post("/setting/checkRoleExist")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async checkRoleExist(@Body() body: any) {
        try {
            let roleInfo: any = JSON.parse(body.roleInfo);
            let type: string = body.type;
            let res = await RoleSettingService.checkRoleExist(roleInfo, type);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 新增角色
    @Post("/setting/addRole")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async addRole(@Body() body: any) {
        try {
            let roleInfo: any = JSON.parse(body.roleInfo);
            let type: string = body.type;
            let res = await RoleSettingService.addRole(roleInfo);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 更新角色
    @Post("/setting/updateRole")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async updateRole(@Body() body: any) {
        try {
            let roleInfo: any = JSON.parse(body.roleInfo);
            let type: string = body.type;
            let res = await RoleSettingService.updateRole(roleInfo);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 获取权限列表
    @Post("/setting/getRightList")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async getRightList(@Body() body: any) {
        try {
            let searchData: any = JSON.parse(body.searchData);
            let res = await RightSettingService.getRightList(searchData);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 获取权限列表
    @Post("/setting/getRoleByRight")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async getRoleByRight(@Body() body: any) {
        try {
            let searchData: any = JSON.parse(body.searchData);
            let res = await RightSettingService.getRoleByRight(searchData);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 新增缺陷
    @Post("/setting/addRight")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async addRight(@Body() body: any) {
        try {
            let rightInfo: any = JSON.parse(body.rightInfo);
            let res = await RightSettingService.addRight(rightInfo);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 更新缺陷
    @Post("/setting/updateRight")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async updateRight(@Body() body: any) {
        try {
            let rightInfo: any = JSON.parse(body.rightInfo);
            let res = await RightSettingService.updateRight(rightInfo);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 删除缺陷
    @Post("/setting/deleteRight")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async deleteRight(@Body() body: any) {
        try {
            let rightInfo: any = JSON.parse(body.rightInfo);
            let res = await RightSettingService.deleteRight(rightInfo);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 验证权限是否存在
    @Post("/setting/checkRightExist")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async checkRightExist(@Body() body: any) {
        try {
            let rightInfo: any = JSON.parse(body.rightInfo);
            let type: string = body.type;
            let res = await RightSettingService.checkRightExist(rightInfo, type);
            return res;
        } catch (err) {
            return err;
        }
    }
    // 修改角色权限
    @Post("/setting/changeRoleRight")
    @UseBefore(passport.authenticate('jwt', {session: false}))
    async changeRoleRight(@Body() body: any) {
        try {
            let changeInfo: any = JSON.parse(body.changeInfo);
            let res = await RightSettingService.changeRoleRight(changeInfo);
            return res;
        } catch (err) {
            return err;
        }
    }
}