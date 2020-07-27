import * as apiTypes from '@common/transports/http/apis/types'
import * as httpErrors from '@common/transports/http/utils/errors'
import * as errors from '@common/utils/errors'
import Koa from 'koa'

export class Manager {
  private responseErrorEncoder: apiTypes.ResponseErrorEncoder

  constructor(responseErrorEncoder: apiTypes.ResponseErrorEncoder) {
    this.responseErrorEncoder = responseErrorEncoder
  }

  handle = async (koaCtx: Koa.Context, next: Function): Promise<void> => {
    try {
      await next()
    } catch (err) {
      if (err.isJoi) {
        throw new httpErrors.BadRequest(new errors.AppError({ message: err.message, err }))
      }

      if (!this.responseErrorEncoder) {
        throw new httpErrors.InternalServerError(
          new errors.AppError({
            code: 'no_response_error_encoder',
            message: 'responseErrorEncoder not found',
          }),
        )
      }

      this.responseErrorEncoder(koaCtx, err)
    }
  }
}
