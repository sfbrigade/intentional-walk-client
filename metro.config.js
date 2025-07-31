const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const {withSentryConfig} = require('@sentry/react-native/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'txt'],
  },
};

module.exports = withSentryConfig(mergeConfig(defaultConfig, config));
