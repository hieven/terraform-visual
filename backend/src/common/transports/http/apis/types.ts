import { Context } from '@common/utils/context'
import Joi from 'joi'
import Koa from 'koa'

export interface RequestDecoder<Request> {
  (koaCtx: Koa.Context): Promise<Request> | Request
}

export interface RequestHandler<Request, Response> {
  (ctx: Context, req: Request): Promise<Response>
}

export interface ResponseEncoder<Response> {
  (koaCtx: Koa.Context, resp: Response): void
}

export interface ResponseErrorEncoder {
  (koaCtx: Koa.Context, err: Error): never
}

export interface ApiManager<Request, Response> {
  requestDecoder: RequestDecoder<Request>
  requestValidator: Joi.ObjectSchema
  handler: RequestHandler<Request, Response>
  responseEncoder: ResponseEncoder<Response>
  responseErrorEncoder: ResponseErrorEncoder
}
