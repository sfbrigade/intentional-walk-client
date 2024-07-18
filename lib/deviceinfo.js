import {Platform} from 'react-native';

export function collectDeviceInfo() {
  return {
    deviceType: Platform.OS, // iOS or Android
    // https://reactnative.dev/docs/platform#version
    // number on Android, string on iOS
    deviceVersion: `${Platform.Version}`, // OS version
    // Collecting Device Model? e.g. Google Pixel, Samsung Galaxy, iPhone 12
    // Use react-native-device-info. Ticket for an eager developer to implement.
    // deviceModel: '',
  };
}
