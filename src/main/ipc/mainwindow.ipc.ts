/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-29 00:37:56
 * @LastEditTime : 2022-05-07 21:00:38
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\src\main\ipc\mainwindow.ipc.ts
 * @Description  :
 */
import { Rectangle } from 'electron';
import myapp from '../app';
import loggerUtil from '../utils/logger.util';
import { resp } from '../utils';
import { mydebug } from './track.ipc';

const mylogger = loggerUtil('ipc:mainwindow');

/**
 * close the main window
 */
export async function handleCloseMainwindow() {
  mylogger.debug('main window close: ' + new Date());
  setTimeout(() => myapp.mainWindow?.destroy(), 500);
}

/**
 * minimize the main window
 */
export async function handleMinimizeMainwindow() {
  mylogger.debug('main window minimize');
  myapp.mainWindow?.minimize();
}

/**
 * set the main window title
 * @param evt ipc event
 * @param title main window title
 * @returns resp
 */
export async function handleSetMainwindowTitle(evt: unknown, title: string) {
  mylogger.debug(`set the main window title: ${title}`);
  try {
    myapp.mainWindow?.setTitle(title);
    return resp(1, 'set title success');
  } catch (err) {
    mydebug.error('set title failed');
    return resp(0, 'set title failed');
  }
}

/**
 * set the main window progress bar
 * @param evt ipc event
 * @param progress progress
 * @returns resp
 */
export async function handleSetMainwindowProgress(
  evt: unknown,
  progress: number
) {
  // mylogger.debug(`set the main window progress: ${progress}`);
  try {
    myapp.mainWindow?.setProgressBar(progress);
    return resp(1, 'set progress success');
  } catch (err) {
    mydebug.error('set progress failed');
    return resp(0, 'set progress failed');
  }
}

/**
 * set the main window bounds
 * @param evt ipc event
 * @param bounds main window bounds
 * @returns resp
 */
export async function handleSetMainwindowBounds(
  evt: unknown,
  bounds: Rectangle
) {
  mylogger.debug(
    `set the main window size: x: ${bounds.x}, y: ${bounds.y}, width: ${bounds.width}, height: ${bounds.height}`
  );
  try {
    myapp.mainWindow?.setBounds(bounds);
    mydebug.debug('set bounds success');
    return resp(1, 'set bounds success');
  } catch (err) {
    mydebug.error('set bounds failed');
    return resp(0, 'set bounds failed');
  }
}

/**
 * get the main window bounds
 * @returns resp
 */
export async function handleGetMainwindowBounds() {
  const rectangle = myapp.mainWindow?.getBounds();
  if (rectangle) {
    mydebug.debug('get bounds success');
    return resp(1, 'get bounds success', rectangle);
  }
}
