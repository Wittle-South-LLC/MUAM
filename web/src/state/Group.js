/* Group.js - State class for Group model objects */
import OrimGroup from './orim/OrimGroup'
import { defineMessages } from 'react-intl'

export default class Group extends OrimGroup {
  static className = 'Group'
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)

    this.getFetchPayload = this.getFetchPayload.bind(this)
  }

  isGidValid () {
    return !isNaN(this.getGid())
  }

  // Internationalization Messages
  static msgs = defineMessages({
    descriptionLabel: { id: 'Group.descriptionLabel', defaultMessage: 'Description' },
    descriptionPlaceholder: { id: 'Group.descriptionPlaceholder', defaultMessage: 'Group description...' },
    descriptionInvalid: { id: 'Group.descriptionInvalid', defaultMessage: 'Description is not valid' },
    nameLabel: { id: 'Group.nameLabel', defaultMessage: 'Name' },
    namePlaceholder: { id: 'Group.namePlaceholder', defaultMessage: 'Group name...' },
    nameInvalid: { id: 'Group.nameInvalid', defaultMessage: 'Name is invalid' },
    gidLabel: { id: 'Group.gidLabel', defaultMessage: 'GID' },
    gidPlaceholder: { id: 'Group.gidPlaceholder', defaultMessage: 'gid...' },
    gidInvalid: { id: 'Group.gidInvalid', defaultMessage: 'Group ID is not valid' }
  })
}
