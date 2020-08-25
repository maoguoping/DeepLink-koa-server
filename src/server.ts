import "reflect-metadata";
import {createKoaServer} from "routing-controllers";
import passport from "./passport"
import bodyParser = require('koa-bodyparser')
const app = createKoaServer({
    controllers: [__dirname + "/controllers/*.ts"]
});
app.use(bodyParser()) 
app.use(passport.initialize()) 
app.listen(3000);

console.log('Server running on port 3000');