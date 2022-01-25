/* eslint-disable no-var */
/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-21 23:47:40
 * @LastEditTime : 2022-01-25 23:18:14
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen-util\lib\index.ts
 * @Description  :
 */
import fs from 'fs/promises';
import path from 'path';
import debug from 'debug';

const mydebug = debug('horen');

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

export async function readDir(
  p: string,
  fileList: string[] = []
): Promise<string[]> {
  const files = await fs.readdir(p);

  for (const f of files) {
    const filePath = path.join(p, f);
    const stat = await fs.stat(filePath);

    if (stat.isFile()) {
      fileList.push(filePath);
      mydebug(filePath);
    }

    if (stat.isDirectory()) {
      mydebug('it is dir, loop.');
      await readDir(filePath, fileList);
    }
  }

  return fileList;
}

/**
 * 将 ArrayBuffer 转换为 base64 字符串
 * @param arr ArrayBuffer
 * @returns base64str
 */
export function arrayBufferToBase64(arr: ArrayBuffer) {
  const array = new Uint8Array(arr);
  var length = array.byteLength;
  var table = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '+',
    '/',
  ];
  var base64Str = '';
  for (var i = 0; length - i >= 3; i += 3) {
    var num1 = array[i];
    var num2 = array[i + 1];
    var num3 = array[i + 2];
    base64Str +=
      table[num1 >>> 2] +
      table[((num1 & 0b11) << 4) | (num2 >>> 4)] +
      table[((num2 & 0b1111) << 2) | (num3 >>> 6)] +
      table[num3 & 0b111111];
  }
  var lastByte = length - i;
  if (lastByte === 1) {
    var lastNum1 = array[i];
    base64Str += table[lastNum1 >>> 2] + table[(lastNum1 & 0b11) << 4] + '==';
  } else if (lastByte === 2) {
    var lastNum1 = array[i];
    var lastNum2 = array[i + 1];
    base64Str +=
      table[lastNum1 >>> 2] +
      table[((lastNum1 & 0b11) << 4) | (lastNum2 >>> 4)] +
      table[(lastNum2 & 0b1111) << 2] +
      '=';
  }
  return base64Str;
}
