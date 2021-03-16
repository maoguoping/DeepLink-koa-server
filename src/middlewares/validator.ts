export const validator = (rule: any) => {
  return async (ctx: any, next: () => Promise<any>): Promise<any> => {
    try {
      ctx.verifyParams(rule);
      await next()
    } catch (err) {
      ctx.throw(err)
    }
  }
} 