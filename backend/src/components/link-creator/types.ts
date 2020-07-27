export interface Manager {
  getFilePath(req: GetFilePathRequest): string
  getLink(req: GetLinkRequest): string
}

export interface GetFilePathRequest {
  owner: string
  repoName: string
  buildNum: number
  alias: string
}

export interface GetLinkRequest {
  owner: string
  repoName: string
  buildNum: number
  alias: string
}
