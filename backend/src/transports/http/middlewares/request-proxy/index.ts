import { RequestHandler } from '@common/transports/http/apis/types'
import { Context } from '@common/utils/context'
import * as Koa from 'koa'

export class Manager {
  requestHandler: RequestHandler<unknown, unknown>

  constructor(requestHandler: RequestHandler<unknown, unknown>) {
    this.requestHandler = requestHandler
  }

  handle = async (koaCtx: Koa.Context, next: Function): Promise<void> => {
    const req = koaCtx.state.requestPayload
    const ctx = new Context()

    koaCtx.state.responsePayload = await this.requestHandler(ctx, req)

    next()
  }
}
