import { Action, Controller, Param, Body, Get, Post, Put, Delete, State, UseBefore } from "routing-controllers";
import cacheControl = require('koa-cache-control');
import jwt = require('jsonwebtoken');
import passport from '../passport';
import { validator } from '../middlewares/validator';
import UserService from '../services/common/UserService';
import { loginInfoRule, registerInfoRule, pageAcceessListRule } from '../rules/props'
@Controller()
export class UserController {
     @Post("/users/login")
     @UseBefore(cacheControl({ noStore: true }))
     @UseBefore(validator(loginInfoRule))
     async login(@Body() body: any) {
          try {
               let username = body.username,
                    password = body.password;
               let loginResult = await UserService.login(username, password);
               //登录成功
               let payload = { username: body.username, password: body.password };
               let token = jwt.sign(payload, 'secret');
               return { message: "登录成功！", username: body.username, token: token };
          } catch (err) {
               return err;
          }
     }
     @Post("/users/wxMiniProLogin")
     @UseBefore(cacheControl({ noStore: true }))
     async wxMiniProLogin(@Body() body: any) {
          try {
               let wxMiniProCode = body.code
               await UserService.wxMiniProLogin(wxMiniProCode);
               return { message: "登录成功！", code: wxMiniProCode, token: '' };
          } catch (err) {
               return err;
          }
     }
     @Post("/users/register")
     @UseBefore(cacheControl({ noStore: true }))
     @UseBefore(validator(registerInfoRule))
     async register(@Body() body: any, action: Action) {
          try {
               let userInfo = {
                    username: body.username,
                    password: body.password,
                    passwordQes: body.passwordQes,
                    passwordAns: body.passwordAns
               };
               let loginResult = await UserService.register(userInfo);
               return loginResult;
          } catch (err) {
               return err;
          }
     }
     @Get("/users/loginStatus")
     @UseBefore(cacheControl({ noStore: true }))
     @UseBefore(passport.authenticate('jwt', {session: false}))
     async loginStatus(@Body() body: any, @State() state: any) {
          try {
               let userInfo = state.user.userInfo;
               if (userInfo) {
                    return {success: true, message: state.user.message,userInfo}
               } else {
                    return {success: true, message: state.user.message,userInfo:null}
               }
          } catch (err) {
               return err;
          }
     }
     @Post("/users/logout")
     @UseBefore(cacheControl({ noStore: true }))
     async logout(@Body() body: any, action: Action) {
          try {
               return {success: true, message: '退出成功'};
          } catch (err) {
               return err;
          }
     }
     @Post("/users/getPageAcceessList")
     @UseBefore(cacheControl({ noCache: true }))
     @UseBefore(validator(pageAcceessListRule))
     async getPageAcceessList(@Body() body: any, action: Action) {
          try {
               let data = await UserService.getPageAcceessList(body.userId)
               return {success: true, message: '获取权限列表', data};
          } catch (err) {
               return err;
          }
     }
}