import { Action, Controller, Param, Body, Get, Post, Put, Delete, State, UseBefore } from "routing-controllers";
import UserService from '../services/common/UserService';
import jwt = require('jsonwebtoken');
import passport from '../passport';
@Controller()
export class UserController {
     @Post("/users/login")
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
     @Post("/users/register")
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
     async logout(@Body() body: any, action: Action) {
          try {
               return {success: true, message: '退出成功'};
          } catch (err) {
               return err;
          }
     }
}