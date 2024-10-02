import type ReactNativeClipboard from '@react-native-clipboard/clipboard'
import type ReactNativeAdvertising from '@sparkfabrik/react-native-idfa-aaid'
import type ReactNativeDeviceInfo from 'react-native-device-info'

let OptionalReactNativeDeviceInfo: typeof ReactNativeDeviceInfo | undefined

try {
  OptionalReactNativeDeviceInfo = require('react-native-device-info')
} catch {}

let OptionalReactNativeClipboard: typeof ReactNativeClipboard | undefined

try {
  OptionalReactNativeClipboard = require('@react-native-clipboard/clipboard')
} catch {}

let OptionalReactNativeAdvertising: typeof ReactNativeAdvertising | undefined

try {
  OptionalReactNativeAdvertising = require('@sparkfabrik/react-native-idfa-aaid')
} catch {}

const validBareReactNativeProject =
  !!OptionalReactNativeDeviceInfo && !!OptionalReactNativeClipboard

export const reactNativeModules = validBareReactNativeProject
  ? {
      device: OptionalReactNativeDeviceInfo!,
      clipboard: OptionalReactNativeClipboard!,
      advertising: OptionalReactNativeAdvertising,
    }
  : null
