import * as apiTypes from '@common/transports/http/apis/types'
import Koa from 'koa'

export class Manager {
  private responseEncoder: apiTypes.ResponseEncoder<unknown>

  constructor(responseEncoder: apiTypes.ResponseEncoder<unknown>) {
    this.responseEncoder = responseEncoder
  }

  handle = async (koaCtx: Koa.Context): Promise<void> => {
    const resp = koaCtx.state.responsePayload
    this.responseEncoder(koaCtx, resp)
  }
}
