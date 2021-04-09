import * as Koa from "koa";
import { Rule } from "../rules/props"
export const validator = (rule: Rule) => {
  return async (ctx: Koa.Context, next: () => Promise<any>): Promise<any> => {
    try {
      ctx.verifyParams(rule);
      await next()
    } catch (err) {
      ctx.throw(err)
    }
  }
} 