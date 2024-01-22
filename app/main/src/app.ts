import path from 'path';
import { BrowserWindow } from 'electron';
import { PORT } from './constant';

export const createMainWindow = () => {
  const isDev = process.env.NODE_ENV === 'development';

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
    w.loadURL(`http://localhost:3000`).then().catch(console.error);
    // open the chrome dev tools when in development mode.
    w.webContents.openDevTools();
  } else {
    // 生产环境应使用相对地址
    // 打包后的根目录为 app/
    w.loadFile('./index.html').then().catch(console.error);
  }

  w.on('closed', () => {
    w.destroy();
  });

  return w;
};
