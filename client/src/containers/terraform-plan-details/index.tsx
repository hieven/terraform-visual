import FocusedResourceView from '@app/containers/terraform-plan-details/focused-resource-view'
import { Entities, Redux } from '@app/data'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default () => {
  const router = useRouter()
  const dispatch = useDispatch()

  // TODO: not safe to assume it always being string
  const owner = router.query.owner as string
  const repoName = router.query.repoName as string
  const buildNum = +(router.query.buildNum as string)
  const alias = router.query.alias as string

  const terraformPlan = useSelector(
    Redux.TerraformPlans.selectors.getTerraformPlan({ owner, repoName, buildNum, alias }),
  )

  useEffect(() => {
    if (!owner || !repoName || isNaN(buildNum) || !alias || terraformPlan) {
      return
    }

    dispatch(
      Redux.TerraformPlans.thunkActions.getTerraformPlan({ owner, repoName, buildNum, alias }),
    )
  }, [owner, repoName, buildNum, alias])

  const [focusedResource, setFocusedResource] = useState<Entities.TerraformPlanResourceChange>()

  return (
    <div>
      <PlanGraph plan={terraformPlan} setFocusedResource={setFocusedResource} />
      <FocusedResourceView resource={focusedResource} />
    </div>
  )
}

const PlanGraph = dynamic(() => import('@app/containers/terraform-plan-details/plan-graph'), {
  ssr: false,
})
