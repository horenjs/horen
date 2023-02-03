import "reflect-metadata";
import { app, BrowserWindow } from "electron";
import path from "path";
import Eipc from "./eipc";
import channels from "./channels";
import MyHandler from "./handlers/my-handler";

const isDev = process.env["NODE_ENV"] === "development";

app.whenReady().then(() => {
  // create main window
  createWindow().then(r => {});

  // only in macOS
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow().then();
    }
  });
});

app.on("window-all-closed", function () {
  // even if you close all windows,
  // the app will not quit in macOS.
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * create electron window
 * @returns electron BrowserWindow
 */
async function createWindow() {
  const w = new BrowserWindow({
    width: 1000,
    height: 600,
    resizable: true,
    // movable: true,
    // frame: true,
    // transparent: true,
    webPreferences: {
      // import and export the ipc method in preload process.
      preload: path.resolve(__dirname, "preload.js"),
      // set below three items to true to make more safe.
      // when you set them true,
      // you cannot use electron in renderer process.
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  // to-do: auto import handler from handlers dir
  const eipc = new Eipc(w.webContents, channels, [MyHandler]);
  await eipc.init();

  if (isDev) {
    const port = process.env.PORT || 9526
    await w.loadURL(`http://localhost:${port}/`);
    // open the chrome dev tools when in development mode.
    w.webContents.openDevTools();
  } else {
    // 生产环境应使用相对地址
    // 打包后的根目录为 app/
    await w.loadFile("./dist/index.html");
  }

  w.on("closed", () => {
    w.destroy();
    // destroy all ipc event handlers.
    eipc.destory();
  })

  return w;
}
