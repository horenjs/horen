import Eipc from "../eipc";

@Eipc.Injectable("MyService")
export class MyService {
  constructor() {
    // do nothing
  }

  public getDelayTime(): number {
    return 2;
  }
}