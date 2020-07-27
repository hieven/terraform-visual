import { LinkCreator, PullRequestCommenter, PullRequestFinder } from '@app/components'
import { BlobStore } from '@app/data'
import { Apis, Middlewares, Types } from '@app/transports/http'
import { ApiManager } from '@common/transports/http/apis/types'
import Router from '@koa/router'
import Koa from 'koa'
import koaBody from 'koa-body'
import koaCompress from 'koa-compress'

export class Server implements Types.Server {
  private config: Config
  private dependency: Dependency

  private koa: Koa

  constructor(config: Config, dependency: Dependency) {
    this.config = config
    this.dependency = dependency

    this.koa = new Koa()
  }

  async start(callback: () => void): Promise<void> {
    await this.registerRoutes()

    this.koa.listen(this.config.port, callback)
  }

  shutdown(): void {
    console.log('Not implemented')
  }

  private async registerRoutes(): Promise<void> {
    // Middleware managers
    const requestErrorLogger = new Middlewares.RequestErrorLogger.Manager()

    // API managers
    const healthCheckapiManager = new Apis.HealthCheck.Manager({}, {})
    const createBuildapiManager = new Apis.CreateBuild.Manager(this.config.apis.createBuild, {
      pullRequestCommenter: this.dependency.pullRequestCommenter,
      pullRequestFinder: this.dependency.pullRequestFinder,
      linkCreator: this.dependency.linkCreator,
      blobStoreManager: this.dependency.blobStoreManager,
    })
    const getTerraformPlanapiManager = new Apis.GetTerraformPlan.Manager(
      {},
      {
        linkCreator: this.dependency.linkCreator,
        blobStoreManager: this.dependency.blobStoreManager,
      },
    )
    const apiWebManager = new Apis.Web.Manager(this.config.apis.web, {})
    await apiWebManager.init()

    this.koa.use(requestErrorLogger.handle)

    // health check
    const healthCheckRouter = new Router()
    healthCheckRouter.get('/api/health-check', ...this.registerRoute(healthCheckapiManager))

    // apis
    const apiRouter = new Router()
    apiRouter.use(koaBody({ multipart: true }))
    apiRouter.use(koaCompress())

    apiRouter.post('/api/create-build', ...this.registerRoute(createBuildapiManager))
    apiRouter.post('/api/get-terraform-plan', ...this.registerRoute(getTerraformPlanapiManager))

    // web
    const webRouter = new Router()
    webRouter.get('(.*)', ...this.registerRoute(apiWebManager))

    this.koa.use(healthCheckRouter.routes())
    this.koa.use(apiRouter.routes())
    this.koa.use(webRouter.routes())
  }

  private registerRoute(apiManager: ApiManager<any, any>): Router.Middleware[] {
    const responseErrorEncoder = new Middlewares.ResponseErrorEncoder.Manager(
      apiManager.responseErrorEncoder,
    )
    const requestDecoder = new Middlewares.RequestDecoder.Manager(apiManager.requestDecoder)
    const requestValidator = new Middlewares.RequestValidator.Manager(apiManager.requestValidator)
    const requestProxy = new Middlewares.RequestProxy.Manager(apiManager.handler.bind(apiManager))
    const responseEncoder = new Middlewares.ResponseEncoder.Manager(
      apiManager.responseEncoder.bind(apiManager),
    )

    return [
      responseErrorEncoder.handle,
      requestDecoder.handle,
      requestValidator.handle,
      requestProxy.handle,
      responseEncoder.handle,
    ]
  }
}

export interface Config {
  port: number

  apis: {
    createBuild: Apis.CreateBuild.Config
    web: Apis.Web.Config
  }
}

export interface Dependency {
  linkCreator: LinkCreator.Types.Manager
  pullRequestCommenter: PullRequestCommenter.Types.Manager
  pullRequestFinder: PullRequestFinder.Types.Manager
  blobStoreManager: BlobStore.Types.Manager
}
