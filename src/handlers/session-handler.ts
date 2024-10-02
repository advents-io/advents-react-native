import { DeviceType } from 'expo-device'
import { Platform } from 'react-native'

import { expoModules } from '@/lib/expo-modules'
import { reactNativeModules } from '@/lib/react-native-modules'
import { AndroidSessionData, IosSessionData, Session } from '@/types/session'
import { sdkVersion } from '@/utils/package'

export const getSessionData = async (): Promise<Session> => {
  let packageName = null
  let installTime = null
  let userAgent = null
  let deviceName = null
  let deviceBrand = null
  let deviceModel = null
  let deviceType = null
  let osVersion = null
  let osBuildId = null
  let appVersion = null

  const { major, minor, patch, prerelease } = Platform.constants.reactNativeVersion
  const formatedPrerelease = prerelease ? `.${prerelease}` : ''
  let framework = `react-native@${major}.${minor}.${patch}${formatedPrerelease}`

  if (expoModules) {
    framework += `|expo@${expoModules.constants.expoRuntimeVersion}`
    packageName = expoModules.application.applicationId

    installTime = await expoModules.application.getInstallationTimeAsync()
    userAgent = await expoModules.constants.getWebViewUserAgentAsync()
    deviceName = expoModules.device.deviceName
    deviceBrand = expoModules.device.brand
    deviceModel = expoModules.device.modelName
    deviceType = expoModules.device.deviceType ? DeviceType[expoModules.device.deviceType] : null
    osVersion = expoModules.device.osVersion
    osBuildId = expoModules.device.osBuildId
    appVersion = expoModules.application.nativeApplicationVersion
  } else if (reactNativeModules) {
    packageName = reactNativeModules.device.getBundleId()

    installTime = new Date(await reactNativeModules.device.getFirstInstallTime())
    userAgent = await reactNativeModules.device.getUserAgent()
    deviceName = await reactNativeModules.device.getDeviceName()
    deviceBrand = reactNativeModules.device.getBrand()
    deviceModel = reactNativeModules.device.getDeviceId()
    deviceType = reactNativeModules.device.getDeviceType()
    osVersion = reactNativeModules.device.getSystemVersion()
    osBuildId = await reactNativeModules.device.getBuildId()
    appVersion = reactNativeModules.device.getVersion()
  }

  const session: Session = {
    sdkName: 'react-native',
    sdkVersion,
    framework,
    deviceTime: new Date(),
    os: Platform.OS,
    package: packageName,

    ...(await getAndroidSessionData()),
    ...(await getIosSessionData()),

    installTime,
    userAgent,
    deviceName,
    deviceBrand,
    deviceModel,
    deviceType,
    osVersion,
    osBuildId,
    appVersion,
  }

  return session
}

const getAndroidSessionData = async (): Promise<AndroidSessionData> => {
  if (Platform.OS !== 'android') {
    return {
      androidAaid: null,
      androidId: null,
      androidInstallReferrer: null,
    }
  }

  let androidAaid = null
  let androidId = null
  let androidInstallReferrer = null

  if (expoModules) {
    androidAaid = expoModules.trackingTransparency.getAdvertisingId()
    androidId = expoModules.application.getAndroidId()
    androidInstallReferrer = await expoModules.application.getInstallReferrerAsync()
  } else if (reactNativeModules) {
    androidAaid = (await reactNativeModules.advertising.getAdvertisingInfo()).id
    androidId = await reactNativeModules.device.getAndroidId()
    androidInstallReferrer = await reactNativeModules.device.getInstallReferrer()
  }

  return {
    androidAaid,
    androidId,
    androidInstallReferrer,
  }
}

const getIosSessionData = async (): Promise<IosSessionData> => {
  if (Platform.OS !== 'ios') {
    return {
      iosIdfv: null,
      iosIdfa: null,
      iosAttPermissionStatus: null,
      iosClipboardClickId: null,
      iosDeviceModelId: null,
    }
  }

  let iosIdfv = null
  let iosClipboardClickId = null
  let iosDeviceModelId = null

  if (expoModules) {
    iosIdfv = await expoModules.application.getIosIdForVendorAsync()
    iosDeviceModelId = expoModules.device.modelId

    const clipboardHasUrl = await expoModules.clipboard.hasUrlAsync()

    if (clipboardHasUrl) {
      const clipboardUrl = await expoModules.clipboard.getUrlAsync()

      const isAdventsClickId =
        !!clipboardUrl && clipboardUrl.startsWith('https://advents.io/click_id=')

      if (isAdventsClickId) {
        iosClipboardClickId = clipboardUrl.split('https://advents.io/click_id=')[1]
      }
    }
  } else if (reactNativeModules) {
    iosIdfv = await reactNativeModules.device.getUniqueId()
    iosDeviceModelId = reactNativeModules.device.getDeviceId()

    const clipboardHasUrl = await reactNativeModules.clipboard.hasURL()

    if (clipboardHasUrl) {
      const clipboardUrl = await reactNativeModules.clipboard.getString()

      const isAdventsClickId =
        !!clipboardUrl && clipboardUrl.startsWith('https://advents.io/click_id=')

      if (isAdventsClickId) {
        iosClipboardClickId = clipboardUrl.split('https://advents.io/click_id=')[1]
      }
    }
  }

  return {
    iosIdfv,
    ...(await getIosTrackingData()),
    iosClipboardClickId,
    iosDeviceModelId,
  }
}

const getIosTrackingData = async (): Promise<{
  iosIdfa: string | null
  iosAttPermissionStatus: string | null
}> => {
  if (Platform.OS !== 'ios') {
    return {
      iosIdfa: null,
      iosAttPermissionStatus: null,
    }
  }

  let iosIdfa = null
  let iosAttPermissionStatus = null

  if (expoModules) {
    const { granted, status } = await expoModules.trackingTransparency.getTrackingPermissionsAsync()

    if (!granted) {
      return {
        iosIdfa: null,
        iosAttPermissionStatus: status,
      }
    }

    iosIdfa = expoModules.trackingTransparency.getAdvertisingId()
    iosAttPermissionStatus = status
  } else if (reactNativeModules) {
    const adInfo = await reactNativeModules.advertising.getAdvertisingInfo()

    iosIdfa = adInfo.id
    iosAttPermissionStatus = adInfo.isAdTrackingLimited ? 'denied' : 'granted'
  }

  return {
    iosIdfa,
    iosAttPermissionStatus,
  }
}
