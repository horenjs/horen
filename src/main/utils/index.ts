import {Resp, Code} from "types";

export function resp(code: Code, msg: string, data?: Resp['data']) :Resp {
  return {
    code,
    msg,
    data,
  }
}