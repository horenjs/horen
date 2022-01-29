/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 15:03:33
 * @LastEditTime : 2022-01-29 20:07:00
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\main\ipc\setting.ipc.ts
 * @Description  :
 */
import path from 'path';
import fs from 'fs/promises';
import { ipcMain } from 'electron';
import debug from 'debug';
import {
  IPC_CODE,
  APP_DATA_PATH,
  APP_NAME,
  DEFAULT_SETTING,
} from '../../constant';
import { SettingFile } from '../../types';

const mydebug = debug('horen:ipc:setting');
/**
 * 更新设置选项
 */
ipcMain.handle(IPC_CODE.setting.set, async (evt, setting) => {
  try {
    await fs.writeFile(
      path.join(APP_DATA_PATH, APP_NAME, 'setting.user.json'),
      JSON.stringify(setting, null, 2)
    );
    mydebug('设置更新成功' + new Date());
    return true;
  } catch (err) {
    mydebug('设置更新失败');
    return false;
  }
});

/**
 * 获取设置选项
 */
ipcMain.handle(IPC_CODE.setting.get, async (evt) => {
  const p = path.join(APP_DATA_PATH, APP_NAME, 'setting.user.json');

  try {
    await fs.stat(path.join(APP_DATA_PATH, APP_NAME));
  } catch (err) {
    mydebug('设置文件不存在 新建设置文件')
    await fs.mkdir(path.join(APP_DATA_PATH, APP_NAME));
  }

  try {
    const settingStr = await fs.readFile(p, { encoding: 'utf-8' });
    const userSetting = JSON.parse(settingStr) as SettingFile;

    if (userSetting.version === DEFAULT_SETTING.version) {
      mydebug('设置获取成功');
      return userSetting;
    } else {
      mydebug('设置版本号已更新重新生成设置项');
      await fs.writeFile(p, JSON.stringify(DEFAULT_SETTING));
      return DEFAULT_SETTING;
    }
  } catch (err) {
    mydebug('获取设置失败 返回默认设置');
    await fs.writeFile(p, JSON.stringify(DEFAULT_SETTING));
    return DEFAULT_SETTING;
  }
});
