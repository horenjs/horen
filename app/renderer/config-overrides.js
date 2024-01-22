module.exports = function override(config, env) {
  console.log(config);
  // config.devServer.open = false;
  return config;
};
