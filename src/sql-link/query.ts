import {createConnection, QueryError, RowDataPacket, Pool, PoolOptions, PoolConnection} from 'mysql2';
import { logger } from './log';
export function query () {
  let pool = this._pool;
    let _sql = '';
    let sections = this.sqlSections;
    _sql += sections.insert || sections.delete || sections.update || sections.select;
    if (sections.select) {
      _sql += ` FROM ${this.tableName}`
    }
    _sql += sections.join || '';
    if (sections.where) {
      _sql += ` WHERE ${sections.where}`
    }
    console.log(_sql);
    logger.info(_sql);
    if(this.context.isTest) {
      return _sql;
    } else {
      return new Promise((resolve, reject) => {
        pool.getConnection((err: any, connection: PoolConnection) => {
          if(err) {
              console.log(err);
              reject(err);
          } else {
              connection.query(_sql, (err : any, results: any, fields: any) => {
                  if (err) {
                      reject(err)
                  } else {
                      resolve(results);
                  }
                  // 释放连接
                  connection.release();
              });
          }
        });
      });
    } 
}