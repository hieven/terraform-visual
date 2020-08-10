import { PlanDetails } from '@app/containers'
import { Amplitude } from '@app/utils/amplitude'
import { useEffect } from 'react'

const Page = () => {
  useEffect(() => {
    Amplitude.logEvent('enter page', { page: 'plan-details' })
  }, [])

  return PlanDetails.C()
}

export default Page
