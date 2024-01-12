module.exports = {
  plugins: [
    ['module:react-native-dotenv'],
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.txt'],
      },
    ],
  ],
  presets: ['module:@react-native/babel-preset'],
};
