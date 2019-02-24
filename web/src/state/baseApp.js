import { combineReducers } from 'redux-immutable'
import { CLIENT_STATE_PATH, reducer } from './clientState'
import { addOrimReducers } from './OrimServices'

const baseApp = combineReducers(addOrimReducers({
  [CLIENT_STATE_PATH]: reducer
}))

export default baseApp
