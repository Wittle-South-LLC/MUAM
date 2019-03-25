/* Group.js - State class for Group model objects */
import OrimGroup from './orim/OrimGroup'
import { defineMessages } from 'react-intl'

export default class Group extends OrimGroup {
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)

    this.getFetchPayload = this.getFetchPayload.bind(this)
  }

  // This should not be necessary in a subclass; it should be standard behavior
  getFetchPayload(verb) {
    if (verb === 'SAVE_UPDATE') {
      return this.getUpdatePayload()
    } else if (verb === 'CREATE') {
      return this.getCreatePayload()
    }
  }

  // Internationalization Messages
  static msgs = defineMessages({
    descriptionLabel: { id: 'Group.descriptionLabel', defaultMessage: 'Description' },
    descriptionPlaceholder: { id: 'Group.descriptionPlaceholder', defaultMessage: 'Group description...' },
    nameLabel: { id: 'Group.nameLabel', defaultMessage: 'Name' },
    namePlaceholder: { id: 'Group.namePlaceholder', defaultMessage: 'Group name...' },
    gidLabel: { id: 'Group.gidLabel', defaultMessage: 'GID' },
    gidPlaceholder: { id: 'Group.gidPlaceholder', defaultMessage: 'gid...' }
  })
}
