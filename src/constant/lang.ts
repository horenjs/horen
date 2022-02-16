export interface Lang {
  [key: string]: any;
}

const LANG: Lang = {
  setting: {
    "common.collectionPaths": '曲库目录',
    "common.rebuildWhenStart": '启动时重建数据库',
    "common.autoplayWhenStart": '启动时自动播放',
    "appearance.theme": '主题色',
    "appearance.lang": '语言',
  },
  operate: {
    add: '+',
  }
}

export default LANG;