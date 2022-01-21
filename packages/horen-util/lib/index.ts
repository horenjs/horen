/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 23:47:40
 * @LastEditTime : 2022-01-22 01:16:55
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen-util\lib\index.ts
 * @Description  :
 */
/**
 * 返回给定范围内的随机整数
 * @param min 区间最小值(含)
 * @param max 区间最大值(含)
 * @returns 随机整数
 */
export function randomInt(min: number, max: number) {
  return parseInt(String(Math.random() * (max - min + 1)), 10);
}

/**
 * remove the first of an array and return new one.
 * @param arr any arrary
 * @returns new array
 */
export function shift(arr: any[]) {
  const newArr = [...arr];
  newArr.shift();
  return newArr;
}
