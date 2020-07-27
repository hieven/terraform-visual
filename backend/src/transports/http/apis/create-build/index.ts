import { PullRequestCommenter, PullRequestFinder, LinkCreator } from '@app/components'
import { BlobStore } from '@app/data'
import { Context } from '@common/utils/context'
import fs from 'fs'
import Joi from 'joi'
import Koa from 'koa'

export class Manager {
  private config: Config
  private dependency: Dependency

  constructor(config: Config, dependency: Dependency) {
    this.config = config
    this.dependency = dependency
  }

  async requestDecoder(koaCtx: Koa.Context): Promise<Request> {
    const req: Request = {
      owner: koaCtx.request.body.owner,
      repoName: koaCtx.request.body.repoName,
      branchName: koaCtx.request.body.branchName,
      buildNum: koaCtx.request.body.buildNum,
      pullRequest: koaCtx.request.body.pullRequest,
      commitSha: koaCtx.request.body.commitSha,
      terraformPlans: [],
    }

    if (!koaCtx.request.files) {
      return req
    }

    for (const [alias, file] of Object.entries(koaCtx.request.files)) {
      req.terraformPlans.push({ alias, file: await fs.promises.readFile(file.path) })
    }

    return req
  }

  requestValidator = Joi.object({
    owner: Joi.string().required(),
    repoName: Joi.string().required(),
    branchName: Joi.string().required(),
    buildNum: Joi.number().required(),
    pullRequest: Joi.number().optional(),
    commitSha: Joi.string().required(),
    terraformPlans: Joi.array()
      .items(
        Joi.object({
          alias: Joi.string().required(),
          file: Joi.binary().min(1).required(),
        }),
      )
      .min(1),
  })

  async handler(ctx: Context, req: Request): Promise<Response> {
    const keys = req.terraformPlans.map((plan) =>
      this.dependency.linkCreator.getFilePath({
        owner: req.owner,
        repoName: req.repoName,
        buildNum: req.buildNum,
        alias: plan.alias,
      }),
    )

    await Promise.all(
      req.terraformPlans.map((plan, idx) =>
        this.dependency.blobStoreManager.putObject(ctx, {
          key: keys[idx],
          body: plan.file,
        }),
      ),
    )

    if (!this.config.disallowedCommentBranchNames.includes(req.branchName)) {
      let pullRequest = req.pullRequest
      if (!pullRequest) {
        try {
          const resp = await this.dependency.pullRequestFinder.getPullRequest({
            owner: req.owner,
            repoName: req.repoName,
            branchName: req.branchName,
          })

          pullRequest = resp.pullRequest
        } catch (err) {
          // TODO: log error
        }
      }

      if (pullRequest) {
        await this.dependency.pullRequestCommenter.upsertComment({
          owner: req.owner,
          repoName: req.repoName,
          pullRequest,
          buildNum: req.buildNum,
          commitSha: req.commitSha,
          terraformPlans: req.terraformPlans,
        })
      }
    }

    const resp: Response = {
      meta: {},
      data: {
        links: {},
      },
    }

    for (const plan of req.terraformPlans) {
      resp.data.links[plan.alias] = this.dependency.linkCreator.getLink({
        owner: req.owner,
        repoName: req.repoName,
        buildNum: req.buildNum,
        alias: plan.alias,
      })
    }

    return resp
  }

  responseEncoder(koaCtx: Koa.Context, resp: Response): void {
    koaCtx.status = 201
    koaCtx.body = resp
  }

  responseErrorEncoder(koaCtx: Koa.Context, err: Error): never {
    throw err
  }
}

export interface Config {
  disallowedCommentBranchNames: string[]
}

export interface Dependency {
  linkCreator: LinkCreator.Types.Manager
  pullRequestCommenter: PullRequestCommenter.Types.Manager
  pullRequestFinder: PullRequestFinder.Types.Manager
  blobStoreManager: BlobStore.Types.Manager
}

export interface Request {
  owner: string
  repoName: string
  branchName: string
  buildNum: number
  commitSha: string
  terraformPlans: TerraformPlan[]
  pullRequest?: number
}

export interface TerraformPlan {
  alias: string
  file: Buffer
}

export interface Response {
  meta: {}
  data: {
    links: { [alias: string]: string }
  }
}
