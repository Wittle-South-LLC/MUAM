/* test-state-Membership.js - Tests Membership state */
import { describe, it, beforeEach } from 'mocha'
import chai from 'chai'
// import nock from 'nock'
// import { isd } from './TestUtils'
import Membership from '../src/state/Membership'
import { MembershipService } from '../src/state/OrimServices'
// import baseApp from '../src/state/baseApp'
import { defaultVerbs } from 'redux-immutable-model'
import { defaultState } from './TestData'
// import { testCreateNew, testEditField, testLogin, testSaveNew,
//          testSaveUpdate, testSaveDelete } from './ActionTests'

const TEST_ID = 'b5665877-f9ee-4074-a38b-39219cde6b4d/b5665877-f9ee-4074-a38b-39219cde6b67'
const TCLASS = Membership
const TSERVICE = MembershipService

describe('Membership: testing RimObject actions', () => {
  beforeEach(() => {
    TSERVICE.setState(defaultState.get(TSERVICE.getStatePath()))
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
  it ('getIsAdmin() returns Membership._IsAdminKey', () => {
    chai.expect(testObj.getIsAdmin()).to.equal(null)
  })
  it ('getIsOwner() returns Membership._IsOwnerKey', () => {
    chai.expect(testObj.getIsOwner()).to.equal(null)
  })
  // Test validators - valid data
  it ('isLeftIdentityValid() returns true for valid LeftIdentity', () => {
    chai.expect(testObj.isLeftIdentityValid()).to.equal(true)
  })
  it ('isIsAdminValid() returns true for valid IsAdmin', () => {
    chai.expect(testObj.isIsAdminValid()).to.equal(true)
  })
  it ('isIsOwnerValid() returns true for valid IsOwner', () => {
    chai.expect(testObj.isIsOwnerValid()).to.equal(true)
  })
  it ('isRightIdentityValid() returns true for valid RightIdentity', () => {
    chai.expect(testObj.isRightIdentityValid()).to.equal(true)
  })
  // Test validators - invalid data
  it ('isLeftIdentityValid() returns false for invalid LeftIdentity', () => {
    const invalidObj = testObj.updateField(TCLASS._LeftIdentityKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isLeftIdentityValid()).to.equal(false)
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
  it ('isRightIdentityValid() returns false for invalid RightIdentity', () => {
    const invalidObj = testObj.updateField(TCLASS._RightIdentityKey, '')
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isRightIdentityValid()).to.equal(false)
  })
  // Test get create payload
  it ('getFetchPayload(SAVE_NEW) returns correct payload', () => {
    chai.expect(testObj.getFetchPayload(defaultVerbs.SAVE_NEW)).to.eql({"group_id":"b5665877-f9ee-4074-a38b-39219cde6b4d","is_admin":null,"is_owner":null,"user_id":"b5665877-f9ee-4074-a38b-39219cde6b67"})
  })
  // Test get update payload
  it ('getFetchPayload(SAVE_UPDATE) returns correct payload', () => {
    chai.expect(testObj.getFetchPayload(defaultVerbs.SAVE_UPDATE)).to.eql({"group_id":"b5665877-f9ee-4074-a38b-39219cde6b4d","is_admin":null,"is_owner":null,"user_id":"b5665877-f9ee-4074-a38b-39219cde6b67"})
  })
})
