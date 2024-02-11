/* eslint-disable @typescript-eslint/no-explicit-any */
const EOL = '\n';

export interface LyricParser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  scripts: LyricScript[];
}

export interface LyricScript {
  start: number;
  text: string;
  end: number;
}

function lrcParser(data: string) {
  // if (typeof api !== 'string') {
  //   throw new TypeError('expect first argument to be a string');
  // }
  // split a long string into lines by system's end-of-line marker line
  // \r\n on Windows
  // \n   on POSIX
  let originLines: any[] = [];
  try {
    originLines = data.split(EOL);
  } catch (err) {
    console.error('cannot split the lyric: ' + data);
  }

  const scripts: LyricScript[] = [];
  const result: LyricParser = {
    scripts: [],
  };

  const timeStartPattern = /\[(\d*:\d*\.?\d*)\]/; // i.g [00:10.55]
  const timeEndPattern = timeStartPattern;
  const scriptText = /(.+)/; // Havana ooh na-na (ayy)

  const timesStartAndTextPattern = new RegExp(
    timeStartPattern.source + scriptText.source
  );

  const infos = [];
  const infoPattern = /\[(\w+:\w+)\]/;

  // test the info line and push it;
  for (let i = 0; i < originLines.length; i++) {
    if (infoPattern.test(originLines[i])) {
      infos.push(originLines[i]);
    }
  }

  // make [ti:hello] => {"ti": "hello"};
  infos.reduce((result, info) => {
    const [key, value] = extractInfo(info);
    result[key] = value;
    return result;
  }, result);

  const copyLines = [...originLines];
  // remove all info lines from top;
  copyLines.splice(0, infos.length);

  // test the correct line
  const qualified = new RegExp(
    timesStartAndTextPattern.source + '|' + timeEndPattern.source
  );
  const qualifiedLines = copyLines.filter((line) => qualified.test(line));

  if (qualifiedLines.length === 0) {
    result.scripts = originLines.map((line) => {
      return {
        start: 0,
        end: 0,
        text: line,
      };
    });
    return result;
  }

  for (let i = 0, l = qualifiedLines.length; i < l; i++) {
    const matches = timesStartAndTextPattern.exec(qualifiedLines[i]);
    const timeEndMatches = timeEndPattern.exec(qualifiedLines[i + 1]);
    if (matches && timeEndMatches) {
      const [, start, text] = matches;
      const [, end] = timeEndMatches;
      const item = {
        start: convertTime(start),
        text,
        end: convertTime(end),
      };
      scripts.push(item);
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
  const infos = info.split(':');
  return infos.map((i) => i.trim());
}

/**
 * cover time string to second
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
