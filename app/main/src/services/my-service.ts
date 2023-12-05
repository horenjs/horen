import Eipc from "eipc";
import { createSettingWindow } from "./_window";
@Eipc.Injectable("MyService")
export class MyService {
  constructor() {
    // do nothing
  }

  public getDelayTime(): number {
    return 2;
  }

  public openSettingWindow() {
    const isDev = process.env.NODE_ENV === 'development';
    const port = process.env.EE_PORT_2 || 9527;
    const settingPage = './dist/view-setting/index.html';
    const w = createSettingWindow();

    if (isDev) {
      w.loadURL(`http://localhost:${port}/`).then().catch(console.error);
    } else {
      // 生产环境应使用相对地址
      // 打包后的根目录为 app/
      w.loadFile(settingPage).then().catch(console.error);
    }
  }
}