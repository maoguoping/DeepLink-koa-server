import "reflect-metadata"
import {createKoaServer} from "routing-controllers"
import * as Koa from "koa";
import passport from "./passport"
import helmet = require("koa-helmet") 
import parameter = require('koa-parameter')
import bodyParser = require('koa-bodyparser')
import conditional = require('koa-conditional-get');
import etag = require('koa-etag');
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: "https://454414be58fd4d97a5acce40dfc125e2@o563314.ingest.sentry.io/5703186" })
const app = createKoaServer({
    controllers: [__dirname + "/controllers/*.ts"]
});
app.use(helmet())
app.use(conditional());
app.use(etag());
app.use(bodyParser()) 
app.use(parameter(app));
app.use(passport.initialize())
app.on("error", (err: any, ctx: Koa.Context) => {
    Sentry.withScope(function(scope) {
      scope.addEventProcessor(function(event) {
        return Sentry.Handlers.parseRequest(event, ctx.request);
      });
      Sentry.captureException(err);
    });
  });
app.listen(3000);

console.log('Server running on port 3000');