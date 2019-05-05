/* CustomMembershipService.js - Customized service for User objects */
import { Map } from 'immutable'
import { BaseRIMService, status } from 'redux-immutable-model'
import Membership from './Membership'
import User from './User'
import Group from './Group'

export default class CustomMembershipService extends BaseRIMService {
  constructor(config) {
    super(Membership, config)
  }

  // We need to map contained objects by two different IDs
  static _UserIdMap = 'USERID_MAP'
  static _GroupIdMap = 'GROUPID_MAP'

  addMembership(membership) {
    let newState = this._state.hasIn([CustomMembershipService._UserIdMap, membership.getUserId()])
      ? this._state.setIn([CustomMembershipService._UserIdMap, membership.getUserId(), membership.getGroupId()], membership)
      : this._state.setIn([CustomMembershipService._UserIdMap, membership.getUserId()], new Map({[membership.getGroupId()]: membership}))
    newState = newState.hasIn([CustomMembershipService._GroupIdMap, membership.getGroupId()])
      ? this._state.setIn([CustomMembershipService._GroupIdMap, membership.getGroupId(), membership.getUserId()], membership)
      : this._state.setIn([CustomMembershipService._GroupIdMap, membership.getGroupId()], new Map({[membership.getUserId()]: membership}))
    return this.setState(newState)
  }

  getInitialState () {
    let initialState = super.getInitialState()
    initialState = initialState.set(CustomMembershipService._UserIdMap, Map({}))
                               .set(CustomMembershipService._GroupIdMap, Map({}))
    return initialState
  }

  deleteMembership (membership) {
    let newState = this._state.deleteIn([CustomMembershipService._UserIdMap, membership.getUserId(), membership.getGroupId()])
    newState = newState.deleteIn([CustomMembershipService._UserIdMap, membership.getGroupId(), membership.getUserId()])
    return this.setState(newState)
  }

  getMember (userId, groupId) {
    return this._state.getIn([CustomMembershipService._UserIdMap, userId, groupId])
  }

  getMembersForGroup(groupId) {
    return this._state.getIn([CustomMembershipService._GroupIdMap, groupId])
  }

  getMembersForUser(userId) {
    return this._state.getIn([CustomMembershipService._UserIdMap, userId])
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
    if (action.verb === this.config.verbs.HYDRATE && action.status === status.SUCCESS) {
      const membershipList = action.receivedData['Memberships']
      for (let i = 0, iLen = membershipList.length; i < iLen; i++) {
        let membership = new Membership(membershipList[i])
        state = state.hasIn([CustomMembershipService._UserIdMap, membership.getUserId()])
          ? state.setIn([CustomMembershipService._UserIdMap, membership.getUserId(), membership.getGroupId()], membership)
          : state.setIn([CustomMembershipService._UserIdMap, membership.getUserId()], new Map({[membership.getGroupId()]: membership}))
        state = state.hasIn([CustomMembershipService._GroupIdMap, membership.getGroupId()])
          ? state.setIn([CustomMembershipService._GroupIdMap, membership.getGroupId(), membership.getUserId()], membership)
          : state.setIn([CustomMembershipService._GroupIdMap, membership.getGroupId()], new Map({[membership.getUserId()]: membership}))
        state = state.setIn([CustomMembershipService._ObjectMap, membership.getId()], membership)
      }
    } else if (action.verb === this.config.verbs.SAVE_NEW &&
               action.status === status.SUCCESS && 
               action.rimObj && action.rimObj instanceof Membership) {
      state = state.hasIn([CustomMembershipService._UserIdMap, action.rimObj.getUserId()])
        ? state.setIn([CustomMembershipService._UserIdMap, action.rimObj.getUserId(), action.rimObj.getGroupId()], action.rimObj)
        : state.setIn([CustomMembershipService._UserIdMap, action.rimObj.getUserId()], new Map({[action.rimObj.getGroupId()]: action.rimObj}))
      state = state.hasIn([CustomMembershipService._GroupIdMap, action.rimObj.getGroupId()])
        ? state.setIn([CustomMembershipService._GroupIdMap, action.rimObj.getGroupId(), action.rimObj.getUserId()], action.rimObj)
        : state.setIn([CustomMembershipService._GroupIdMap, action.rimObj.getGroupId()], new Map({[action.rimObj.getUserId()]: action.rimObj}))
      state = state.setIn([CustomMembershipService._ObjectMap, action.rimObj.getId()], action.rimObj)
    } else if (action.verb === this.config.verbs.SAVE_NEW &&
               action.status === status.SUCCESS &&
               action.rimObj && action.rimObj instanceof Group) {
      // This is a special case where we will assign the logged in user as
      // a group owner for the group just created; the server-side API does the
      // same thing
      let membership = new Membership(action.receivedData['membership'])
      state = state.hasIn([CustomMembershipService._UserIdMap, membership.getUserId()])
        ? state.setIn([CustomMembershipService._UserIdMap, membership.getUserId(), membership.getGroupId()], membership)
        : state.setIn([CustomMembershipService._UserIdMap, membership.getUserId()], new Map({[membership.getGroupId()]: membership}))
      state = state.hasIn([CustomMembershipService._GroupIdMap, membership.getGroupId()])
        ? state.setIn([CustomMembershipService._GroupIdMap, membership.getGroupId(), membership.getUserId()], membership)
        : state.setIn([CustomMembershipService._GroupIdMap, membership.getGroupId()], new Map({[membership.getUserId()]: membership}))
      state = state.setIn([CustomMembershipService._ObjectMap, membership.getId()], membership)
    } else if (action.verb === this.config.verbs.DELETE &&
               action.status === status.SUCCESS &&
               action.rimObj && action.rimObj instanceof Membership) {
      // Need to remove the membership object from lookup tables
      state = super.reducer(state, action)
      state = state.deleteIn([CustomMembershipService._UserIdMap, action.rimObj.getUserId(), action.rimObj.getGroupId()])
      state = state.deleteIn([CustomMembershipService._GroupIdMap, action.rimObj.getGroupId(), action.rimObj.getUserId()])
    } else {
      // If we haven't handled the event, let the base handler deal with it
      state = super.reducer(state, action)
      if (action.rimObj && action.rimObj instanceof Membership) {
        const membership = state.getIn([CustomMembershipService._ObjectMap, action.rimObj.getId()])
        state = state.hasIn([CustomMembershipService._UserIdMap, membership.getUserId()])
          ? state.setIn([CustomMembershipService._UserIdMap, membership.getUserId(), membership.getGroupId()], membership)
          : state.setIn([CustomMembershipService._UserIdMap, membership.getUserId()], new Map({[membership.getGroupId()]: membership}))
        state = state.hasIn([CustomMembershipService._GroupIdMap, membership.getGroupId()])
          ? state.setIn([CustomMembershipService._GroupIdMap, membership.getGroupId(), membership.getUserId()], membership)
          : state.setIn([CustomMembershipService._GroupIdMap, membership.getGroupId()], new Map({[membership.getUserId()]: membership}))
      }
      return this.setState(state)
    }
    return this.setState(state)
  }
}