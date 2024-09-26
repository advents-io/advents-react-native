import {
  applicationId,
  getAndroidId,
  getInstallationTimeAsync,
  getInstallReferrerAsync,
  getIosIdForVendorAsync,
  nativeApplicationVersion,
} from 'expo-application'
import { getUrlAsync, hasUrlAsync } from 'expo-clipboard'
import Constants from 'expo-constants'
import {
  brand,
  deviceName,
  DeviceType,
  deviceType,
  deviceYearClass,
  modelId,
  modelName,
  osBuildId,
  osVersion,
} from 'expo-device'
import { getAdvertisingId, getTrackingPermissionsAsync } from 'expo-tracking-transparency'
import { Platform } from 'react-native'

import { AndroidSessionData, IosSessionData, Session } from '@/types/session'
import { sdkVersion } from '@/utils/package'

export const getSessionData = async (): Promise<Session> => {
  const installTime = await getInstallationTimeAsync()
  const userAgent = await Constants.getWebViewUserAgentAsync()

  const { major, minor, patch, prerelease } = Platform.constants.reactNativeVersion
  const formatedPrerelease = prerelease ? `.${prerelease}` : ''
  const framework = `react-native@${major}.${minor}.${patch}${formatedPrerelease}`

  const session: Session = {
    sdkName: 'react-native',
    sdkVersion,
    framework,
    deviceTime: new Date(),
    os: Platform.OS,
    package: applicationId,

    ...(await getAndroidSessionData()),
    ...(await getIosSessionData()),

    installTime,
    userAgent,
    deviceName,
    deviceBrand: brand,
    deviceModel: modelName,
    deviceType: deviceType ? DeviceType[deviceType] : null,
    deviceYearClass: deviceYearClass?.toString() || null,
    osVersion,
    osBuildId,
    appVersion: nativeApplicationVersion,
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

  const androidAaid = getAdvertisingId()
  const androidId = getAndroidId()
  const androidInstallReferrer = await getInstallReferrerAsync()

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

  const iosIdfv = await getIosIdForVendorAsync()

  let iosClipboardClickId: string | null = null

  const clipboardHasUrl = await hasUrlAsync()

  if (clipboardHasUrl) {
    const clipboardUrl = await getUrlAsync()

    const isAdventsClickId =
      !!clipboardUrl && clipboardUrl.startsWith('https://advents.io/click_id=')

    if (isAdventsClickId) {
      iosClipboardClickId = clipboardUrl.split('https://advents.io/click_id=')[1]
    }
  }

  return {
    iosIdfv,
    ...(await getIosTrackingData()),
    iosClipboardClickId,
    iosDeviceModelId: modelId,
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

  const { granted, status: iosAttPermissionStatus } = await getTrackingPermissionsAsync()

  if (!granted) {
    return {
      iosIdfa: null,
      iosAttPermissionStatus,
    }
  }

  const iosIdfa = getAdvertisingId()

  return {
    iosIdfa,
    iosAttPermissionStatus,
  }
}
