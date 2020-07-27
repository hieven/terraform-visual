import { Entities, Redux } from '@app/data'
import { ReduxState } from '@app/data/redux/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import merge from 'lodash/merge'
import { HYDRATE } from 'next-redux-wrapper'

const initialState: ReduxState<Entities.TerraformPlan> = {
  data: {},
  filter: {},
}

export const thunkActions = {
  getTerraformPlan: createAsyncThunk<GetTerraformPlanResponse, GetTerraformPlanRequest>(
    'getTerraformPlan',
    async (req) => {
      // TODO: an API manager
      const rawResp = await fetch('/api/get-terraform-plan', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(req),
      })

      return await rawResp.json()
    },
  ),
}

export const { reducer, actions } = createSlice({
  name: 'terraformPlans',
  initialState,
  reducers: {
    [HYDRATE](state): void {},
  },
  extraReducers: (builder) => {
    // getTerraformPlan
    builder.addCase(thunkActions.getTerraformPlan.pending, () => {})
    builder.addCase(thunkActions.getTerraformPlan.fulfilled, (state, action) => {
      const key = Redux.TerraformPlans.selectors.getFilterKey(action.meta.arg)
      const item = Entities.Utils.TerraformPlan.fromJson(action.payload.data.plan)
      state.data[key] = merge(state.data[key], item)

      const filter = new Set(state.filter[key]).add(key)
      state.filter[key] = Array.from(filter)
    })
    builder.addCase(thunkActions.getTerraformPlan.rejected, () => {})
  },
})

// TODO: move to centralized
export interface GetTerraformPlanRequest {
  owner: string
  repoName: string
  buildNum: number
  alias?: string
}

export interface GetTerraformPlanResponse {
  meta: {}
  data: {
    plan: {}
  }
}
