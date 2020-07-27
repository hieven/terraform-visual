import { Entities } from '@app/data'
import { ReduxRootState } from '@app/data/redux/store'
import qs from 'querystring'

interface GetFilterKeyProps {
  owner?: string
  repoName?: string
  buildNum?: number
  alias?: string
}

export const getFilterKey = (props: GetFilterKeyProps) => {
  const key = qs.stringify((props as unknown) as qs.ParsedUrlQueryInput)
  return key
}

interface GetTerraformPlanProps {
  owner: string
  repoName: string
  buildNum: number
  alias: string
}

export const getTerraformPlan = (props: GetTerraformPlanProps) => (
  state: ReduxRootState,
): Entities.TerraformPlan | undefined => {
  const key = getFilterKey(props)
  const ids = state.terraformPlans.filter[key] || []
  return state.terraformPlans.data[ids[0]]
}
