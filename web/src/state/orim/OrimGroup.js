/* OrimGroup.js - generated state object for Group model objects */
/* DO NOT EDIT THIS GENERATED FILE - Edit the subclass state file instead! */

import { Map } from 'immutable'
import { defaultVerbs, SimpleRIMObject } from 'redux-immutable-model'

// Define any constants required for pattern validations

export default class OrimGroup extends SimpleRIMObject {

  // Define constants that correspond to field names in API data
  static _DescriptionKey = 'description'
  static _RecordCreatedKey = 'record_created'
  static _RecordUpdatedKey = 'record_updated'
  static _SourceKey = 'source'
  static _GidKey = 'gid'
  static _IdentityKey = 'group_id'
  static _NameKey = 'name'

  static _apiPrefix = ''

  constructor (createFrom, dirtyVal, fetchingVal, newVal) {
    super(createFrom, dirtyVal, fetchingVal, newVal)

    if (!createFrom) {
      // No param object and no data - create empty initialized object
      this._data = Map({              [OrimGroup._DescriptionKey]: '',
             [OrimGroup._RecordCreatedKey]: new Date(0),
             [OrimGroup._RecordUpdatedKey]: new Date(0),
             [OrimGroup._SourceKey]: '',
             [OrimGroup._GidKey]: undefined,
[OrimGroup._IdentityKey]: OrimGroup._NewID,
             [OrimGroup._NameKey]: ''})
    } else {
      // This is where we do any transformations that are needed (e.g. dates)
      this._data = this._data.set(OrimGroup._RecordCreatedKey, new Date(createFrom[OrimGroup._RecordCreatedKey]))
      this._data = this._data.set(OrimGroup._RecordUpdatedKey, new Date(createFrom[OrimGroup._RecordUpdatedKey]))
    }
  }

  // Getters for fields
  getDescription () { return this._data.get(OrimGroup._DescriptionKey) }
  getRecordCreated () { return this._data.get(OrimGroup._RecordCreatedKey) }
  getRecordCreatedString () { return this._data.get(OrimGroup._RecordCreatedKey).toLocaleString() }
  getRecordUpdated () { return this._data.get(OrimGroup._RecordUpdatedKey) }
  getRecordUpdatedString () { return this._data.get(OrimGroup._RecordUpdatedKey).toLocaleString() }
  getSource () { return this._data.get(OrimGroup._SourceKey) }
  getGid () { return this._data.get(OrimGroup._GidKey) }
  getIdentity () { return this._data.get(OrimGroup._IdentityKey) }
  getGroupId () { return this._data.get(OrimGroup._IdentityKey) }
  getName () { return this._data.get(OrimGroup._NameKey) }

  // Validators for fields
  isDescriptionValid () { return this.getDescription() == null || 
          (this.getDescription().length >= 20 &&
          this.getDescription().length <= 3000) }
  isNameValid () { return this.getName() !== undefined &&
            this.getName().length >= 4 &&
          this.getName().length <= 80 }

  getFetchPayload (verb) {
    const payload = {
        [OrimGroup._DescriptionKey]: this.getDescription() ? this.getDescription() : null,
        [OrimGroup._GidKey]: this.getGid() ? parseInt(this.getGid()) : null,
        [OrimGroup._NameKey]: this.getName()
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
    if (!this.isDescriptionValid()) { result = false }
    if (!this.isNameValid()) { result = false }
    return result
  }
}
