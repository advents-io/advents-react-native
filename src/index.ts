import {
  getAndroidId,
  getInstallationTimeAsync,
  getInstallReferrerAsync,
  getIosIdForVendorAsync,
  nativeApplicationVersion,
} from 'expo-application'
import Constants from 'expo-constants'
import { brand, deviceName, deviceYearClass, modelName, osVersion } from 'expo-device'
import { Platform } from 'react-native'

import { api } from '@/api'

interface SessionData {
  iosIdfv: string | null
  androidId: string | null
  androidInstallReferrer: string | null
  installTime: Date | null

  userAgent: string | null
  deviceName: string | null
  deviceBrand: string | null
  deviceModel: string | null
  deviceYearClass: string | null
  osName: string | null
  osVersion: string | null
  appVersion: string | null
}

export class Advents {
  private sessionData: SessionData | undefined

  constructor() {
    this.init()
  }

  private async init() {
    try {
      const iosIdfv = Platform.OS === 'ios' ? await getIosIdForVendorAsync() : null
      const androidId = Platform.OS === 'android' ? getAndroidId() : null

      const androidInstallReferrer =
        Platform.OS === 'android' ? await getInstallReferrerAsync() : null
      const installTime = await getInstallationTimeAsync()

      const userAgent = await Constants.getWebViewUserAgentAsync()

      this.sessionData = {
        iosIdfv,
        androidId,
        androidInstallReferrer,
        installTime,

        userAgent,
        deviceName,
        deviceBrand: brand,
        deviceModel: modelName,
        deviceYearClass: deviceYearClass?.toString() || null,
        osName: Platform.OS,
        osVersion,
        appVersion: nativeApplicationVersion,
      }

      await api.post('/session', this.sessionData)
    } catch {
      console.error('There was an error while initializing Advents.')
    }
  }
}
