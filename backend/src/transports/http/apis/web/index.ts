import { Context } from '@common/utils/context'
import Joi from 'joi'
import Koa from 'koa'
import next from 'next'

export class Manager {
  private config: Config
  private dependency: Dependency

  private nextApp: any

  constructor(config: Config, dependency: Dependency) {
    this.config = config
    this.dependency = dependency

    this.nextApp = next({
      dir: this.config.clientDir,
      dev: this.config.isDevelopment,
    })
  }

  async init(): Promise<void> {
    return this.nextApp.prepare()
  }

  requestValidator = Joi.object({})

  async handler(ctx: Context, req: Request): Promise<Response> {
    return {}
  }

  requestDecoder(koaCtx: Koa.Context): Request {
    return {}
  }

  async responseEncoder(koaCtx: Koa.Context, resp: Response): Promise<void> {
    koaCtx.respond = false
    koaCtx.status = 200

    await this.nextApp.render(koaCtx.req, koaCtx.res, koaCtx.path, koaCtx.query)
  }

  responseErrorEncoder(koaCtx: Koa.Context, err: Error): never {
    throw err
  }
}

export interface Config {
  clientDir: string
  isDevelopment: boolean
}

export interface Dependency {}

export interface Request {}

export interface Response {}
