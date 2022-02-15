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
  },
  src: { type: DataTypes.STRING, allowNull: true, primaryKey: true, },
  title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  artist: { type: DataTypes.STRING, allowNull: true },
  artists: { type: DataTypes.STRING, allowNull: true },
  album: { type: DataTypes.STRING, allowNull: true },
  //
  duration: { type: DataTypes.NUMBER, allowNull: true },
  date: { type: DataTypes.STRING, allowNull: true },
  genre: { type: DataTypes.STRING, allowNull: true },
  picture: { type: DataTypes.STRING, allowNull: true },
  //
  albumKey: { type: DataTypes.STRING, allowNull: false, defaultValue: '', }
};

const configs = {
  sequelize: db,
  modelName: 'Track',
  timestamps: false,
};

const TrackModel = db.define('Track', field, configs);

export default TrackModel;
