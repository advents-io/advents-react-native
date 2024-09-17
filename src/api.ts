const MAX_RETRIES = 3
const BASE_RETRY_DELAY = 500
const BASE_URL = 'https://app.advents.io/api/events'

export const api = {
  post,
}

async function post(url: string, data: object | null | undefined, retry: number = 0) {
  try {
    const finalUrl = url.startsWith('/') ? url : `${url}/`

    const response = await fetch(`${BASE_URL}${finalUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
      keepalive: true,
    })

    if (response.status === 401) {
      console.error('Advents: unauthorized.')
      return
    }

    if (response.status === 403) {
      console.error('Advents: forbidden.')
      return
    }

    if (response.status !== 200) {
      throw new Error(`Advents: HTTP error. Status ${response.status}.`)
    }
  } catch {
    if (retry >= MAX_RETRIES) {
      console.error('Advents: max post retries reached.')
      return
    }

    const delay = BASE_RETRY_DELAY * Math.pow(2, retry)

    await new Promise(resolve => setTimeout(resolve, delay))

    await post(url, data, retry + 1)
  }
}
