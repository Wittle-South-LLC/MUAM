/* CustomMembershipService.js - Customized service for User objects */
import { RelationshipObjectService, status } from 'redux-immutable-model'
import Membership from './Membership'
import User from './User'
import Group from './Group'

export default class CustomMembershipService extends RelationshipObjectService {
  constructor(config) {
    super(Membership, config)
  }

  addMembership(membership) {
    return this.setById(membership)
  }

  getMember (userId, groupId) {
    return this.getByIds(groupId, userId)
  }

  getMembersForGroup(group) {
    return this.getObjectMap(group)
  }

  getMembersForUser(user) {
    return this.getObjectMap(user)
  }

  newGroupForUser(user, groupId) {
    const newMembership = new Membership({
      [User._IdentityKey]: user.getId(),
      [Group._IdentityKey]: groupId,
      [Membership._IsAdminKey]: false,
      [Membership._IsOwnerKey]: false
    }, false, false, true)
    this.setById(newMembership)
    return newMembership
  }

  newUserForGroup(group, userId) {
    const newMembership = new Membership({
      [User._IdentityKey]: userId,
      [Group._IdentityKey]: group.getId(),
      [Membership._IsAdminKey]: false,
      [Membership._IsOwnerKey]: false
    }, false, false, true)
    this.setById(newMembership)
    return newMembership
  }

  reducer (state = this.getInitialState(), action) {
    if (action.verb === this.config.verbs.SAVE_NEW &&
               action.status === status.SUCCESS &&
               action.rimObj && action.rimObj instanceof Group) {
      // This is a special case where we will assign the logged in user as
      // a group owner for the group just created; the server-side API does the
      // same thing
      console.log('CustomMembershipService.reducer: receivedData[membership] = ', action.receivedData['membership'])
      let membership = new Membership(action.receivedData['membership'])
      return this.setById(membership)
    }
    return super.reducer(state, action)
  }
}