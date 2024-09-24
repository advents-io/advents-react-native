export interface AndroidSessionData {
  deviceId: string | null
  installReferrer: string | null
}

export interface IosSessionData {
  clickId: string | null
}

export interface Session {
  sdkName: string
  sdkVersion: string
  deviceTimestamp: Date
  os: string

  android: AndroidSessionData | null
  ios: IosSessionData | null
  installTime: Date | null

  deviceName: string | null
  deviceBrand: string | null
  deviceModel: string | null
  deviceYearClass: string | null
  osVersion: string | null
  appVersion: string | null
}
