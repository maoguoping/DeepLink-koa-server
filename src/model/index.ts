import config from '../../config';
import { SqlLink } from '../sql-link/sqlLink';
import path = require('path')
const sqlLink: SqlLink = new SqlLink({
  dbConfig: config.mysql,
  modelPath: __dirname
});

export default sqlLink