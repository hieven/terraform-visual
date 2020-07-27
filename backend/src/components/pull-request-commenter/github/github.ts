import { PullRequestCommenter, TerraformReader } from '@app/components'
import { Octokit } from '@octokit/rest'

export class Manager implements PullRequestCommenter.Types.Manager {
  private config: Config
  private dependency: PullRequestCommenter.Dependency

  private githubClient: Octokit

  constructor(config: Config, dependency: PullRequestCommenter.Dependency) {
    this.config = config
    this.dependency = dependency

    this.githubClient = new Octokit({ auth: this.config.githubToken })
  }

  async upsertComment(req: PullRequestCommenter.Types.UpsertCommentRequest): Promise<void> {
    const terraformStats = await Promise.all(
      req.terraformPlans.map((plan) =>
        this.dependency.terraformReader.getStats({ file: plan.file }),
      ),
    )

    const aliases = req.terraformPlans.map((plan) => plan.alias)

    const links = aliases.map((alias) =>
      this.dependency.linkCreator.getLink({
        owner: req.owner,
        repoName: req.repoName,
        buildNum: req.buildNum,
        alias,
      }),
    )

    const md = this.prepareMarkdown({
      commitSha: req.commitSha,
      buildNum: req.buildNum,
      aliases,
      terraformStats,
      links,
    })

    const commentId = await this.getCommentIdIfExists({
      owner: req.owner,
      repoName: req.repoName,
      pullRequest: req.pullRequest,
    })

    const params = {
      owner: req.owner,
      repo: req.repoName,
      issue_number: req.pullRequest,
      body: md,
    }

    // TODO: log error if failed
    if (commentId) {
      await this.githubClient.issues.updateComment({ ...params, comment_id: commentId })
    } else {
      await this.githubClient.issues.createComment(params)
    }
  }

  private prepareMarkdown(req: PrepareMarkdownRequest): string {
    let md = `
# Terraform Visual Report

| Name       | Value             |
|------------|-------------------|
| Commit SHA | #${req.commitSha} |
| Build Num  | ${req.buildNum}   |

| Alias | Add | Change | Destroy | Terraform Visual                                                              |
|-------|-----|--------|---------|--------------------------------------------------------------------|
`

    md =
      md +
      req.aliases
        .map(
          (alias, idx) =>
            `|${alias}|${req.terraformStats[idx].add}|${req.terraformStats[idx].change}|${req.terraformStats[idx].destroy}|[Link](${req.links[idx]})|`,
        )
        .join('\n')

    return md
  }

  private async getCommentIdIfExists(req: GetCommentIfExistsRequest): Promise<number | undefined> {
    const resp = await this.githubClient.issues.listComments({
      owner: req.owner,
      repo: req.repoName,
      issue_number: req.pullRequest,
    })

    for (const comment of resp.data) {
      if (comment.user.id === this.config.botUserId) {
        return comment.id
      }
    }

    return
  }
}

export interface Config {
  githubToken: string
  botUserId: number
}

interface PrepareMarkdownRequest {
  commitSha: string
  buildNum: number
  aliases: string[]
  terraformStats: TerraformReader.Types.GetStatsResponse[]
  links: string[]
}

interface GetCommentIfExistsRequest {
  owner: string
  repoName: string
  pullRequest: number
}
