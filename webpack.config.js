const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'build/static'),
    filename: 'bundle.js',
  },
  plugins: [new MiniCssExtractPlugin({
    filename: 'bundle.css'
  })],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        loader: 'less-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    open: true,
    hot: true
  }
}