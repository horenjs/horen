import channels from "../channels";
import Eipc from "../eipc";
import { MyService } from "../services/my-service";

@Eipc.Handler()
export default class MyHandler {
  constructor(private myService: MyService) {
    // do nothing;
  }

  @Eipc.On(channels.REPLY_MSG)
  public replyMsg(msg: string) {
    return `${this.myService.getDelayTime()} seconds later, the main process replies to your message: ${msg}`;
  }

  @Eipc.Invoke(channels.SEND_MSG)
  public async handleSendMsg(msg: string): Promise<string> {
    console.log("get the ", msg);
    setTimeout(() => {
      this.replyMsg(msg);
    }, this.myService.getDelayTime() * 1000);

    return `the main process received your message: ${msg}`;
  }
}