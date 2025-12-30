class ThrowableError extends Error {
  constructor(message, errorCode = 'UNKNOWN_ERROR', status = 400, meta = undefined) {
    super(message)
    this.name = 'ThrowableError'
    this.errorCode = errorCode
    this.status = status
    if (meta !== undefined) this.meta = meta
    Error.captureStackTrace?.(this, this.constructor)
  }
}

function createError(message, errorCode = 'UNKNOWN_ERROR', status = 400, meta = undefined) {
  return new ThrowableError(message, errorCode, status, meta)
}

function throwError(message, errorCode = 'UNKNOWN_ERROR', status = 400, meta = undefined) {
  throw createError(message, errorCode, status, meta)
}

export { ThrowableError, createError, throwError }
