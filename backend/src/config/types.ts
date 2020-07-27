import { AppError } from '@common/utils/errors'
import { BlobStore } from '@app/data'
import { Http } from '@app/transports'
import { PullRequestCommenter, LinkCreator, PullRequestFinder } from '@app/components'

export interface Manager {
  load(): Config
}

export interface Config {
  env: string

  components: {
    linkCreator: LinkCreator.Config
    pullRequestCommenter: PullRequestCommenter.Config
    pullRequestFinder: PullRequestFinder.Config
  }

  data: {
    blobStore: BlobStore.Config
  }

  transports: {
    http: Http.Config
  }
}

export class ErrNodeEnvNotAllowed extends AppError {}
