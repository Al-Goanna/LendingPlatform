const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, _env) {
  config.resolve.fallback = {
    url: require.resolve('url'),
    fs: require.resolve('fs'),
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
  };
  config.resolve.alias = {
    Root: path.resolve(__dirname, 'src/'),
    Components: path.resolve(__dirname, 'src/components/'),
    Pages: path.resolve(__dirname, 'src/pages/'),
  };
  config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
  );

  return config;
};
