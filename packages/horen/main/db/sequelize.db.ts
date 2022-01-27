/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-26 10:46:26
 * @LastEditTime : 2022-01-27 10:36:39
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\db\sequelize.db.ts
 * @Description  : 
 */
import { Sequelize, Options } from 'sequelize';
import debug from 'debug';
import path from 'path';
import { APP_DATA_PATH, APP_NAME } from '../../constant';

const mydebug = debug('horen:db');

const dbConfig: Options = {
  dialect: 'sqlite',
  storage: path.join(APP_DATA_PATH, APP_NAME, 'horen.sqlite'),
  logging: false,
};

const sql = new Sequelize(dbConfig);

(async () => {
  try {
    await sql.authenticate();
    mydebug('成功连接 sqlite 数据库');
  } catch (err) {
    mydebug('连接 sqlite 数据库失败');
  }
})();

export default sql;
