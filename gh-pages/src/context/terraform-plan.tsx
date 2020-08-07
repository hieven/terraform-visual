import { Entities } from '@app/data'
import { createContext, useContext, useReducer, Dispatch } from 'react'

// @ts-ignore
const TerraformPlanContext = createContext<State>()
// @ts-ignore
const TerraformPlanDispatchContext = createContext<Dispatch<Action<Entities.TerraformPlan>>>()

interface State {
  data?: Entities.TerraformPlan
}

interface Action<TPayload = unknown> {
  type: string
  payload: TPayload
}

const reducer = (state: State, action: Action<Entities.TerraformPlan>) => {
  switch (action.type) {
    case 'UPLOAD_TERRAFORM_PLAN': {
      const newState = Object.assign({}, state, { data: action.payload })
      return newState
    }

    case 'CLEAR_TERRAFORM_PLAN': {
      return {}
    }

    default: {
      return state
    }
  }
}

export const TerraofmrPlanProvider = ({ children }: any) => {
  const [state, Dispatch] = useReducer(reducer, {})

  return (
    <TerraformPlanDispatchContext.Provider value={Dispatch}>
      <TerraformPlanContext.Provider value={state}>{children}</TerraformPlanContext.Provider>
    </TerraformPlanDispatchContext.Provider>
  )
}

export const useTerraformPlan = (): State => useContext(TerraformPlanContext)
export const useDispatchTerraformPlan = (): Dispatch<Action<Entities.TerraformPlan>> =>
  useContext(TerraformPlanDispatchContext)
