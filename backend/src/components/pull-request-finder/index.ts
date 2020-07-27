import * as Github from '@app/components/pull-request-finder/github'
import * as Types from '@app/components/pull-request-finder/types'
import { AppError } from '@app/common/utils/errors'
import { PullRequestFinder } from '@app/components'
export { Github, Types }

export const getManager = async (config: Config): Promise<PullRequestFinder.Types.Manager> => {
  if (config.type === 'github' && config.github) {
    return new PullRequestFinder.Github.Manager(config.github)
  }

  throw new ErrNonSupported()
}

export interface Config {
  type: string
  github?: PullRequestFinder.Github.Config
}

export class ErrNonSupported extends AppError {}
