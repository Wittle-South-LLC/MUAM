/* Group.js - State class for Group model objects */
import OrimGroup from './orim/OrimGroup'

export default class Group extends OrimGroup {
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)
  }
}
