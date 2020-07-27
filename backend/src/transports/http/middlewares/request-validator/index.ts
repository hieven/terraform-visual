import Joi from 'joi'
import Koa from 'koa'

export class Manager {
  private requestPayloadSchema: Joi.ObjectSchema

  constructor(requestPayloadSchema: Joi.ObjectSchema) {
    this.requestPayloadSchema = requestPayloadSchema
  }

  handle = async (koaCtx: Koa.Context, next: Function): Promise<void> => {
    const req = koaCtx.state.requestPayload

    const validateResult = this.requestPayloadSchema.validate(req)
    if (validateResult.error) {
      throw validateResult.error
    }

    koaCtx.state.requestPayload = validateResult.value

    await next()
  }
}
