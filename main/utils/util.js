/**
 * convert Buffer Array to base64str
 * @param {Array} array buffer array
 * @returns base64str
 */
function arrayBufferToBase64(array) {
  array = new Uint8Array(array);
  var length = array.byteLength;
  var table = ['A','B','C','D','E','F','G','H',
               'I','J','K','L','M','N','O','P',
               'Q','R','S','T','U','V','W','X',
               'Y','Z','a','b','c','d','e','f',
               'g','h','i','j','k','l','m','n',
               'o','p','q','r','s','t','u','v',
               'w','x','y','z','0','1','2','3',
               '4','5','6','7','8','9','+','/'];
  var base64Str = '';
  for(var i = 0; length - i >= 3; i += 3) {
      var num1 = array[i];
      var num2 = array[i + 1];
      var num3 = array[i + 2];
      base64Str += table[num1 >>> 2]
          + table[((num1 & 0b11) << 4) | (num2 >>> 4)]
          + table[((num2 & 0b1111) << 2) | (num3 >>> 6)]
          + table[num3 & 0b111111];
  }
  var lastByte = length - i;
  if(lastByte === 1) {
      var lastNum1 = array[i];
      base64Str += table[lastNum1 >>> 2] + table[((lastNum1 & 0b11) << 4)] + '==';
  } else if(lastByte === 2){
      var lastNum1 = array[i];
      var lastNum2 = array[i + 1];
      base64Str += table[lastNum1 >>> 2]
          + table[((lastNum1 & 0b11) << 4) | (lastNum2 >>> 4)]
          + table[(lastNum2 & 0b1111) << 2]
          + '=';
  }
  return base64Str;
}

/**
 * get the music meta
 * @param {str} filePath file path
 * @returns Music Meta Data
 */
async function getMusicMeta(filePath) {
  const mm = require("music-metadata");
  const metadata = await mm.parseFile(filePath);
  return metadata;
}

module.exports = {
  arrayBufferToBase64,
  getMusicMeta,
}