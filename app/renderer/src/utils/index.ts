export {
  default as HowlPlayer,
  SinglePlayer,
  type PlayerOrder,
} from './player';

export const randomInt = (m: number, n: number) =>
  Math.floor(Math.random() * (m - n + 1)) + n;

export const normalizeDuration = (d: number) => {
  const duration = Math.floor(d);

  const level1 = 60;
  const level2 = 60 * 60;
  if (duration < level1) {
    return duration + '';
  }

  if (duration >= level1 && duration < level2) {
    const mins = Math.floor(duration / level1);
    const seconds = duration - mins * level1;
    const secStr = seconds < 10 ? '0' + seconds : seconds;
    return `${mins}:${secStr}`;
  }

  if (duration >= level1) {
    const hours = Math.floor(duration / level2);
    const mins = Math.floor((duration - hours * level2) / level1);
    const seconds = duration - hours * level2 - mins * level1;

    const minStr = mins < 10 ? '0' + mins : mins;
    const secStr = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minStr}:${secStr}`;
  }
};
