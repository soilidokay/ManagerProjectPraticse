import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { reducer as authReducer } from './authRedux'
import * as services from '../services'

export const makeStore = initialState => {
  return createStore(
    combineReducers({
      auth: authReducer
    }),
    initialState,
    applyMiddleware(thunk.withExtraArgument(services))
  )
}
