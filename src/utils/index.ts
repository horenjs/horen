function randomInteger(min: number, max: number) {
  switch (arguments.length) {
    case 1:
      return parseInt(String(Math.random() * min + 1), 10);
      break;
    case 2:
      return parseInt(String(Math.random() * (max - min + 1)), 10);
      break;
    default:
      return 0;
      break;
  }
}

export {
  randomInteger,
}