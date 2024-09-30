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
  sdkName: string | null
  sdkVersion: string | null
  framework: string | null
  deviceTime: Date | null
  os: string | null
  package: string | null

  installTime: Date | null
  userAgent: string | null
  deviceName: string | null
  deviceBrand: string | null
  deviceModel: string | null
  deviceType: string | null
  osVersion: string | null
  osBuildId: string | null
  appVersion: string | null
}
