/* Membership.js - State class for Membership model objects */
import OrimMembership from './orim/OrimMembership'
import { defineMessages } from 'react-intl'

export default class Membership extends OrimMembership {
  static className = 'Membership'
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)
  }

  getId() {
    return this.getGroupId() + '/' + this.getUserId()
  }

  // Internationalization Messages
  static msgs = defineMessages({
    isAdminLabel: { id: 'Membership.isAdminLabel', defaultMessage: 'Admin' },
    isOwnerLabel: { id: 'Membership.isOwnerLabel', defaultMessage: 'Owner' }
  })
}
