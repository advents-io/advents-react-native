export interface Session {
  sdkName: string
  sdkVersion: string
  os: string

  androidId: string | null
  androidInstallReferrer: string | null
  androidInstallTime: Date | null

  userAgent: string | null
  deviceName: string | null
  deviceBrand: string | null
  deviceModel: string | null
  deviceYearClass: string | null
  osVersion: string | null
  appVersion: string | null

  timestamp: Date
}
