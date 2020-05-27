import { FocusedResourceView } from '@app/containers/plan-details/focused-resource-view'
import { useTerraformPlan } from '@app/context/terraform-plan'
import { entities } from '@app/data/entities'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Amplitude } from '@app/utils/amplitude'

const PlanGraph = dynamic(
  () => import('@app/containers/plan-details/plan-graph'),
  {
    ssr: false,
  }
)

export default () => {
  useEffect(() => {
    Amplitude.logEvent('enter page', { page: 'plan-details' })
  }, [])

  const terraformPlan = useTerraformPlan()

  const [
    focusedResource,
    setFocusedResource,
  ] = useState<entities.TerraformPlanResourceChange | null>(null)

  if (!terraformPlan.data) {
    return <div>No plan available</div>
  }

  return (
    <>
      <PlanGraph
        resources={terraformPlan.data.resourceChanges}
        setFocusedResource={setFocusedResource}
      />
      <FocusedResourceView resource={focusedResource} />
    </>
  )
}
