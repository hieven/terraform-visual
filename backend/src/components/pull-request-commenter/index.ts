import { AppError } from '@app/common/utils/errors'
import { LinkCreator, PullRequestCommenter, TerraformReader } from '@app/components'
import * as Github from '@app/components/pull-request-commenter/github'
import * as Types from '@app/components/pull-request-commenter/types'

export { Github, Types }

export const getManager = async (
  config: Config,
  dependency: Dependency,
): Promise<PullRequestCommenter.Types.Manager> => {
  if (config.type === 'github' && config.github) {
    return new PullRequestCommenter.Github.Manager(config.github, dependency)
  }

  throw new ErrNonSupported()
}

export interface Config {
  type: string
  github?: PullRequestCommenter.Github.Config
}

export interface Dependency {
  linkCreator: LinkCreator.Types.Manager
  terraformReader: TerraformReader.Types.Manager
}

export class ErrNonSupported extends AppError {}
