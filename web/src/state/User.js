/* User.js - State class for User model objects */
import OrimUser from './orim/OrimUser'
import { defaultVerbs } from 'redux-immutable-model'
import { defineMessages } from 'react-intl'

export default class User extends OrimUser {
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)
  }

  getFetchPayload (verb) {
    switch (verb) {
      case defaultVerbs.LOGIN:
        return { username: this.getUsername(), password: this.getPassword() }
      default:
        return super.getFetchPayload(verb)
    }
  }

  static msgs = defineMessages({
    usernameLabel: { id: 'User.usernameLabel', defaultMessage: 'Username' },
    usernamePlaceholder: { id: 'User.usernamePlaceholder', defaultMessage: 'Username...' },
    passwordLabel: { id: 'User.passwordLabel', defaultMessage: 'Password' },
    passwordPlaceholder: { id: 'User.passwordPlaceholder', defaultMessage: 'Password...' },
    firstNameLabel: { id: 'User.firstNameLabel', defaultMessage: 'First Name' },
    lastNameLabel: { id: 'User.lastNameLabel', defaultMessage: 'Last Name' }
  })
}
