import { BrowserWindow } from "electron";
import path from "path";

export function createSettingWindow() {
  const w = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
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

  w.on("closed", () => {
    w.destroy();
  });

  return w;
}