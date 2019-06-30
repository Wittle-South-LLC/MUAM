/* test-state-Membership.js - Tests Membership state */
import { describe, it, beforeEach } from 'mocha'
import chai from 'chai'
// import nock from 'nock'
// import { isd } from './TestUtils'
import Membership from '../src/state/Membership'
import { MembershipService } from '../src/state/OrimServices'
// import baseApp from '../src/state/baseApp'
import { defaultState } from './TestData'
// import { testCreateNew, testEditField, testLogin, testSaveNew,
//          testSaveUpdate, testSaveDelete } from './ActionTests'

const TEST_ID = 'b5665877-f9ee-4074-a38b-39219cde6b4d'
const TCLASS = Membership
const TSERVICE = MembershipService

describe('Membership: testing RimObject actions', () => {
  beforeEach(() => {
    TSERVICE.setState(defaultState.get(TSERVICE.getStatePath()))
  })
  it('new returns an empty object', () => {
    let myObj = new TCLASS()
    chai.expect(myObj.getName()).to.equal('')
  })
  it('can create an object that is already dirty', () => {
    let myObj = new TCLASS({}, true)
    chai.expect(myObj.isDirty()).to.be.true
  })
  it('can create an object that is already fetching', () => {
    let myObj = new TCLASS({}, false, true)
    chai.expect(myObj.isFetching()).to.be.true
  })
  it('can create an object that is already new', () => {
    let myObj = new TCLASS({}, false, false, true)
    chai.expect(myObj.isNew()).to.be.true
  })
  let testObj = TSERVICE.getById(TEST_ID)
  // Basic tests of accessor methods
  it('getId() returns ID', () => {
    chai.expect(testObj.getId()).to.equal(TEST_ID)
  })
  it ('getIdentity() returns Membership._IdentityKey', () => {
    chai.expect(testObj.getIdentity()).to.equal('b5665877-f9ee-4074-a38b-39219cde6b4d')
  })
  it ('getIsAdmin() returns Membership._IsAdminKey', () => {
    chai.expect(testObj.getIsAdmin()).to.equal(null)
  })
  it ('getIsOwner() returns Membership._IsOwnerKey', () => {
    chai.expect(testObj.getIsOwner()).to.equal(null)
  })
  it ('getIdentity() returns Membership._IdentityKey', () => {
    chai.expect(testObj.getIdentity()).to.equal('b5665877-f9ee-4074-a38b-39219cde6b67')
  })
  // Test validators - valid data
  it ('isIdentityValid() returns true for valid Identity', () => {
    chai.expect(testObj.isIdentityValid()).to.equal(true)
  })
  it ('isIsAdminValid() returns true for valid IsAdmin', () => {
    chai.expect(testObj.isIsAdminValid()).to.equal(true)
  })
  it ('isIsOwnerValid() returns true for valid IsOwner', () => {
    chai.expect(testObj.isIsOwnerValid()).to.equal(true)
  })
  it ('isIdentityValid() returns true for valid Identity', () => {
    chai.expect(testObj.isIdentityValid()).to.equal(true)
  })
  // Test validators - invalid data
  it ('isIdentityValid() returns false for invalid Identity', () => {
    const invalidObj = testObj.updateField(TCLASS._IdentityKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isIdentityValid()).to.equal(false)
  })
  it ('isIsAdminValid() returns false for invalid IsAdmin', () => {
    const invalidObj = testObj.updateField(TCLASS._IsAdminKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isIsAdminValid()).to.equal(false)
  })
  it ('isIsOwnerValid() returns false for invalid IsOwner', () => {
    const invalidObj = testObj.updateField(TCLASS._IsOwnerKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isIsOwnerValid()).to.equal(false)
  })
  it ('isIdentityValid() returns false for invalid Identity', () => {
    const invalidObj = testObj.updateField(TCLASS._IdentityKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isIdentityValid()).to.equal(false)
  })
  // Test get create payload
  it ('getCreatePayload() returns correct payload', () => {
    chai.expect(testObj.getCreatePayload()).to.eql({"group_id":"b5665877-f9ee-4074-a38b-39219cde6b4d","is_admin":null,"is_owner":null,"user_id":"b5665877-f9ee-4074-a38b-39219cde6b67"})
  })
  // Test get update payload
  it ('getUpdatePayload() returns correct payload', () => {
    chai.expect(testObj.getUpdatePayload()).to.eql({"group_id":"b5665877-f9ee-4074-a38b-39219cde6b4d","is_admin":null,"is_owner":null,"user_id":"b5665877-f9ee-4074-a38b-39219cde6b67"})
  })
})
