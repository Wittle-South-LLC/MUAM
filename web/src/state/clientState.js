/* clientState.js - Holds client (non-persistent) state for app */
import { fromJS, Map } from 'immutable'
import { config } from './OrimServices'
import User from './User'
import { status } from 'redux-immutable-model'

// State path constants
export const CLIENT_STATE_PATH = 'clientState'
export const LOGGED_IN_USER = 'loggedInUser'
export const NEEDS_HYDRATE = 'pleaseHydrate'

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

export function needsHydrate (state) {
  return state.hasIn([CLIENT_STATE_PATH, NEEDS_HYDRATE])
}

export function reducer(state = Map({[LOGGED_IN_USER]: undefined}), action) {
  if (action.type === SET_MESSAGE) {
    return state.delete('transitionTo')
                .set('message', fromJS(action.message))
                .set('messageType', action.messageType)
  } else if (action.type === TRANSITION_TO) {
    return state.set('transitionTo', action.newPath)
  } else if (action.verb === config.verbs.LOGIN && action.status === status.SUCCESS) {
    // When login starts, user_id of the rimObj is set as a new user. If login is
    // successful, we'll be storing a user object in application state; we want it to
    // have the actual user UUID. That actual UUID is returned as payload from login,
    // so update the rimObj with the user UUID before saving.
    return state.set(LOGGED_IN_USER, action.rimObj.updateField(User._IdentityKey, action.receivedData.Users[0][User._IdentityKey]))
                .set(NEEDS_HYDRATE, true)
  } else if (action.verb === config.verbs.LOGOUT && action.status === status.SUCCESS) {
    return state.set(LOGGED_IN_USER, undefined)
  } else {
    return state.has(NEEDS_HYDRATE) ? state.delete(NEEDS_HYDRATE) : state
  }
}
