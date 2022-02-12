/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-26 10:46:26
 * @LastEditTime : 2022-01-30 01:37:39
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\main\db\sequelize.db.ts
 * @Description  : 
 */
import { Sequelize, Options } from 'sequelize';
import debug from '../utils/logger';
import path from 'path';
import { APP_DATA_PATH, APP_NAME } from 'constant';

const mydebug = debug('db');

const dbConfig: Options = {
  dialect: 'sqlite',
  storage: path.join(APP_DATA_PATH, APP_NAME, 'horen.sqlite'),
  logging: false,
};

const sql = new Sequelize(dbConfig);

(async () => {
  try {
    await sql.authenticate();
    mydebug.info('成功连接 sqlite 数据库');
  } catch (err) {
    mydebug.error('连接 sqlite 数据库失败');
  }
})();

export default sql;
