import { Platform } from 'react-native'

import { getSessionData } from '@/handlers/session-handler'
import { expoModules } from '@/lib/expo-modules'
import { reactNativeModules } from '@/lib/react-native-modules'
import { Purchase } from '@/types/purchase'
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
   * advents.init('advents_apiKey', true)
   * ```
   */
  async init(apiKey: string, debug = false) {
    try {
      if (this.initialized) {
        return
      }

      if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
        logger.warn('Advents: This platform is not supported.')
        return
      }

      if (!apiKey) {
        logger.error('Advents: API key is required.')
        return
      }

      const validPackageConfig = !!expoModules || !!reactNativeModules

      if (!validPackageConfig) {
        logger.error(
          'Advents: Project is not configured correctly, please check the documentation. https://docs.advents.io',
        )
        return
      }

      this.apiKey = apiKey
      this._debug = debug
      this.session = await getSessionData()
      await api.post('/sessions', this.session, this.apiKey)
      this.initialized = true

      if (this._debug) {
        logger.log('Advents: SDK initialized successfully.')
      }
    } catch (e) {
      logger.error('Advents: There was an error while initializing.', e)
    }
  }

  /**
   * Logs a purchase event to track monetary transactions in your application.
   * The purchase will be recorded with the current timestamp and sent to Advents servers.
   *
   * @param params - The purchase event parameters
   * @param params.value - The monetary value of the purchase (must be a positive number in your app's currency)
   * @throws Will log an error if the SDK is not initialized or if the value is invalid
   *
   * @example
   * ```typescript
   * import { advents } from 'advents-react-native'
   *
   * await advents.logPurchase({ value: 29.99 })
   * ```
   */
  async logPurchase({ value }: Purchase) {
    try {
      if (!this.initialized || !this.apiKey || !this.session) {
        logger.error('Advents: SDK must be initialized before logging events.')
        return
      }

      if (typeof value !== 'number' || value <= 0) {
        logger.error('Advents: Purchase value must be a positive number.')
        return
      }

      await api.post(
        '/purchases',
        {
          value,
          sessionId: this.session.id,
        },
        this.apiKey,
      )

      if (this._debug) {
        logger.log('Advents: Purchase logged successfully.', { value })
      }
    } catch (e) {
      logger.error('Advents: Failed to log purchase.', e)
    }
  }
}

let instance: Advents | null = null

const getInstance = (): Advents => {
  if (!instance) {
    instance = new Advents()
  }

  return instance
}

/**
 * The main entry point for the Advents SDK.
 *
 * First you need to initialize the SDK with your API key.
 *
 * @example
 * ```typescript
 * import { advents } from 'advents-react-native'
 *
 * advents.init('advents_apiKey', true)
 * ```
 */
const advents = getInstance()

export { advents }
