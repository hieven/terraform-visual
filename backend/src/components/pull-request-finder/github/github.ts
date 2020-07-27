import { Octokit } from '@octokit/rest'
import { PullRequestFinder } from '@app/components'

export class Manager implements PullRequestFinder.Types.Manager {
  private config: Config

  private githubClient: Octokit

  constructor(config: Config) {
    this.config = config

    this.githubClient = new Octokit({ auth: this.config.githubToken })
  }

  async getPullRequest(
    req: PullRequestFinder.Types.GetPullRequestRequest,
  ): Promise<PullRequestFinder.Types.GetPullRequestResponse> {
    const resp = await this.githubClient.search.issuesAndPullRequests({
      q: `repo:${req.owner}/${req.repoName}+is:pr+is:open+head:${req.branchName}`,
      per_page: 1,
    })

    if (resp.data.total_count === 0) {
      throw new PullRequestFinder.Types.ErrNotFound()
    }

    return {
      pullRequest: resp.data.items[0].number,
    }
  }
}

export interface Config {
  githubToken: string
}
