import { BlobStore } from '@app/data'
import { AppError } from '@common/utils/errors'

export const getManager = async (config: Config): Promise<BlobStore.Types.Manager> => {
  if (config.type === 'aws-s3' && config.awsS3) {
    return new BlobStore.AwsS3.Manager(config.awsS3, {})
  }

  throw new ErrNonSupported()
}

export interface Config {
  type: string
  awsS3?: BlobStore.AwsS3.Config
}

export class ErrNonSupported extends AppError {}
