import "reflect-metadata";
import { BrowserWindow } from "electron";
import Eipc from "eipc";
import CHANNELS from "./channels";
import MyHandler from "./handlers/my-handler";
import { myapp } from './app';

myapp.use(async (win: BrowserWindow) => {
  // to-do: auto import handler from handlers dir
  const eipc = new Eipc(win.webContents, CHANNELS, [MyHandler]);
  await eipc.init();
  return eipc;
});
