/* OrimServices.js - Instantiates services for model objects */
import { BaseRIMService, Configuration } from 'redux-immutable-model'
import CustomUserService from './CustomUserService'
import Group from './Group'
import Membership from './Membership'
import { applyHeaders } from '../utils/jwt'

export const config = new Configuration()

// Need to create a customized user service to:
// --> create dispatchable action for login / logout
// --> reduce login / logout actions (maybe?)

export const GroupService = new BaseRIMService(Group, config)
export const MembershipService = new BaseRIMService(Membership, config)
export const UserService = new CustomUserService(config)

// Set the login and logout paths for this application
const myGetApiPath = (verb) => {
  if (verb === config.verbs.LOGIN || verb === config.verbs.HYDRATE) return '/login'
  if (verb === config.verbs.LOGOUT) return '/logout'
  return undefined
}

// Need to add a getApiPath function to the configuration handle login / logout
config.setGetApiPath(myGetApiPath)
config.setApplyHeaders(applyHeaders)

export function addOrimReducers(stateObj) {
  stateObj[GroupService.getStatePath()] = GroupService.reducer
  stateObj[MembershipService.getStatePath()] = MembershipService.reducer
  stateObj[UserService.getStatePath()] = UserService.reducer
  return stateObj
}