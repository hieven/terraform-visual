import * as apiTypes from '@common/transports/http/apis/types'
import * as Koa from 'koa'

export class Manager {
  private requestDecoder: apiTypes.RequestDecoder<unknown>

  constructor(requestDecoder: apiTypes.RequestDecoder<unknown>) {
    this.requestDecoder = requestDecoder
  }

  handle = async (koaCtx: Koa.Context, next: Function): Promise<void> => {
    const payload = await this.requestDecoder(koaCtx)

    koaCtx.state.requestPayload = payload

    await next()
  }
}
