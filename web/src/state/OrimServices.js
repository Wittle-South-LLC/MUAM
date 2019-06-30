/* OrimServices.js - Instantiates services for model objects */
import { Configuration, SimpleObjectService } from 'redux-immutable-model'
import { applyHeaders } from '../utils/jwt'
import Group from './Group'
import CustomMembershipService from './CustomMembershipService'
import CustomUserService from './CustomUserService'

export const config = new Configuration()

// Set the login and logout paths for this application
const myGetApiPath = (verb, prefix) => {
  console.log(`myGetApiPath: prefix = ${prefix}`)
  if (verb === config.verbs.LOGIN || verb === config.verbs.HYDRATE) return prefix ? `/${prefix}/login` : '/login'
  if (verb === config.verbs.LOGOUT) return `/${prefix}/logout`
  return undefined
}

// Need to add a getApiPath function to the configuration handle login / logout
config.setGetApiPath(myGetApiPath)
config.setApplyHeaders(applyHeaders)

export const GroupService = new SimpleObjectService(Group, config)
export const MembershipService = new CustomMembershipService(config)
export const UserService = new CustomUserService(config)

export function addOrimReducers(stateObj) {
  stateObj[GroupService.getStatePath()] = GroupService.reducer
  stateObj[MembershipService.getStatePath()] = MembershipService.reducer
  stateObj[UserService.getStatePath()] = UserService.reducer
  return stateObj
}