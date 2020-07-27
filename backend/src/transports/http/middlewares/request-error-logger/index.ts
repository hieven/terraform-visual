import * as httpErrors from '@common/transports/http/utils/errors'
import * as errors from '@common/utils/errors'
import Koa from 'koa'

export class Manager {
  handle = async (koaCtx: Koa.Context, next: Function): Promise<void> => {
    try {
      await next()
    } catch (err) {
      let httpError: httpErrors.HTTPError = err

      if (!(err instanceof httpErrors.HTTPError)) {
        console.log({ err }, 'unexpected error captured by http-error-logger')

        let privateErr: errors.AppError = err

        if (!(err instanceof errors.AppError)) {
          privateErr = new errors.AppError({
            code: 'http-error-logger_0000',
            message: 'unexpected error captured by http-error-logger',
            err,
          })
        }

        httpError = new httpErrors.InternalServerError(privateErr)
      }

      koaCtx.status = httpError.getStatusCode()
      koaCtx.body = httpError.getPublicErr().toJson()

      if (httpError.isClient()) {
        // TODO: sampling error
      } else {
        // TODO: report to error platform
      }

      return
    }
  }
}
