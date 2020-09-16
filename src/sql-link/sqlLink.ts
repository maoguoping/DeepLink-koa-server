import mysql = require('mysql2') ;
import fs = require('fs');
import path = require('path');
import { Pool, PoolOptions} from 'mysql2';
import { Model } from './model';
import { ModelList } from './modelList';
import { Page } from './page';
import { Fn } from './fn';
export interface SqlLinkOption {
    dbConfig: PoolOptions;
    modelPath: string;
    test?: Boolean
}
export class SqlLink {
    public Fn: any;
    public Models: any;
    public ModelList: any;
    public modelNameList: string[];
    public Page: any;
    private dbConfig: any;
    private pool: Pool;
    private isTest: Boolean;
    public constructor(option: SqlLinkOption) {
        this.poolInit(option.dbConfig);
        this.isTest = option.test;
        this.Fn = Fn;
        this.Page = Page;
        this.dataBind(option.modelPath);
    }

    /**
     * 数据库初始化
     */
    poolInit(dbConfig: PoolOptions) {
        this.dbConfig = dbConfig;
        this.pool = mysql.createPool(dbConfig);
    }

    /**
     * 对象列表数据绑定
     * @param modelPath {Object} 数据库model
     */
    dataBind(modelPath: string) {
        let models: any = {};
        let _models: any = {};
        let modelLists: string[] = this.findModel(modelPath);
        modelLists.forEach((item: string) => {
            let name = path.basename(item, '.ts');
            name = name.replace(name[0], name[0].toLowerCase());
            let value = require(item)
            // if(name === 'user') console.log(value)
            models[name] = new Model(this, name, value.Model);
            _models[name] = item
        })
        this.Models = models;
        this.modelNameList = Object.keys(_models)
    }

     /**
     * 递归查找model
     * @param dirPath {String} 数据库model文件夹
     */
    findModel(dirPath: string): string[] {
        console.log('名称', dirPath);
        if (fs.existsSync(dirPath)) {
            const files: string[] = fs.readdirSync(dirPath);
            const modelLists: any = [];
            function finder(curPath: string) {
                console.log('名称', curPath);
                for(let i = 0; i < files.length; i++) {
                    const fpath: string = path.join(curPath, files[i]);
                    const stats: fs.Stats = fs.statSync(fpath);
                    if (stats.isDirectory()) { finder(fpath); }
                    if (stats.isFile() && path.extname(files[i]) === '.ts' && files[i] !== 'index.ts') {
                        modelLists.push(fpath);
                    }
                }
            }
            finder(dirPath);
            console.log('模块', modelLists.join('##'));
            return modelLists
        } else {
            return []
        }
    }
}