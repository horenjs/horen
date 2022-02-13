/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-26 10:46:26
 * @LastEditTime : 2022-01-28 23:41:41
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\main\db\models\track.model.ts
 * @Description  :
 */
import { DataTypes } from 'sequelize';
import db from '../index';

const field = {
  createAt: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
  updateAt: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
  modifiedAt: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
  uuid: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  key: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
};

const configs = {
  sequelize: db,
  modelName: 'Album',
  timestamps: false,
};

const AlbumModel = db.define('Album', field, configs);

export default AlbumModel;
