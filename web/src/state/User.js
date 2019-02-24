/* User.js - State class for User model objects */
import OrimUser from './orim/OrimUser'

export default class User extends OrimUser {
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)
  }
}
