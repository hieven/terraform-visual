import { Entities } from '@app/data'
import awsS3 from '@app/data/examples/aws-s3.json'

export const examples = {
  awsS3: Entities.Utils.TerraformPlan.fromJson(awsS3),
}
