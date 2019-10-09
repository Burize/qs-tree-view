import * as webpackMerge from 'webpack-merge';

import commonConfig from './build-utils/webpack.common';
import devConfig from './build-utils/webpack.dev';
import prodConfig from './build-utils/webpack.prod';
import getEnvParams from './src/shared/helpers/getEnvParams';

const { env } = getEnvParams();

const envConfig = env === 'development' ? devConfig : prodConfig;
const mergedConfig = webpackMerge(
  commonConfig,
  envConfig,
);

export default mergedConfig;
