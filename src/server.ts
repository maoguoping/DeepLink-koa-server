import "reflect-metadata"
import {createKoaServer} from "routing-controllers"
import passport from "./passport"
import helmet = require("koa-helmet") 
import parameter = require('koa-parameter')
import bodyParser = require('koa-bodyparser')
import conditional = require('koa-conditional-get');
import etag = require('koa-etag');
const app = createKoaServer({
    controllers: [__dirname + "/controllers/*.ts"]
});
app.use(helmet())
app.use(conditional());
app.use(etag());
app.use(bodyParser()) 
app.use(parameter(app));
app.use(passport.initialize()) 
app.listen(3000);

console.log('Server running on port 3000');