import { Context } from '@common/utils/context'
import { AppError } from '@common/utils/errors'

export interface Manager {
  getObject(ctx: Context, req: GetObjectRequest): Promise<GetObjectResponse>
  putObject(ctx: Context, req: PutObjectRequest): Promise<PutObjectResponse>
}

export interface GetObjectRequest {
  key: string
}

export interface GetObjectResponse {
  body: string
}

export interface PutObjectRequest {
  key: string
  body: string | Buffer
}

export interface PutObjectResponse {}

export class ErrNotFound extends AppError {}
