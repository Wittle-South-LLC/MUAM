/* Membership.js - State class for Membership model objects */
import OrimMembership from './orim/OrimMembership'

export default class Membership extends OrimMembership {
  constructor(createFrom, dirtyVal = false, fetchingVal = false, newVal = false) {
    super (createFrom, dirtyVal, fetchingVal, newVal)
  }
}
