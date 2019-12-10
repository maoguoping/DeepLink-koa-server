import "reflect-metadata";
import {createKoaServer} from "routing-controllers";
import {ApiController} from "./controllers/apiController";
const app = createKoaServer({
    controllers: [ApiController] // we specify controllers we want to use
});
app.listen(3000);

console.log('Server running on port 3000');