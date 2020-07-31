import { entityUtils } from '@app/data/entities'
import awsS3 from '@app/data/examples/aws-s3.json'

export const examples = {
  awsS3: entityUtils.TerraformPlan.fromJson(awsS3),
}
