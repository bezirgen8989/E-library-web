const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      if (webpackConfig.resolve.fallback) {
        webpackConfig.resolve.fallback.timers =
          require.resolve("timers-browserify");
        webpackConfig.resolve.fallback.stream =
          require.resolve("stream-browserify");
      }

      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      if (!webpackConfig.resolve.plugins) {
        webpackConfig.resolve.plugins = [];
      }
      webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));

      // Удаляем ВСЕ правила с source-map-loader
      webpackConfig.module.rules = webpackConfig.module.rules.filter(
        (rule) => !rule.loader?.includes("source-map-loader")
      );

      return webpackConfig;
    },
  },
};
