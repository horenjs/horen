import CHANNELS from "../channels";
import Eipc from "eipc";
import { MyService } from "../services/my-service";

@Eipc.Handler()
export default class MyHandler {
  constructor(private myService: MyService) {
    // do nothing;
  }

  @Eipc.On(CHANNELS.replyMsg)
  public replyMsg(msg: string) {
    return `${this.myService.getDelayTime()} seconds later, the main process replies to your message: ${msg}`;
  }

  @Eipc.Invoke(CHANNELS.sendMsg)
  public async handleSendMsg(msg: string): Promise<string> {
    console.log("get the ", msg);
    setTimeout(() => {
      this.replyMsg(msg);
    }, this.myService.getDelayTime() * 1000);

    return `the main process received your message: ${msg}`;
  }

  @Eipc.Invoke(CHANNELS.openNewWindow)
  public async handleOpenNewWindow(msg: string): Promise<boolean> {
    if (msg === 'setting') {
      this.myService.openSettingWindow();
      return true;
    }
    
    if (msg === 'mini-player') {
      return true;
    }
  }
}