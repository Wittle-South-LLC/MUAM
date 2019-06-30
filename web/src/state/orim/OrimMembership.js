/* OrimMembership.js - generated state object for Membership model objects */
/* DO NOT EDIT THIS GENERATED FILE - Edit the subclass state file instead! */

import { Map } from 'immutable'
import { defaultVerbs, RelationshipRIMObject } from 'redux-immutable-model'

// Define any constants required for pattern validations

export default class OrimMembership extends RelationshipRIMObject {

  // Define constants that correspond to field names in API data
  static _LeftIdentityKey = 'group_id'
  static _IsAdminKey = 'is_admin'
  static _IsOwnerKey = 'is_owner'
  static _RightIdentityKey = 'user_id'

  static _apiPrefix = ''

  constructor (createFrom, dirtyVal, fetchingVal, newVal) {
    super(createFrom, dirtyVal, fetchingVal, newVal)

    if (!createFrom) {
      // No param object and no data - create empty initialized object
      this._data = Map({ [OrimMembership._IdentityKey]: OrimMembership._NewID,
             [OrimMembership._IsAdminKey]: undefined,
             [OrimMembership._IsOwnerKey]: undefined,
[OrimMembership._IdentityKey]: OrimMembership._NewID})
    } else {
      // This is where we do any transformations that are needed (e.g. dates)
    }
  }

  // Getters for fields
  getLeftIdentity () { return this._data.get(OrimMembership._LeftIdentityKey) }
  getGroupId () { return this._data.get(OrimMembership._LeftIdentityKey) }
  getIsAdmin () { return this._data.get(OrimMembership._IsAdminKey) }
  getIsOwner () { return this._data.get(OrimMembership._IsOwnerKey) }
  getRightIdentity () { return this._data.get(OrimMembership._RightIdentityKey) }
  getUserId () { return this._data.get(OrimMembership._RightIdentityKey) }

  // Validators for fields
  isLeftIdentityValid () { return this.getLeftIdentity() !== undefined &&
            this.getLeftIdentity().length >= 12 &&
          this.getLeftIdentity().length <= 40 }
  isIsAdminValid () { return this.getIsAdmin() !== undefined }
  isIsOwnerValid () { return this.getIsOwner() !== undefined }
  isRightIdentityValid () { return this.getRightIdentity() !== undefined &&
            this.getRightIdentity().length >= 12 &&
          this.getRightIdentity().length <= 40 }

  getFetchPayload (verb) {
    const payload = {
        [OrimMembership._LeftIdentityKey]: this.getLeftIdentity(),
        [OrimMembership._IsAdminKey]: this.getIsAdmin(),
        [OrimMembership._IsOwnerKey]: this.getIsOwner(),
        [OrimMembership._RightIdentityKey]: this.getRightIdentity()
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
    if (!this.isLeftIdentityValid()) { result = false }
    if (!this.isIsAdminValid()) { result = false }
    if (!this.isIsOwnerValid()) { result = false }
    if (!this.isRightIdentityValid()) { result = false }
    return result
  }
}
