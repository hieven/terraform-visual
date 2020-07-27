import { AppError } from '@common/utils/errors'

export class HTTPError {
  private statusCode: number
  private publicErr: AppError
  private privateErr?: AppError

  constructor(statusCode: number, publicErr: AppError, privateErr?: AppError) {
    this.statusCode = statusCode
    this.publicErr = publicErr
    this.privateErr = privateErr
  }

  getStatusCode(): number {
    return this.statusCode
  }

  getPublicErr(): AppError {
    return this.publicErr
  }

  getPrivateErr(): AppError | undefined {
    return this.privateErr
  }

  isClient(): boolean {
    return 400 <= this.statusCode && this.statusCode < 500
  }
}

export class BadRequest extends HTTPError {
  constructor(publicErr: AppError) {
    super(400, publicErr)
  }
}

export class Fobidden extends HTTPError {
  constructor(publicErr: AppError) {
    super(403, publicErr)
  }
}

export class NotFound extends HTTPError {
  constructor(publicErr: AppError) {
    super(404, publicErr)
  }
}

export class Conflict extends HTTPError {
  constructor(publicErr: AppError) {
    super(409, publicErr)
  }
}

export class InternalServerError extends HTTPError {
  constructor(privateErr: AppError) {
    super(500, new AppError(), privateErr)
  }
}
