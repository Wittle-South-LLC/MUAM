/* OrimServices.js - Instantiates services for model objects */
import { BaseRIMService, Configuration } from 'redux-immutable-model'
import Group from './Group'
import Membership from './Membership'
import User from './User'

const config = new Configuration()

export const GroupService = new BaseRIMService(Group, config)
export const MembershipService = new BaseRIMService(Membership, config)
export const UserService = new BaseRIMService(User, config)

export function addOrimReducers(stateObj) {
  stateObj[GroupService.getStatePath()] = GroupService.reducer
  stateObj[MembershipService.getStatePath()] = MembershipService.reducer
  stateObj[UserService.getStatePath()] = UserService.reducer
  return stateObj
}