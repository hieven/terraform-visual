import { AppError } from '@app/common/utils/errors'

export interface Manager {
  getPullRequest(req: GetPullRequestRequest): Promise<GetPullRequestResponse>
}

export interface GetPullRequestRequest {
  owner: string
  repoName: string
  branchName: string
}

export interface GetPullRequestResponse {
  pullRequest: number
}

export class ErrNotFound extends AppError {}
