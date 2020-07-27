import { Context } from '@common/utils/context'
import Joi from 'joi'
import Koa from 'koa'

export class Manager {
  private config: Config
  private dependency: Dependency

  constructor(config: Config, dependency: Dependency) {
    this.config = config
    this.dependency = dependency
  }

  requestDecoder(koaCtx: Koa.Context): Request {
    return {}
  }

  requestValidator = Joi.object({})

  async handler(ctx: Context, req: Request): Promise<Response> {
    return {
      meta: {},
      data: {
        status: 'OK',
      },
    }
  }

  responseEncoder(koaCtx: Koa.Context, resp: Response): void {
    koaCtx.status = 200
    koaCtx.body = resp
  }

  responseErrorEncoder(koaCtx: Koa.Context, err: Error): never {
    throw err
  }
}

export interface Config {}

export interface Dependency {}

export interface Request {}

export interface Response {
  meta: {}
  data: {
    status: string
  }
}
