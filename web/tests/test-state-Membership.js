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

const TEST_ID = 
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
  it ('getGroupId() returns Membership._GroupIdKey', () => {
    chai.expect(testObj.getGroupId()).to.equal('b5665877-f9ee-4074-a38b-39219cde6b4d')
  })
  it ('getUserId() returns Membership._UserIdKey', () => {
    chai.expect(testObj.getUserId()).to.equal('b5665877-f9ee-4074-a38b-39219cde6b67')
  })
  it ('getIsOwner() returns Membership._IsOwnerKey', () => {
    chai.expect(testObj.getIsOwner()).to.equal(null)
  })
  it ('getIsAdmin() returns Membership._IsAdminKey', () => {
    chai.expect(testObj.getIsAdmin()).to.equal(null)
  })
  // Test validators - valid data
  it ('isGroupIdValid() returns true for valid GroupId', () => {
    chai.expect(testObj.isGroupIdValid()).to.equal(true)
  })
  it ('isUserIdValid() returns true for valid UserId', () => {
    chai.expect(testObj.isUserIdValid()).to.equal(true)
  })
  it ('isIsOwnerValid() returns true for valid IsOwner', () => {
    chai.expect(testObj.isIsOwnerValid()).to.equal(true)
  })
  it ('isIsAdminValid() returns true for valid IsAdmin', () => {
    chai.expect(testObj.isIsAdminValid()).to.equal(true)
  })
  // Test validators - invalid data
  it ('isGroupIdValid() returns false for invalid GroupId', () => {
    const invalidObj = testObj.updateField(TCLASS._GroupIdKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isGroupIdValid()).to.equal(false)
  })
  it ('isUserIdValid() returns false for invalid UserId', () => {
    const invalidObj = testObj.updateField(TCLASS._UserIdKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isUserIdValid()).to.equal(false)
  })
  it ('isIsOwnerValid() returns false for invalid IsOwner', () => {
    const invalidObj = testObj.updateField(TCLASS._IsOwnerKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isIsOwnerValid()).to.equal(false)
  })
  it ('isIsAdminValid() returns false for invalid IsAdmin', () => {
    const invalidObj = testObj.updateField(TCLASS._IsAdminKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isIsAdminValid()).to.equal(false)
  })
  // Test get create payload
  it ('getCreatePayload() returns correct payload', () => {
    chai.expect(testObj.getCreatePayload()).to.eql({"group_id":"b5665877-f9ee-4074-a38b-39219cde6b4d","user_id":"b5665877-f9ee-4074-a38b-39219cde6b67","is_owner":null,"is_admin":null})
  })
  // Test get update payload
  it ('getUpdatePayload() returns correct payload', () => {
    chai.expect(testObj.getUpdatePayload()).to.eql({"group_id":"b5665877-f9ee-4074-a38b-39219cde6b4d","user_id":"b5665877-f9ee-4074-a38b-39219cde6b67","is_owner":null,"is_admin":null})
  })
})
