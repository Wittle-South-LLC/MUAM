/* OrimUser.js - generated state object for User model objects */
/* DO NOT EDIT THIS GENERATED FILE - Edit the subclass state file instead! */

import { Map } from 'immutable'
import { defaultVerbs, SimpleRIMObject } from 'redux-immutable-model'

// Define any constants required for pattern validations
const emailTest = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default class OrimUser extends SimpleRIMObject {

  // Define constants that correspond to field names in API data
  static _IdentityKey = 'user_id'
  static _UsernameKey = 'username'
  static _CreateGroupsKey = 'create_groups'
  static _CreateUsersKey = 'create_users'
  static _EmailKey = 'email'
  static _FirstNameKey = 'first_name'
  static _FullNameKey = 'full_name'
  static _GrantPrivsKey = 'grant_privs'
  static _LastNameKey = 'last_name'
  static _PasswordKey = 'password'
  static _PhoneKey = 'phone'
  static _RecordCreatedKey = 'record_created'
  static _RecordUpdatedKey = 'record_updated'
  static _SourceKey = 'source'

  static _apiPrefix = ''

  constructor (createFrom, dirtyVal, fetchingVal, newVal) {
    super(createFrom, dirtyVal, fetchingVal, newVal)

    if (!createFrom) {
      // No param object and no data - create empty initialized object
      this._data = Map({ [OrimUser._IdentityKey]: OrimUser._NewID,
             [OrimUser._UsernameKey]: '',
             [OrimUser._CreateGroupsKey]: false,
             [OrimUser._CreateUsersKey]: false,
             [OrimUser._EmailKey]: '',
             [OrimUser._FirstNameKey]: '',
             [OrimUser._FullNameKey]: '',
             [OrimUser._GrantPrivsKey]: false,
             [OrimUser._LastNameKey]: '',
             [OrimUser._PhoneKey]: '',
             [OrimUser._RecordCreatedKey]: new Date(0),
             [OrimUser._RecordUpdatedKey]: new Date(0),
             [OrimUser._SourceKey]: ''})
    } else {
      // This is where we do any transformations that are needed (e.g. dates)
      this._data = this._data.set(OrimUser._RecordCreatedKey, new Date(createFrom[OrimUser._RecordCreatedKey]))
      this._data = this._data.set(OrimUser._RecordUpdatedKey, new Date(createFrom[OrimUser._RecordUpdatedKey]))
    }
  }

  // Getters for fields
  getIdentity () { return this._data.get(OrimUser._IdentityKey) }
  getUserId () { return this._data.get(OrimUser._IdentityKey) }
  getUsername () { return this._data.get(OrimUser._UsernameKey) }
  getCreateGroups () { return this._data.get(OrimUser._CreateGroupsKey) }
  getCreateUsers () { return this._data.get(OrimUser._CreateUsersKey) }
  getEmail () { return this._data.get(OrimUser._EmailKey) }
  getFirstName () { return this._data.get(OrimUser._FirstNameKey) }
  getFullName () { return this._data.get(OrimUser._FullNameKey) }
  getGrantPrivs () { return this._data.get(OrimUser._GrantPrivsKey) }
  getLastName () { return this._data.get(OrimUser._LastNameKey) }
  getPassword () { return this._data.get(OrimUser._PasswordKey) }
  getPhone () { return this._data.get(OrimUser._PhoneKey) }
  getRecordCreated () { return this._data.get(OrimUser._RecordCreatedKey) }
  getRecordCreatedString () { return this._data.get(OrimUser._RecordCreatedKey).toLocaleString() }
  getRecordUpdated () { return this._data.get(OrimUser._RecordUpdatedKey) }
  getRecordUpdatedString () { return this._data.get(OrimUser._RecordUpdatedKey).toLocaleString() }
  getSource () { return this._data.get(OrimUser._SourceKey) }

  // Validators for fields
  isUsernameValid () { return this.getUsername() !== undefined &&
            this.getUsername().length >= 4 &&
          this.getUsername().length <= 32 }
  isCreateGroupsValid () { return this.getCreateGroups() !== undefined }
  isCreateUsersValid () { return this.getCreateUsers() !== undefined }
  isEmailValid () { return this.getEmail() !== undefined &&
            this.getEmail().length >= 4 &&
          this.getEmail().length <= 80 &&
          emailTest.test(this.getEmail()) }
  isFirstNameValid () { return this.getFirstName() !== undefined &&
            this.getFirstName().length >= 2 &&
          this.getFirstName().length <= 80 }
  isFullNameValid () { return this.getFullName() !== undefined &&
            this.getFullName().length >= 5 &&
          this.getFullName().length <= 120 }
  isGrantPrivsValid () { return this.getGrantPrivs() !== undefined }
  isLastNameValid () { return this.getLastName() !== undefined &&
            this.getLastName().length >= 2 &&
          this.getLastName().length <= 80 }
  isPasswordValid () { return this.getPassword() == null || 
          (this.getPassword().length >= 6 &&
          this.getPassword().length <= 60) }
  isPhoneValid () { return this.getPhone() == null || 
          (this.getPhone().length >= 10 &&
          this.getPhone().length <= 20) }

  getFetchPayload (verb) {
    const payload = {
        [OrimUser._UsernameKey]: this.getUsername(),
        [OrimUser._CreateGroupsKey]: this.getCreateGroups(),
        [OrimUser._CreateUsersKey]: this.getCreateUsers(),
        [OrimUser._EmailKey]: this.getEmail(),
        [OrimUser._FirstNameKey]: this.getFirstName(),
        [OrimUser._FullNameKey]: this.getFullName(),
        [OrimUser._GrantPrivsKey]: this.getGrantPrivs(),
        [OrimUser._LastNameKey]: this.getLastName(),
        [OrimUser._PasswordKey]: this.getPassword() ? this.getPassword() : null,
        [OrimUser._PhoneKey]: this.getPhone() ? this.getPhone() : null
    }
    if (verb === defaultVerbs.SAVE_UPDATE) {
      return payload
    } else if (verb === defaultVerbs.SAVE_NEW) {
      return payload
    }
    return {}
  }

  isValid () {
    let result = true
    if (!this.isUsernameValid()) { result = false }
    if (!this.isCreateGroupsValid()) { result = false }
    if (!this.isCreateUsersValid()) { result = false }
    if (!this.isEmailValid()) { result = false }
    if (!this.isFirstNameValid()) { result = false }
    if (!this.isFullNameValid()) { result = false }
    if (!this.isGrantPrivsValid()) { result = false }
    if (!this.isLastNameValid()) { result = false }
    if (!this.isPasswordValid()) { result = false }
    if (!this.isPhoneValid()) { result = false }
    return result
  }
}
