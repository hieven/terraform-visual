import { useTerraformPlan } from '@app/context/terraform-plan'
import { Entities } from '@app/data'
import { Amplitude } from '@app/utils/amplitude'
import { useEffect, useState } from 'react'
import { PlanGraph, FocusedView } from '@app/components'

export const C = () => {
  useEffect(() => {
    Amplitude.logEvent('enter page', { page: 'plan-details' })
  }, [])

  const terraformPlan = useTerraformPlan()

  const [focusedResource, setFocusedResource] = useState<Entities.TerraformPlanResourceChange>()

  return (
    <div>
      <PlanGraph.C plan={terraformPlan.data} setFocusedResource={setFocusedResource} />
      <FocusedView.C resource={focusedResource} />
    </div>
  )
}
