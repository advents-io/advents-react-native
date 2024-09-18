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

import { Session } from '@/types/session'
import { api } from '@/utils/api'
import { logger } from '@/utils/logger'

class Advents {
  private session: Session | undefined
  private initialized: boolean = false
  private apiKey: string | undefined

  private _debug: boolean = false

  /**
   * Debug mode for the Advents SDK.
   *
   * When debug mode is enabled, the SDK will log additional information to the console.
   * This can be useful for troubleshooting during development.
   */
  get debug(): boolean {
    return this._debug
  }

  /**
   * Initializes the Advents SDK with the provided API key.
   *
   * This method should be called once as soon as possible in your app lifecycle.
   *
   * @param apiKey - The API key for authentication. Get your API key from your Advents dashboard, in the project settings.
   * @param debug - Optional flag to enable logging in the console. Defaults to false.
   *
   * @example
   * ```typescript
   * import { advents } from 'advents-react-native'
   *
   * await advents.init('advents_apiKey', true)
   * ```
   */
  async init(apiKey: string, debug = false) {
    if (this.initialized) {
      return
    }

    try {
      this.apiKey = apiKey
      this._debug = debug

      const iosIdfv = Platform.OS === 'ios' ? await getIosIdForVendorAsync() : null
      const androidId = Platform.OS === 'android' ? getAndroidId() : null

      const androidInstallReferrer =
        Platform.OS === 'android' ? await getInstallReferrerAsync() : null
      const installTime = await getInstallationTimeAsync()

      const userAgent = await Constants.getWebViewUserAgentAsync()

      this.session = {
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

      await api.post('/session', this.session, this.apiKey)
      this.initialized = true
    } catch {
      logger.error('There was an error while initializing Advents.')
    }
  }
}

let adventsInstance: Advents | null = null

const getAdventsInstance = (): Advents => {
  if (!adventsInstance) {
    adventsInstance = new Advents()
  }

  return adventsInstance
}

const advents = getAdventsInstance()

export { advents }