/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-26 10:46:26
 * @LastEditTime : 2022-01-27 22:48:13
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\db\models\track.model.ts
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
  src: { type: DataTypes.STRING, allowNull: true },
  title: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  year: { type: DataTypes.NUMBER, allowNull: true },
  artist: { type: DataTypes.STRING, allowNull: true },
  artists: { type: DataTypes.STRING, allowNull: true },
  albumartist: { type: DataTypes.STRING, allowNull: true },
  album: { type: DataTypes.STRING, allowNull: true },
  duration: { type: DataTypes.NUMBER, allowNull: true },
  date: { type: DataTypes.STRING, allowNull: true },
  originldate: { type: DataTypes.STRING, allowNull: true },
  originlyear: { type: DataTypes.STRING, allowNull: true },
  comment: { type: DataTypes.STRING, allowNull: true },
  genre: { type: DataTypes.STRING, allowNull: true },
  picture: { type: DataTypes.STRING, allowNull: true },
  composer: { type: DataTypes.STRING, allowNull: true },
  md5: { type: DataTypes.STRING, allowNull: true },
};

const configs = {
  sequelize: db,
  modelName: 'Track',
  timestamps: false,
};

const TrackModel = db.define('Track', field, configs);

(async () => {
  await TrackModel.sync({ force: true });
})();

export default TrackModel;
