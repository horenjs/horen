import {Resp, Code} from "types";

export function resp<T = Resp['data']>(code: Code, msg: string, data?: T) :Resp<T> {
  const d: any = data || undefined;
  return {
    code,
    msg,
    data: d,
  }
}