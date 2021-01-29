import { PoolConnection, Pool } from 'mysql2';
import { logger } from './log';
import { Model } from './model'
export function query (model: Model): Promise<Model>{
  let pool: Pool = model._pool;
    let _sql = '';
    let sections = model.sqlSections;
    _sql += sections.insert || sections.delete || sections.update || sections.select;
    if (sections.select) {
      _sql += ` FROM ${model.tableName}`
    }
    _sql += sections.join || '';
    if (sections.where) {
      _sql += ` WHERE ${sections.where}`
    }
    console.log(_sql);
    logger.info(_sql);
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
export function queryTest (model: Model): string{
  let pool: Pool = model._pool;
  let _sql = '';
  let sections = model.sqlSections;
  _sql += sections.insert || sections.delete || sections.update || sections.select;
  if (sections.select) {
    _sql += ` FROM ${model.tableName}`
  }
  _sql += sections.join || '';
  if (sections.where) {
    _sql += ` WHERE ${sections.where}`
  }
  console.log(_sql);
  logger.info(_sql);
  return _sql
}