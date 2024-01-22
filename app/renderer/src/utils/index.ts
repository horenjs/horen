export { default as HowlPlayer } from './player';

export const randomInt = (m: number, n: number) =>
  Math.floor(Math.random() * (m - n + 1)) + n;
