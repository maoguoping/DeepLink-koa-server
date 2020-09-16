import {createConnection, QueryError, RowDataPacket, Pool, PoolOptions, PoolConnection} from 'mysql2';
import { Model } from './model'
export class ModelList {
    public list: Model[];
    public pool: Pool;
    constructor(list: any[]) {
       this.list = list;
       this.pool = list[0]._pool;
    }

    /**
     * 数据获取
     * @return {Promise<any>}
     */
    query() {
        let pool = this.pool;
        let sqlList = this.list.map((_this)=>{
            let _sql ='';
            let sections = _this.sqlSections;
            _sql += sections.insert||sections.delete||sections.update||sections.select;
            if(sections.select){
                _sql += ` FROM ${_this.tableName}`
            }
            _sql += sections.join || '';
            _sql += sections.where || '';
            return _sql;
        });
        let sql = sqlList.join(';');
        console.log(`${Date()} mysql:`);
        console.log(sql);
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection: PoolConnection) => {
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
