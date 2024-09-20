import { advents } from '@/advents'

const log = (...args: unknown[]) => {
  if (!advents.debug) {
    return
  }

  console.log(...args)
}

const warn = (...args: unknown[]) => {
  if (!advents.debug) {
    return
  }

  console.warn(...args)
}

const error = (...args: unknown[]) => {
  if (!advents.debug) {
    return
  }

  console.error(...args)
}

const logger = {
  log,
  warn,
  error,
}

export { logger }
