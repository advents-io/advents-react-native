export interface AndroidSessionData {
  androidAaid: string | null
  androidId: string | null
  androidInstallReferrer: string | null
}

export interface IosSessionData {
  iosIdfv: string | null
  iosIdfa: string | null
  iosAttPermissionStatus: string | null
  iosClipboardClickId: string | null
  iosDeviceModelId: string | null
}

export interface Session extends AndroidSessionData, IosSessionData {
  id: string
  sdkName: string
  sdkVersion: string
  framework: string
  deviceTime: Date
  os: 'android' | 'ios'
  package: string
  isFirstSession: boolean
  installTime: Date

  userAgent: string | null
  deviceName: string | null
  deviceBrand: string | null
  deviceModel: string | null
  deviceType: string | null
  osVersion: string | null
  osBuildId: string | null
  appVersion: string | null
}
