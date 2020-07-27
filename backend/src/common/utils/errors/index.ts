interface JsonPayload {
  code: string
  message: string
  details?: object
}

interface ConstructorParams {
  code?: string
  message?: string
  details?: object
  err?: Error
}

export class AppError extends Error {
  private code: string
  private details?: object

  constructor({
    code = 'errors_0000',
    message = 'internal server error',
    details,
    err,
  }: ConstructorParams = {}) {
    super(message)

    // Override prototype because Typescript doesn't handle Error inheritence correctly
    // ref: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, new.target.prototype)

    this.name = this.constructor.name
    this.code = code
    this.message = message
    this.details = details
    Error.captureStackTrace(this, this.constructor)

    if (err) {
      this.stack = err.stack
    }
  }

  toJson(): JsonPayload {
    const payload: JsonPayload = {
      code: this.code,
      message: this.message,
    }

    if (this.details) {
      payload.details = this.details
    }

    return payload
  }
}
