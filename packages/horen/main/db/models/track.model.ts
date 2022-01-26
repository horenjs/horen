/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-26 10:46:26
 * @LastEditTime : 2022-01-26 10:52:37
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen\main\db\models\track.model.ts
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
  },
  title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  path: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  authors: { type: DataTypes.STRING, allowNull: true },
  tags: { type: DataTypes.STRING, allowNull: true },
  ext: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  expert: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  content: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  buf: { type: DataTypes.STRING, allowNull: true },
  md5: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
};

const configs = {
  sequelize: db,
  modelName: 'File',
  timestamps: false,
};

const TrackModel = db.define('File', field, configs);

(async () => {
  await TrackModel.sync({ force: true });
})();

export default TrackModel;
