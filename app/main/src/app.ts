import path from 'path';
import { BrowserWindow } from 'electron';
import { logger } from './index';

export const createMainWindow = () => {
  const isDev = process.env.NODE_ENV === 'development';

  logger.debug('new a BrowerWindow.');
  const w = new BrowserWindow({
    width: 1000,
    height: 600,
    // resizable: true,
    movable: true,
    frame: false,
    // transparent: true,
    webPreferences: {
      // import and export the ipc method in preload process.
      preload: path.resolve(__dirname, 'preload.js'),
      // set below three items to true to make more safe.
      // when you set them true,
      // you cannot use electron in renderer process.
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  if (isDev) {
    logger.debug('start development');
    w.loadURL(`http://localhost:3000`).then().catch(console.error);
    // open the chrome dev tools when in development mode.
    // w.webContents.openDevTools();
  } else {
    // 生产环境应使用相对地址
    // 打包后的根目录为 app/
    logger.debug('start production');
    w.loadFile('dist/index.html').then().catch(console.error);
  }

  w.on('closed', () => {
    logger.debug('close the app.');
    w.destroy();
  });

  return w;
};
