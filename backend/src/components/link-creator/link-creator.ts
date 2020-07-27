import { LinkCreator } from '@app/components'

export class Manager implements LinkCreator.Types.Manager {
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  getFilePath(req: LinkCreator.Types.GetFilePathRequest): string {
    return `builds/${req.owner}/${req.repoName}/${req.buildNum}/${req.alias}.json`
  }

  getLink(req: LinkCreator.Types.GetLinkRequest): string {
    return `${this.config.baseUrl}/${req.owner}/${req.repoName}/${req.buildNum}/${req.alias}`
  }
}

export interface Config {
  baseUrl: string
}
