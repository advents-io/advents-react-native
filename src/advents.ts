import { Platform } from 'react-native'

import { getSessionData } from '@/handlers/session-handler'
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

      this.apiKey = apiKey
      this._debug = debug
      this.session = await getSessionData()
      await api.post('/sessions', this.session, this.apiKey)
      this.initialized = true
    } catch {
      logger.error('Advents: There was an error while initializing.')
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
