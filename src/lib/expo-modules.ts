import type ExpoApplication from 'expo-application'
import type ExpoClipboard from 'expo-clipboard'
import type ExpoConstants from 'expo-constants'
import type ExpoDevice from 'expo-device'
import type ExpoTrackingTransparency from 'expo-tracking-transparency'

let OptionalExpoApplication: typeof ExpoApplication | undefined
let OptionalExpoClipboard: typeof ExpoClipboard | undefined
let OptionalExpoConstants: typeof ExpoConstants | undefined
let OptionalExpoDevice: typeof ExpoDevice | undefined
let OptionalExpoTrackingTransparency: typeof ExpoTrackingTransparency | undefined

try {
  OptionalExpoApplication = require('expo-application')
} catch {}

try {
  OptionalExpoClipboard = require('expo-clipboard')
} catch {}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  OptionalExpoConstants = require('expo-constants').default
} catch {}

try {
  OptionalExpoDevice = require('expo-device')
} catch {}

try {
  OptionalExpoTrackingTransparency = require('expo-tracking-transparency')
} catch {}

const validExpoProject =
  !!OptionalExpoApplication &&
  !!OptionalExpoClipboard &&
  !!OptionalExpoConstants &&
  !!OptionalExpoDevice &&
  !!OptionalExpoTrackingTransparency

export const expoModules = validExpoProject
  ? {
      application: OptionalExpoApplication!,
      clipboard: OptionalExpoClipboard!,
      constants: OptionalExpoConstants!,
      device: OptionalExpoDevice!,
      trackingTransparency: OptionalExpoTrackingTransparency!,
    }
  : null
