module.exports = {
  entry: __dirname + '/app/index.js',
  module: {
    loaders: [
      {
        test: \.js$/,
        exclude: /node_module/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    filename: 'transformed.js',
    path: __dirname + '/build'
  }
};
