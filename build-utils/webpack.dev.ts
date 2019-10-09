import * as commonPaths from './common-paths';

import * as webpack from 'webpack';

const config: webpack.Configuration & { devServer: any } = { // devServer is not exist at webpack.Configuration
  mode: 'development',
  entry: {
    app: `${commonPaths.appEntry}/index.tsx`,
  },
  output: {
    filename: '[name].[hash].js',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    host: 'localhost',
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: true,
  },
};

export default config;
