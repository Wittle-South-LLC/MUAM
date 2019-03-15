/* CustomMembershipService.js - Customized service for User objects */
import { Map } from 'immutable'
import { BaseRIMService, status } from 'redux-immutable-model'
import Membership from './Membership'

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
      }
    }
    return this.setState(state)
  }
}