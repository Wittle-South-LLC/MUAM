/* clientState.js - Holds client (non-persistent) state for app */
import { fromJS, Map } from 'immutable'
import { config } from './OrimServices'
import { status } from 'redux-immutable-model'

// State path constants
export const CLIENT_STATE_PATH = 'clientState'
export const LOGGED_IN_USER = 'loggedInUser'

// Constants that represent client state actions
const SET_MESSAGE = 'SET_MESSAGE'
const TRANSITION_TO = 'TRANSITION_TO'

// Function to set the status message manually where needed
export function setMessage (message, messageType = 'status') {
  return { type: SET_MESSAGE, messageType, message }
}

// Function to set a next path if needed
export function setNewPath (newPath) {
  return { type: TRANSITION_TO, newPath }
}

export function loggedInUser (state) {
  return state.getIn([CLIENT_STATE_PATH, LOGGED_IN_USER])
}

export function reducer(state = Map({[LOGGED_IN_USER]: undefined}), action) {
  if (action.type === SET_MESSAGE) {
    return state.delete('transitionTo')
                .set('message', fromJS(action.message))
                .set('messageType', action.messageType)
  } else if (action.type === TRANSITION_TO) {
    return state.set('transitionTo', action.newPath)
  } else if (action.verb === config.verbs.LOGIN && action.status === status.SUCCESS) {
    return state.set(LOGGED_IN_USER, action.rimObj)
  } else if (action.verb === config.verbs.LOGOUT && action.status === status.SUCCESS) {
    return state.set(LOGGED_IN_USER, undefined)
  } else {
    return state
  }
}
