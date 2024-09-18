export interface Session {
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
