import { BlobStore } from '@app/data'
import S3 from 'aws-sdk/clients/s3'

export const GetObjectRequest = {
  toS3GetObjectRequest(req: BlobStore.Types.GetObjectRequest): S3.GetObjectRequest {
    return {
      Bucket: '',
      Key: req.key,
    }
  },
}

export const PutObjectRequest = {
  toS3PutObjectRequest(req: BlobStore.Types.PutObjectRequest): S3.PutObjectRequest {
    return {
      Bucket: '',
      Key: req.key,
      Body: req.body,
    }
  },
}
