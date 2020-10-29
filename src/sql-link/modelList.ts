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
    async query() {
        let pool = this.pool;
        let sqlList = this.list.map((_this)=>{
            let _sql ='';
            let sections = _this.sqlSections;
            _sql += sections.insert||sections.delete||sections.update||sections.select;
            if(sections.select){
                _sql += ` FROM ${_this.tableName}`
            }
            _sql += sections.join ? `JOIN ${sections.where}` : '';
            _sql += sections.where ? `WHERE ${sections.where}`: '';
            return _sql;
        });
        let sql = sqlList.join(';');
        console.log(`${Date()} mysql:`);
        console.log(sql);
        let res = []
        for(let i = 0; i < sqlList.length; i++) {
            try {
                let result = await fn(sqlList[i])
                res[i] = result
            } catch (err) {
                throw new Error(err)
            }
        }
        function fn(sql: string) {
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
        return res
    }
}
