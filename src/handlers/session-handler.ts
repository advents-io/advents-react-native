import {
  getAndroidId,
  getInstallationTimeAsync,
  getInstallReferrerAsync,
  nativeApplicationVersion,
} from 'expo-application'
import { getUrlAsync, hasUrlAsync } from 'expo-clipboard'
import { brand, deviceName, deviceYearClass, modelName, osVersion } from 'expo-device'
import { Platform } from 'react-native'

import { AndroidSessionData, IosSessionData, Session } from '@/types/session'
import { sdkVersion } from '@/utils/package'

export const getSessionData = async (): Promise<Session> => {
  const installTime = await getInstallationTimeAsync()

  const androidSessionData = await getAndroidSessionData()
  const iosSessionData = await getIosSessionData()

  const session: Session = {
    sdkName: 'react-native',
    sdkVersion,
    deviceTimestamp: new Date(),
    os: Platform.OS,

    android: androidSessionData,
    ios: iosSessionData,
    installTime,

    deviceName,
    deviceBrand: brand,
    deviceModel: modelName,
    deviceYearClass: deviceYearClass?.toString() || null,
    osVersion,
    appVersion: nativeApplicationVersion,
  }

  return session
}

const getAndroidSessionData = async (): Promise<AndroidSessionData | null> => {
  if (Platform.OS !== 'android') {
    return null
  }

  const deviceId = getAndroidId()
  const installReferrer = await getInstallReferrerAsync()

  const sessionData: AndroidSessionData = {
    deviceId,
    installReferrer,
  }

  return sessionData
}

const getIosSessionData = async (): Promise<IosSessionData | null> => {
  if (Platform.OS !== 'ios') {
    return null
  }

  let clickId: string | null = null

  const clipboardHasUrl = await hasUrlAsync()

  if (clipboardHasUrl) {
    const clipboardUrl = await getUrlAsync()

    const isAdventsClickId =
      !!clipboardUrl && clipboardUrl.startsWith('https://advents.io/click_id=')

    if (isAdventsClickId) {
      clickId = clipboardUrl.split('https://advents.io/click_id=')[1]
    }
  }

  const sessionData: IosSessionData = {
    clickId,
  }

  return sessionData
}
