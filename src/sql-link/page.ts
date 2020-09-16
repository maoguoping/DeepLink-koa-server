import {createConnection, QueryError, RowDataPacket, Pool, PoolOptions} from 'mysql2';
import { Model } from './model';
type Order = {
  type: string;
  by: string;
}
export type PageOption = {
  order: Order;
  limit: {
    index: number;
    size: number;
  }
}

export interface PageFun {
  (model: Model, option: PageOption): Page
}
export class Page {
  public model: Model;
  public pool: Pool;
  public order: Order;
  public limit: {
    index: number;
    size: number;
  };
  public sql: string;
  constructor(model: Model, option: PageOption) {
    this.model = model;
    this.pool = model._pool;
    this.order = option.order;
    this.limit = option.limit;
    let index = this.limit.index;
    let size = this.limit.size;
    let whereSections = '';
    if (model.sqlSections.where) {
      whereSections += ` WHERE ${model.sqlSections.where}`
    }
    this.sql = `SELECT SQL_CALC_FOUND_ROWS ${model.sqlSections.select.slice(6)} FROM ${model.tableName} ${model.sqlSections.join} ${whereSections} ORDER BY ${model._keyWithField[this.order.by]} ${this.order.type} LIMIT ${(index -1)*size},${size};SELECT FOUND_ROWS() as total`
  }
  /**
   * 数据获取
   * @return {Promise<any>}
   */
  query() {
    let pool = this.pool;
    let sql = this.sql;
    console.log(`${Date()} mysql:`);
    console.log(sql);
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        console.log(err);
        connection.query(sql, (err, results, fields) => {
          if (err) {
            reject(err)
          } else {
            resolve(results);
          }
          // 释放连接
          connection.release();
        });
      });
    });
  }
}
