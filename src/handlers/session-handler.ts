import { Platform } from 'react-native'

import { expoModules } from '@/lib/expo-modules'
import { reactNativeModules } from '@/lib/react-native-modules'
import { AndroidSessionData, IosSessionData, Session } from '@/types/session'
import { sdkVersion } from '@/utils/package'

export const getSessionData = async (): Promise<Session> => {
  let packageName: string | null = null
  let installTime: Date | null = null
  let userAgent: string | null = null
  let deviceName: string | null = null
  let deviceBrand: string | null = null
  let deviceModel: string | null = null
  let deviceType: string | null = null
  let osVersion: string | null = null
  let osBuildId: string | null = null
  let appVersion: string | null = null

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
    deviceType = expoModules.device.deviceType
      ? expoModules.device.DeviceType[expoModules.device.deviceType]
      : null
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
    id: crypto.randomUUID(),
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

  let androidAaid: string | null = null
  let androidId: string | null = null
  let androidInstallReferrer: string | null = null

  if (expoModules) {
    androidAaid = expoModules.advertising?.getAdvertisingId() || null
    androidId = expoModules.application.getAndroidId()
    androidInstallReferrer = await expoModules.application.getInstallReferrerAsync()
  } else if (reactNativeModules) {
    androidAaid = (await reactNativeModules.advertising?.getAdvertisingInfo())?.id || null
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

  let iosIdfv: string | null = null
  let iosClipboardClickId: string | null = null
  let iosDeviceModelId: string | null = null

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

  let iosIdfa: string | null = null
  let iosAttPermissionStatus: string | null = null

  if (expoModules && expoModules.advertising) {
    const { granted, status } = await expoModules.advertising.getTrackingPermissionsAsync()

    if (!granted) {
      return {
        iosIdfa: null,
        iosAttPermissionStatus: status,
      }
    }

    iosIdfa = expoModules.advertising.getAdvertisingId()
    iosAttPermissionStatus = status
  } else if (reactNativeModules && reactNativeModules.advertising) {
    const adInfo = await reactNativeModules.advertising.getAdvertisingInfo()

    iosIdfa = adInfo.id || null
    iosAttPermissionStatus = adInfo.isAdTrackingLimited ? 'denied' : 'granted'
  }

  return {
    iosIdfa,
    iosAttPermissionStatus,
  }
}
