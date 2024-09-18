import { advents } from '@/advents'

const log = (...args: unknown[]) => {
  if (!advents.debug) {
    return
  }

  console.log(...args)
}

const error = (...args: unknown[]) => {
  if (!advents.debug) {
    return
  }

  console.error(...args)
}

const logger = {
  log,
  error,
}

export { logger }
