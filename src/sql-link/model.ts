import {createConnection, QueryError, RowDataPacket, Pool, PoolOptions} from 'mysql2';
import {logger} from './log';
import FnObj from './FnObj';
import { Dispatch, SelectorDispatch } from './dispatch';
import { query, queryTest } from './query';
import { join, SelectGroup, JoinField, KeyWithField, JoinParams } from './sentence/join';
import { select, SelectParams } from './sentence/select';
import { where, WhereParams } from './sentence/where';
import { insert, InsertParams } from './sentence/insert';
import { update, UpdateParams } from './sentence/update';
import { mixin } from './mixin'
import { ACTION_TYPE_LIST } from './constant'
import { SqlLink, SourceModel, ModelData, StaticData } from './index'
export class Model {
  public context: SqlLink;
  public _pool: Pool;
  public model: SourceModel;
  public sqlSections: {
    insert: string;
    delete: string;
    update: string;
    select: string;
    where: string;
    join: string;
  }
  public actionType: string;
  public _FnObj: Function;
  public attrStr: string;
  public _joinField: JoinField;
  public _keyWithField: KeyWithField;
  public _selectGroup: SelectGroup;
  public _name: string;
  public tableName: string;
  public data: ModelData;
  public staticData?: StaticData | undefined;
  [propName: string]: any;
  constructor(context: SqlLink, name: string, value: SourceModel) {
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
    this._joinField = Object.create(null);
    this._keyWithField = Object.create(null);
    this._selectGroup = Object.create(null);
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
        get: function proxyGetter(): string {
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
  select(selector?: string | undefined | SelectorDispatch | any[] | Record<string, any>): Model {
    //标注类型
    let model = this.initModel()
    model.actionType = 'select';
    return select(model, selector);
  }

  /**
   * SQL更新
   * @param updateObj {Object} 查询配置
   * @return {AudioNode | void}
   */
  update(updateObj: UpdateParams): Model {
    //标注类型
    let model = this.initModel()
    model.actionType = 'update';
    return update(model, updateObj);
  }

  /**
   * SQL插入
   * @param insertObj {Object} 插入配置
   * @return {AudioNode | void}
   */
  insert(insertObj: InsertParams): Model {
    //标注类型
    let model = this.initModel()
    model.actionType = 'insert';
    return insert(model, insertObj);
  }

  /**
   * SQL删除
   * @return {AudioNode | void}
   */
  delete(): Model {
    //标注类型
    let model = this.initModel()
    model.actionType = 'delete';
    model.sqlSections.delete = `DELETE FROM ${this.tableName}`;
    return model;
  }

  /**
   * SQL 条件
   * @param whereObj {Object}
   */
  where(whereObj: WhereParams): Model {
    return where(this, whereObj);
  }

  /**
   * SQL 关联
   * @param joinObj {Object}
   */
  join(joinObj: JoinParams): Model {
    return join(this, joinObj);
  }

  /**
   * 数据获取
   * @return {Promise<any>}
   */
  query(): Promise<any>{
    return query(this);
  }
  /**
   * 数据获取sql测试
   * @return {string}
   */
  queryTest(): string{
    return queryTest(this);
  }
  /**
   * SQL连表选择查询
   * @param spaceName {String} 查询配置
   * @param selector {String} 查询配置
   * @return {AudioNode | void}
   */
  mixin(spaceName: string, selector: string | undefined | SelectorDispatch | any[]): Model {
    return mixin(this, spaceName, selector)
  }
  /**
   * SQL清空
   */
  clearSqlSections(): void {
    this.sqlSections = {
      insert: '',
      delete: '',
      update: '',
      select: '',
      where: '',
      join: '',
    };
  }
  /**
   * 设置当前actionType
   */
  setActionType(type: string): void {
    if (ACTION_TYPE_LIST.includes(type)) {
      this.actionType = type
    } else {
      throw new TypeError(`${type}的可用值为：${ACTION_TYPE_LIST.join(',')}`)
    }
  }
  initModel(): Model {
    let model = new Model(this.context, this._name, this.model)
    return model
  }
}
export type Models = Record<string, Model>
