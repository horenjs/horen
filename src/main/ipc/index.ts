/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 10:40:55
 * @LastEditTime : 2022-05-07 23:30:53
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\src\main\ipc\index.ts
 * @Description  :
 */
import { ipcMain } from 'electron';
import { IPC_CODE } from 'constant';
import { handleDialogOpen } from './dialog.ipc';
import {
  handleCloseMainwindow,
  handleMinimizeMainwindow,
  handleSetMainwindowBounds,
  handleSetMainwindowProgress,
  handleSetMainwindowTitle,
  handleGetMainwindowBounds,
} from './mainwindow.ipc';
import {
  handleGetPlaylistByTitle,
  handleSetPlaylist,
  handleGetPlaylist,
} from './playlist.ipc';
import { handleSetSetting, handleGetSetting } from './setting.ipc';
import {
  handleGetTrackList,
  handleGetAlbumList,
  handleRebuildCache,
  handleGetTrackBySrc,
  handleGetAlbumByKey,
  handleGetAlbumCover,
  handleGetTrackLyric,
} from './track.ipc';

/**
 * 对话框
 */
ipcMain.handle(IPC_CODE.dialog.open, handleDialogOpen); // 打开对话框

/**
 * 主窗口
 */
ipcMain.handle(IPC_CODE.mainwindow.close, handleCloseMainwindow);             // 关闭主窗口
ipcMain.handle(IPC_CODE.mainwindow.minimize, handleMinimizeMainwindow);       // 最小化主窗口
ipcMain.handle(IPC_CODE.mainwindow.setTitle, handleSetMainwindowTitle);       // 设置主窗口状态栏标题
ipcMain.handle(IPC_CODE.mainwindow.setProgress, handleSetMainwindowProgress); // 设置主窗口状态栏进度条
ipcMain.handle(IPC_CODE.mainwindow.setBounds, handleSetMainwindowBounds);     // 设置主窗口边界
ipcMain.handle(IPC_CODE.mainwindow.getBounds, handleGetMainwindowBounds);     // 获取主窗口边界

/**
 * 播放列表
 */
ipcMain.handle(IPC_CODE.playlist.getList, handleGetPlaylist);    // 获取所有播放列表
ipcMain.handle(IPC_CODE.playlist.set, handleSetPlaylist);        // 写入播放列表
ipcMain.handle(IPC_CODE.playlist.get, handleGetPlaylistByTitle); // 获取指定播放列表（通过标题）

/**
 * 设置项
 */
ipcMain.handle(IPC_CODE.setting.set, handleSetSetting); // 写入设置
ipcMain.handle(IPC_CODE.setting.get, handleGetSetting); // 读取设置

/**
 * 音频
 */
ipcMain.handle(IPC_CODE.track.getTrackList, handleGetTrackList);   // 获取所有音频
ipcMain.handle(IPC_CODE.track.getAlbumList, handleGetAlbumList);   // 获取所有专辑
ipcMain.handle(IPC_CODE.track.rebuildCache, handleRebuildCache);   // 重建缓存
ipcMain.handle(IPC_CODE.track.getBySrc, handleGetTrackBySrc);      // 获取音频（通过文件地址）
ipcMain.handle(IPC_CODE.track.getAlbumByKey, handleGetAlbumByKey); // 获取专辑（通过专辑索引值）
ipcMain.handle(IPC_CODE.track.getAlbumCover, handleGetAlbumCover); // 获取专辑封面
ipcMain.handle(IPC_CODE.track.lyric, handleGetTrackLyric);         // 获取音频歌词
