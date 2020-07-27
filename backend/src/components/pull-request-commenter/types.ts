export interface Manager {
  upsertComment(req: UpsertCommentRequest): Promise<void>
}

export interface UpsertCommentRequest {
  owner: string
  repoName: string
  pullRequest: number
  buildNum: number
  commitSha: string
  terraformPlans: { alias: string; file: Buffer }[]
}
