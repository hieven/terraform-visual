import { PlanDetails } from '@app/containers'
import { useDispatchTerraformPlan } from '@app/context/terraform-plan'
import { examples } from '@app/data/examples'
import { Amplitude } from '@app/utils/amplitude'
import { useEffect } from 'react'

const Page = () => {
  const dispatch = useDispatchTerraformPlan()

  useEffect(() => {
    Amplitude.logEvent('enter page', { page: 'examples', example: 'aws-s3' })

    dispatch({
      type: 'UPLOAD_TERRAFORM_PLAN',
      payload: examples.awsS3,
    })
  }, [])

  return PlanDetails.C()
}

export default Page
