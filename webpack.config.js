const path = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
  externals: {
    pageInfo: 'pageInfo',
    hljs: 'hljs' // Highlight.js is way too huge for this bundle, so we use external js file. But styles are still included.
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, 'dist/static'),
    filename: 'bundle.js',
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
      options: {
        hmr: process.env.NODE_ENV === 'development',
        reloadAll: true
      }
    }),
    new CleanWebpackPlugin()
  ],
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
        test: /\.(less|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?limit=1000&name=[name].[ext]'
      }
    ]
  },
  devServer: {
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false
    },
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/static/', // 模拟 output 的目录
    open: true, // 启动后自动打开浏览器
    hot: true, // 热重载
    watchContentBase: true, // 手动对 dist 内的文件进行更改会造成页面强制刷新
  }
}