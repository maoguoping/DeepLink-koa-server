import config from '../../config';
import { createLink } from '../sql-link';
import path = require('path')
const sqlLink = createLink({
  dbConfig: config.mysql,
  modelPath: __dirname
});

export default sqlLink