module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          timers: require.resolve('timers-browserify'),
          stream: require.resolve('stream-browserify'),
        },
      },
      ignoreWarnings: [/Failed to parse source map/],
    },
  },
}
