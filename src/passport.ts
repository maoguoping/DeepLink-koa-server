'use strict';

/*!
 * Module dependencies.
 */
import jwt = require('jsonwebtoken');
import { Strategy as LocalStrategy } from 'passport-local';
import passport = require('koa-passport')
import passportJWT = require("passport-jwt");
import { Strategy } from 'passport-local';
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
import UserService from './services/common/userService';
const userFilter = (user: any) => {
  let { username, userId, userTickName, status, roleId, roleName, createTime, lastLoginTime, loginCount } = user;
  return { username, userId, userTickName, status, roleId, roleName, createTime, lastLoginTime, loginCount };
}
let opts = {
  jwtFromRequest: ExtractJwt.fromHeader('token'),
  secretOrKey: 'secret'
};
/**
 * Expose
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  let error = {};
  let user = null;
  let userInfo = null;
  try {
    let serviceRes: any = await UserService.getUserListByUserName(jwt_payload.username);
    if (serviceRes.length > 0) {
      user = serviceRes[0];
      userInfo = userFilter(user)
      if (user.username === jwt_payload.username && user.password === jwt_payload.password) {
        done(null, { success: true, userInfo, message: '登录验证通过!' });
      } else {
        done(null, { success: false, userInfo, message: '登录验证失败!' });
      }
    } else {
      done(null, { success: false, userInfo, message: '登录验证失败!' });
    }
  } catch (e) {
    done(e);
  }

}));
export default passport;
