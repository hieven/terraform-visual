import { BlobStore } from '@app/data'
import { AwsS3 } from '@app/data/blob-store'
import { Context } from '@common/utils/context'
import { AWSError } from 'aws-sdk'
import S3 from 'aws-sdk/clients/s3'
import { PromiseResult } from 'aws-sdk/lib/request'

export class Manager implements BlobStore.Types.Manager {
  private config: Config
  private dependency: Dependency

  private s3Client: S3

  constructor(config: Config, dependency: Dependency) {
    this.config = config
    this.dependency = dependency

    this.s3Client = new S3()
  }

  async getObject(
    ctx: Context,
    req: BlobStore.Types.GetObjectRequest,
  ): Promise<BlobStore.Types.GetObjectResponse> {
    const s3Req = AwsS3.Transformers.GetObjectRequest.toS3GetObjectRequest(req)
    s3Req.Bucket = this.config.bucket

    let rawResp: PromiseResult<S3.GetObjectOutput, AWSError>
    try {
      rawResp = await this.s3Client.getObject(s3Req).promise()
    } catch (err) {
      if (isAwsError(err)) {
        if (err.code === AWS_ERROR_CODE.NO_SUCH_BUCKET) {
          throw new BlobStore.Types.ErrNotFound()
        }

        if (err.code === AWS_ERROR_CODE.NO_SUCH_KEY) {
          throw new BlobStore.Types.ErrNotFound()
        }
      }

      throw err
    }

    if (!rawResp.Body) {
      throw new BlobStore.Types.ErrNotFound()
    }

    const resp: BlobStore.Types.GetObjectResponse = {
      body: rawResp.Body.toString(),
    }

    return resp
  }

  async putObject(
    ctx: Context,
    req: BlobStore.Types.PutObjectRequest,
  ): Promise<BlobStore.Types.PutObjectResponse> {
    const s3Req = AwsS3.Transformers.PutObjectRequest.toS3PutObjectRequest(req)
    s3Req.Bucket = this.config.bucket

    await this.s3Client.putObject(s3Req).promise()

    const resp: BlobStore.Types.PutObjectResponse = {}
    return resp
  }
}

export interface Config {
  bucket: string
}

export interface Dependency {}

// We can't use instanceof AWSError because it's not an actual class
// https://github.com/aws/aws-sdk-js/issues/2611
function isAwsError(err: any): err is AWSError {
  return err && err.code
}

const AWS_ERROR_CODE = {
  NO_SUCH_BUCKET: 'NoSuchBucket',
  NO_SUCH_KEY: 'NoSuchKey',
}
