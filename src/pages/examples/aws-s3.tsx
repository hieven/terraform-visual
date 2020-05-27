import page from '@app/containers/plan-details'
import { examples } from '@app/data/examples'
import { useEffect } from 'react'
import { useDispatchTerraformPlan } from '@app/context/terraform-plan'
import { Amplitude } from '@app/utils/amplitude'

export default () => {
  const dispatch = useDispatchTerraformPlan()

  useEffect(() => {
    Amplitude.logEvent('enter page', { page: 'examples', example: 'aws-s3' })

    dispatch({
      type: 'UPLOAD_TERRAFORM_PLAN',
      payload: examples.awsS3,
    })
  }, [])

  return page()
}
