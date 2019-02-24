/* User.js - State class for User model objects */
import OrimUser from './orim/OrimUser'
import { defaultVerbs } from 'redux-immutable-model'

export default class User extends OrimUser {
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)
  }

  getFetchPayload (action) {
    switch (action.verb) {
      case defaultVerbs.LOGIN:
        return { username: this.getUsername(), password: this.getPassword() }
      case defaultVerbs.CREATE:
        return this.getCreatePayload()
      case defaultVerbs.UPDATE:
        return this.getUpdatePayload()
      default:
        return {}
    }
  }
}
