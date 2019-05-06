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
      case defaultVerbs.LOGOUT:
        return {}
      default:
        return super.getFetchPayload(verb)
    }
  }

  static msgs = defineMessages({
    usernameLabel: { id: 'User.usernameLabel', defaultMessage: 'Username' },
    usernamePlaceholder: { id: 'User.usernamePlaceholder', defaultMessage: 'Username...' },
    usernameInvalid: { id: 'User.invalidUsername', defaultMessage: 'Username must be at least 4 characters' },
    passwordLabel: { id: 'User.passwordLabel', defaultMessage: 'Password' },
    passwordPlaceholder: { id: 'User.passwordPlaceholder', defaultMessage: 'Password...' },
    passwordInvalid: { id: 'User.invalidPassword', defaultMessage: 'Password must be 8-32 characters' },
    firstNameLabel: { id: 'User.firstNameLabel', defaultMessage: 'First Name' },
    firstNamePlaceholder: { id: 'User.firstNamePlaceholder', defaultMessage: 'First name...' },
    firstNameInvalid: { id: 'User.invalidFirstName', defaultMessage: 'First name must be 2-80 characters' },
    lastNameLabel: { id: 'User.lastNameLabel', defaultMessage: 'Last Name' },
    lastNamePlaceholder: { id: 'User.lastNamePlaceholder', defaultMessage: 'Last name...' },
    lastNameInvalid: { id: 'User.invalidLastName', defaultMessage: 'Last name must be 2-80 characters' },
    fullNameLabel: { id: 'User.fullNameLabel', defaultMessage: 'Full Name' },
    fullNamePlaceholder: { id: 'User.fullNamePlaceholder', defaultMessage: 'Full name...' },
    fullNameInvalid: { id: 'User.fullNameInvalid', defaultMessage: 'Full name must be 5-120 characters' },
    emailLabel: { id: 'User.emailLabel', defaultMessage: 'Email Address' },
    emailPlaceholder: { id: 'User.emailPlaceholder', defaultMessage: 'Email address... '},
    emailInvalid: { id: 'User.invalidEmail', defaultMessage: 'Email must be 4-80 chars and be a valid email address' },
    phoneLabel: { id: 'User.phoneLabel', defaultMessage: 'Phone' },
    phonePlaceholder: { id: 'User.phonePlaceholder', defaultMessage: 'Phone number...' },
    phoneInvalid: { id: 'User.phoneInvalid', defaultMessage: 'Phone number must be 10-20 characters and be valid' },
    createUsersLabel: { id: 'User.createUsersLabel', defaultMessage: 'Create Users' },
    createGroupsLabel: { id: 'User.createGroupsLabel', defaultMessage: 'Create Groups' },
    grantPrivsLabel: { id: 'User.grantPrivsLabel', defaultMessage: 'Grant Privileges' }
  })
}
