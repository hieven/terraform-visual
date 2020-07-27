import { LinkCreator } from '@app/components'
import { BlobStore } from '@app/data'
import { NotFound } from '@common/transports/http/utils/errors'
import { Context } from '@common/utils/context'
import { AppError } from '@common/utils/errors'
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
    return {
      owner: koaCtx.request.body.owner,
      repoName: koaCtx.request.body.repoName,
      buildNum: koaCtx.request.body.buildNum,
      alias: koaCtx.request.body.alias,
    }
  }

  requestValidator = Joi.object({
    owner: Joi.string().required(),
    repoName: Joi.string().required(),
    buildNum: Joi.number().positive().integer().required(),
    alias: Joi.string().default('plan'),
  })

  async handler(ctx: Context, req: Request): Promise<Response> {
    const key = this.dependency.linkCreator.getFilePath({
      owner: req.owner,
      repoName: req.repoName,
      buildNum: req.buildNum,
      alias: req.alias,
    })

    let getObjectResp: BlobStore.Types.GetObjectResponse
    try {
      getObjectResp = await this.dependency.blobStoreManager.getObject(ctx, { key })
    } catch (err) {
      if (err instanceof BlobStore.Types.ErrNotFound) {
        throw new ErrTerraformPlanNotFound()
      }

      throw err
    }

    return {
      meta: {},
      data: {
        plan: JSON.parse(getObjectResp.body),
      },
    }
  }

  responseEncoder(koaCtx: Koa.Context, resp: Response): void {
    koaCtx.status = 200
    koaCtx.body = resp
  }

  responseErrorEncoder(koaCtx: Koa.Context, err: Error): never {
    if (err instanceof ErrTerraformPlanNotFound) {
      throw new NotFound(err)
    }

    throw err
  }
}

export interface Config {}

export interface Dependency {
  linkCreator: LinkCreator.Types.Manager
  blobStoreManager: BlobStore.Types.Manager
}

export interface Request {
  owner: string
  repoName: string
  buildNum: number
  alias: string
}

export interface Response {
  meta: {}
  data: {
    plan: {}
  }
}

export class ErrTerraformPlanNotFound extends AppError {
  constructor() {
    super({ code: 'get-terraform-plan_0000', message: 'Terraform plan not found' })
  }
}
