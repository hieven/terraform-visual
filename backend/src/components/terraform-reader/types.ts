export interface Manager {
  getStats(req: GetStatsRequest): Promise<GetStatsResponse>
}

export interface GetStatsRequest {
  file: Buffer
}

export interface GetStatsResponse {
  add: number
  change: number
  destroy: number
}
