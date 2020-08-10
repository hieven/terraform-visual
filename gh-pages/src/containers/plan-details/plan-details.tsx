import { FocusedView, PlanGraph } from '@app/components'
import { useTerraformPlan } from '@app/context/terraform-plan'
import { Entities } from '@app/data'
import { useState } from 'react'

export const C = () => {
  const terraformPlan = useTerraformPlan()

  const [focusedResource, setFocusedResource] = useState<Entities.TerraformPlanResourceChange>()

  return (
    <div>
      <PlanGraph.C plan={terraformPlan.data} setFocusedResource={setFocusedResource} />
      <FocusedView.C resource={focusedResource} />
    </div>
  )
}
