import {createConnection, QueryError, RowDataPacket, Pool, PoolOptions} from 'mysql2';
import _ = require('lodash');
import {logger} from './log';
import FnObj from './FnObj';
import { Dispatch, SelectorDispatch } from './dispatch';
import { query } from './query';
import { join, JoinParams } from './sentence/join';
import { select, SelectParams } from './sentence/select';
import { where, WhereParams } from './sentence/where';
import { insert, InsertParams } from './sentence/insert';
import { update, UpdateParams } from './sentence/update';
import { mixin } from './mixin'

export class Model {
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
  select(selector: string | undefined | SelectorDispatch | any[]): Model {
    //标注类型
    this.clearSqlSections();
    this.actionType = 'select';
    return select.call(this, selector);
  }

  /**
   * SQL更新
   * @param updateObj {Object} 查询配置
   * @return {AudioNode | void}
   */
  update(updateObj: UpdateParams): Model {
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
  insert(insertObj: InsertParams): Model {
    //标注类型
    this.clearSqlSections();
    this.actionType = 'insert';
    return insert.call(this, insertObj);
  }

  /**
   * SQL删除
   * @return {AudioNode | void}
   */
  delete(): Model {
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
  where(whereObj: WhereParams): Model {
    return where.call(this, whereObj);
  }

  /**
   * SQL 关联
   * @param joinObj {Object}
   */
  join(joinObj: {[propName: string]: any}): Model {
    return join.call(this, joinObj);
  }

  /**
   * 数据获取
   * @return {Promise<any>}
   */
  query(): Promise<any> {
    return query.call(this);
  }

  /**
   * SQL连表选择查询
   * @param spaceName {String} 查询配置
   * @param selector {String} 查询配置
   * @return {AudioNode | void}
   */
  mixin(spaceName: string, selector: string | undefined | SelectorDispatch | any[]) {
    return mixin.call(this, spaceName, selector)
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
