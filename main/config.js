const path = require('path');

const MUSIC_EXTS = [
  'mp3',
  'mp4',
  'm4a',
  'm4b',
  'aac',
  'flac',
  'ape',
  'wav',
  'ogg',
]

const USER_CONFIG_PATH = path.resolve(__dirname, '../public/config.user.json');
const DEFAULT_CONFIG_PATH = path.resolve(__dirname, '../public/config.json');

module.exports = {
  MUSIC_EXTS,
  USER_CONFIG_PATH,
  DEFAULT_CONFIG_PATH,
}