import {createConnection, QueryError, RowDataPacket, Pool, PoolOptions} from 'mysql2';
import log4js = require('log4js');
import _ = require('lodash');
log4js.configure({
  appenders: {cheese: {type: 'file', filename: 'cheese.log'}},
  categories: {default: {appenders: ['cheese'], level: 'info'}}
});
const logger = log4js.getLogger('cheese');
import FnObj from './FnObj';
import { Dispatch } from './dispatch';
import { where, WhereParams } from './sentence/where';
import { insert, InsertParams } from './sentence/insert';
import { update, UpdateParams } from './sentence/update';
export interface SelectorDispatch {
  name: string;
  reducer: () => void;
}
class Model {
  public context: any;
  public _pool: Pool;
  public model: any;
  public sqlSections: {
    insert: string;
    delete: string;
    update: string;
    select: string;
    where: string;
    join: string;
  }
  public actionType: string;
  public _FnObj: any;
  public attrStr: string;
  public _joinField: any;
  public _keyWithField: any;
  public _selectGroup: any;
  public _name: string;
  public tableName: string;
  public data: any;
  public staticData: any;
  [propName: string]: any;
  constructor(context: any, name: string, value: any) {
    this.context = context;
    this._pool = context.pool;
    this.model = value;
    this.sqlSections = {
      insert: '',
      delete: '',
      update: '',
      select: '',
      where: '',
      join: '',
    };
    this.actionType = '';
    this._FnObj = FnObj;
    this.attrStr = '';
    this._joinField = {};
    this._keyWithField = {};
    this._selectGroup = {};
    this._name = name;
    this.tableName = value.tableName;
    this.data = value.data;
    this.staticData = value.staticData;
    let _ = this;
    // 属性代理，实现 vm.xxx -> vm._data.xxx
    Object.keys(value.data).forEach((key) => {
      Object.defineProperty(_, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
          return _.data[key].field;
        }
      })
    });
  }

  /**
   * SQL查询
   * @param selector {String} 查询配置
   * @return {AudioNode | void}
   */
  select(selector: string | undefined | SelectorDispatch | any[]): Model{
    //标注类型
    this.clearSqlSections();
    this.actionType = 'select';
    let arr: any[] = [],
      data = this.data,
      staticData = this.staticData;
    let fullNameChange = function (that: Model, dataArr: any[], tableName: string, arr: any[]) {
      dataArr.length > 0 && dataArr.forEach((name: string) => {
        let fullName = `${tableName}.${that[name]}`;
        that._keyWithField[name] = fullName;
        arr.push(`${fullName} AS ${name}`);
      });
    }
    //无参数
    if (_.isEmpty(selector)) {
      let dataArr = Object.keys(data);
      fullNameChange(this, dataArr, this.tableName, arr);
      if (staticData) {
        let staticDataArr = Object.keys(staticData);
        staticDataArr.length > 0 && staticDataArr.forEach(name => {
          let item = staticData[name];
          let fullName = `${this.tableName}.${item.value}`;
          this._keyWithField[name] = name;
          arr.push(`'${fullName}' AS ${name}`);
        });
      }
      this.sqlSections.select = `SELECT ${arr.join(',')}`;
      this.attrStr = `${arr.join(',')}`;
    } else if (selector instanceof Dispatch) {
      let excludeList = selector.reducer();
      let dataArr = Object.keys(data).filter((name) => {
        return !excludeList.includes(name);
      });
      fullNameChange(this,dataArr,this.tableName,arr);
      if (staticData) {
        let staticDataArr = Object.keys(staticData);
        staticDataArr.length > 0 && staticDataArr.forEach(name => {
          let item = staticData[name];
          this._keyWithField[name] = name;
          arr.push(`'${item.value}' AS ${name}`);
        });
      }
      this.sqlSections.select = `SELECT ${arr.join(',')}`;
      this.attrStr = `${arr.join(',')}`;
    }
    return this;
  }

  /**
   * SQL更新
   * @param updateObj {Object} 查询配置
   * @return {AudioNode | void}
   */
  update(updateObj: UpdateParams) {
    //标注类型
    this.clearSqlSections();
    this.actionType = 'update';
    return update.call(this, updateObj);
  }

  /**
   * SQL插入
   * @param insertObj {Object} 插入配置
   * @return {AudioNode | void}
   */
  insert(insertObj: InsertParams) {
    //标注类型
    this.clearSqlSections();
    this.actionType = 'insert';
    return insert.call(this, insertObj);
  }

  /**
   * SQL删除
   * @return {AudioNode | void}
   */
  delete() {
    //标注类型
    this.clearSqlSections();
    this.actionType = 'delete';
    this.sqlSections.delete = `DELETE FROM ${this.tableName}`;
    return this;
  }

  /**
   * SQL 条件
   * @param whereObj {Object}
   */
  where(whereObj: WhereParams) {
    return where.call(this, whereObj);
  }

  /**
   * SQL 关联
   * @param joinObj {Object}
   */
  join(joinObj: {[propName: string]: any}) {
    let namespaceArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    let namespaceIndex = 0;
    let ModelsArr = Object.keys(joinObj);
    let Models = this.context.Models;
    let joinArr:string [] = [];
    let selectSql = this.sqlSections.select;
    let selectArr:string [] = [];
    ModelsArr.forEach((name) => {
      let model = Models[name];
      //name为混入Model名称
      if (name === this._name) {

      } else {
        let joinOption = joinObj[name];
        let sameModelArr = [];
        if (!Array.isArray(joinOption)) {
          sameModelArr.push(joinOption);
        } else {
          sameModelArr = joinOption;
        }

        sameModelArr.forEach(item => {
          let targetField = model[item.t];
          let sourceField = this[item.s];
          let spaceName = namespaceArr[namespaceIndex++];
          let str = ` LEFT JOIN ${Models[name].tableName} ${spaceName} ON ${spaceName}.${targetField}=${this.tableName}.${sourceField}`;
          joinArr.push(str);
          //join是否存在分组条件
          if (item._selectGroup && item._selectGroup.name) {
            let name = item._selectGroup.name;
            let _selectGroup = this._selectGroup;
            if (!_selectGroup[name]) {
              _selectGroup[name] = [];
            }
            _selectGroup[name].push({
              condition: item._selectGroup.condition,
              fullname: `${spaceName}.${model[item._selectGroup.field]}`
            });
          } else {
            let nameObj: any = {};
            nameObj[name] = [];
            nameObj[name].push(spaceName);
            this._joinField = Object.assign(
              this._joinField, nameObj
            );
            let joinModel = null;
            if (item.select) {
              joinModel = Models[name].mixin(spaceName, item.select);
              selectArr.push(joinModel.attrStr);
            } else {
              joinModel = Models[name].mixin(spaceName);
              selectArr.push(joinModel.attrStr);
            }
            Object.assign(this._keyWithField, joinModel._keyWithField);
          }
        })

      }
    });

    this.sqlSections.join = joinArr.join('');
    // if(selectSql === ''){
    selectSql += `,`;
    // }
    let _selectGroupArr = Object.keys(this._selectGroup);
    _selectGroupArr.forEach((name) => {
      let group = this._selectGroup[name];
      let sql = `CASE `;
      group.forEach((item: any) => {
        sql += `WHEN ${item.condition} THEN ${item.fullname} `
      });
      sql += ` END '${name}'`
      selectArr.push(sql);
    });
    selectSql += selectArr.join(',');
    this.sqlSections.select = selectSql;
    return this;
  }

  /**
   * 数据获取
   * @return {Promise<any>}
   */
  query() {
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
        pool.getConnection((err, connection) => {
          if(err) {
              console.log(err);
              reject(err);
          } else {
              connection.query(_sql, (err, results, fields) => {
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

  /**
   * SQL连表选择查询
   * @param spaceName {String} 查询配置
   * @param selector {String} 查询配置
   * @return {AudioNode | void}
   */
  mixin(spaceName: string, selector: string | undefined | SelectorDispatch | any[]) {
    if (selector == '' || selector == undefined) {
      let arr: string[] = [];
      let data = this.data;
      let staticData = this.staticData;
      let dataArr = Object.keys(data);
      if (dataArr.length > 0) {
        dataArr.forEach(name => {
          let item = data[name];
          let fullName = `${spaceName}.${this[name]}`;
          this._keyWithField[name] = fullName;
          arr.push(`${spaceName}.${this[name]} AS ${name}`);
        });
      }
      if (staticData) {
        let staticDataArr = Object.keys(staticData);
        staticDataArr.length > 0 && staticDataArr.forEach(name => {
          let item = staticData[name];
          this._keyWithField[name] = name;
          arr.push(`'${item.value}' AS ${name}`);
        });
      }
      this.sqlSections.select = `SELECT ${arr.join(',')}`;
      this.attrStr = `${arr.join(',')}`;
    } else if (selector instanceof Dispatch) {
      let arr = [];
      let data = this.data;
      let staticData = this.staticData;
      let dataArr = [];
      if (selector.name === 'exclude') {
        let excludeList = selector.reducer();
        dataArr = Object.keys(data).filter((name) => {
          return !excludeList.includes(name);
        });
        if (dataArr.length > 0) {
          dataArr.forEach(name => {
            let item = data[name];
            let fullName = `${spaceName}.${this[name]}`;
            this._keyWithField[name] = fullName;
            arr.push(`${fullName} AS ${name}`);
          });
        }
      } else if (selector.name === 'definition') {
        let definition = selector.reducer(this.context.Models[this._name], spaceName);
        arr.push(definition);
      }

      if (staticData) {
        let staticDataArr = Object.keys(staticData);
        staticDataArr.length > 0 && staticDataArr.forEach(name => {
          let item = staticData[name];
          this._keyWithField[name] = name;
          arr.push(`'${item.value}' AS ${name}`);
        });
      }
      this.sqlSections.select = `SELECT ${arr.join(',')}`;
      this.attrStr = `${arr.join(',')}`;
    }
    return this;
  }
  /**
   * SQL清空
   * @param spaceName {String} 查询配置
   * @param selector {String} 查询配置
   * @return {AudioNode | void}
   */
  clearSqlSections() {
    this.sqlSections = {
      insert: '',
      delete: '',
      update: '',
      select: '',
      where: '',
      join: '',
    };
  }
}

export default Model;
