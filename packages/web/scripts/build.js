const shelljs = require('shelljs');
const path = require('path');

const webpackConfigPath = path.resolve(__dirname, '../config/webpack.config.js');
const cmd = `cross-env NODE_ENV=production webpack -c ${webpackConfigPath}`;

shelljs.exec(cmd, (code, stdout, stderr) => {
  console.error(stdout);

  if (code !== 0) {  
    console.error(stderr);
  }
})