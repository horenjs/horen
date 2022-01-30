/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-30 16:37:21
 * @LastEditTime : 2022-01-30 17:08:28
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\packages\horen-plugin-lyric\index.ts
 * @Description  :
 */
let EOL = '\n';

import os = require('os');

if (typeof window === 'undefined') {
  EOL = os.EOL;
}

interface Lyric {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  scripts: LyricScript[];
}

interface LyricScript {
  start: number;
  text: string;
  end: number;
}

function lrcParser(data: string) {
  if (typeof data !== 'string') {
    throw new TypeError('expect first argument to be a string');
  }
  // split a long stirng into lines by system's end-of-line marker line
  // \r\n on Windows
  // \n   on POSIX
  let lines = data.split(EOL);
  const timeStart = /\[(\d*:\d*\.?\d*)\]/; // i.g [00:10.55]
  const scriptText = /(.+)/; // Havana ooh na-na (ayy)
  const timeEnd = timeStart;
  const startAndText = new RegExp(timeStart.source + scriptText.source);

  const infos = [];
  const scripts: LyricScript[] = [];
  const result: Lyric = {
    scripts: []
  };

  // test the info line and push it;
  for (let i = 0; startAndText.test(lines[i]) === false; i++) {
    infos.push(lines[i]);
  }

  // make ["length", "03:06"] => {length: "03:06"};
  infos.reduce((result, info) => {
    const [key, value] = extractInfo(info);
    result[key] = value;
    return result;
  }, result);

  // remove all info lines
  lines.splice(0, infos.length);

  //
  const qualified = new RegExp(startAndText.source + '|' + timeEnd.source);
  lines = lines.filter((line) => qualified.test(line));

  for (let i = 0, l = lines.length; i < l; i++) {
    const matches = startAndText.exec(lines[i]);
    const timeEndMatches = timeEnd.exec(lines[i + 1]);
    if (matches && timeEndMatches) {
      const [, start, text] = matches;
      const [, end] = timeEndMatches;
      scripts.push({
        start: convertTime(start),
        text,
        end: convertTime(end),
      });
    }
  }

  result.scripts = scripts;
  return result;
}

/**
 * extract info from string like [length: 03:25]
 * @param s string like [length: 03:25]
 * @returns ['length', '03:06']
 */
function extractInfo(s: string): string[] {
  const info = s.trim().slice(1, -1);
  return info.split(': ');
}

/**
 * cover time string to seconds
 * i.g: [01:09.10] -> 69.10
 * @param s time string like [01:09.10]
 * @returns seconds (to fixed(2))
 */
function convertTime(s: string) {
  const parts = s.split(':');
  const minutes = parseInt(parts[0], 10);
  const seconds = parseFloat(parts[1]);
  if (minutes > 0) {
    const finalSeconds = minutes * 60 + seconds;
    return parseFloat(finalSeconds.toFixed(2));
  }
  return seconds;
}

export default lrcParser;
