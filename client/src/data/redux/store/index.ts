import { TerraformPlans } from '@app/data/redux'
import * as rtk from '@reduxjs/toolkit'
import { Context, createWrapper, MakeStore } from 'next-redux-wrapper'

const reducers = {
  terraformPlans: TerraformPlans.reducer,
}

const rootReducer = rtk.combineReducers(reducers)
const middleware = [...rtk.getDefaultMiddleware()]

const makeStore: MakeStore = (ctx: Context) => {
  const store = rtk.configureStore({
    reducer: rootReducer,
    middleware,
  })

  return store
}

export const ReduxWrapper = createWrapper(makeStore)

// NOTE: A workaround to correct typings of Dispatch
// typings here should be same as created one in above function
let store: rtk.EnhancedStore<rtk.CombinedState<typeof reducers>, rtk.AnyAction, typeof middleware>

export type ReduxRootState = ReturnType<typeof rootReducer>
export type ReduxAppDispatch = typeof store.dispatch
export type ReduxAppThunk<TReturn = void> = rtk.ThunkAction<
  TReturn,
  ReduxRootState,
  undefined,
  rtk.Action<string>
>
