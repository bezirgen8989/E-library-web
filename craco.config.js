const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      if (webpackConfig.resolve.fallback) {
        webpackConfig.resolve.fallback = {
          ...webpackConfig.resolve.fallback,
          timers: require.resolve("timers-browserify"),
          stream: require.resolve("stream-browserify"),
          process: require.resolve("process/browser"),
        };
      }

      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      if (!webpackConfig.resolve.plugins) {
        webpackConfig.resolve.plugins = [];
      }
      webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
        })
      );

      webpackConfig.module.rules = webpackConfig.module.rules.filter(
        (rule) => !rule.loader?.includes("source-map-loader")
      );

      return webpackConfig;
    },
  },
};
