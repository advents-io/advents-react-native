import { logger } from '@/utils/logger'

const MAX_RETRIES = 3
const BASE_RETRY_DELAY = 500
const BASE_URL = 'https://app.advents.io/api/events'

export const api = {
  post,
}

async function post<T>(
  url: string,
  data: object | null | undefined,
  apiKey: string,
  deviceId: string,
  retry: number = 0,
): Promise<T | null> {
  try {
    const finalUrl = url.startsWith('/') ? url : `/${url}`

    const response = await fetch(`${BASE_URL}${finalUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Advents-Device-Id': deviceId,
      },
      body: data ? JSON.stringify(data) : null,
      keepalive: true,
    })

    if (response.status === 401) {
      logger.error('Advents: Unauthorized.')
      return null
    }

    if (response.status === 403) {
      logger.error('Advents: Forbidden.')
      return null
    }

    if (response.status !== 200) {
      throw new Error(`Advents: HTTP error. Status ${response.status}.`)
    }

    return (await response.json()) as T
  } catch {
    if (retry >= MAX_RETRIES) {
      logger.error('Advents: Max api retries reached.')
      return null
    }

    const delay = BASE_RETRY_DELAY * Math.pow(2, retry)

    await new Promise(resolve => setTimeout(resolve, delay))

    return await post(url, data, apiKey, deviceId, retry + 1)
  }
}
