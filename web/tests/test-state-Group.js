/* test-state-Group.js - Tests Group state */
import { describe, it, beforeEach } from 'mocha'
import chai from 'chai'
// import nock from 'nock'
// import { isd } from './TestUtils'
import Group from '../src/state/Group'
import { GroupService } from '../src/state/OrimServices'
// import baseApp from '../src/state/baseApp'
import { defaultVerbs } from 'redux-immutable-model'
import { defaultState } from './TestData'
// import { testCreateNew, testEditField, testLogin, testSaveNew,
//          testSaveUpdate, testSaveDelete } from './ActionTests'

const TEST_ID = 'b5665877-f9ee-4074-a38b-39219cde6b4d'
const TCLASS = Group
const TSERVICE = GroupService

describe('Group: testing RimObject actions', () => {
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
  it ('getDescription() returns Group._DescriptionKey', () => {
    chai.expect(testObj.getDescription()).to.equal('This is a really long description of a group')
  })
  it ('getRecordCreated() returns Group._RecordCreatedKey', () => {
    chai.expect(testObj.getRecordCreated().toJSON()).to.equal('1995-08-19T00:00:00.000Z')
  })
  it ('getRecordCreatedString() returns Group._RecordCreatedKey as LocaleString', () => {
    chai.expect(testObj.getRecordCreatedString()).to.equal(new Date('1995-08-19T00:00:00.000Z').toLocaleString())
  })
  it ('getRecordUpdated() returns Group._RecordUpdatedKey', () => {
    chai.expect(testObj.getRecordUpdated().toJSON()).to.equal('1995-08-19T00:00:00.001Z')
  })
  it ('getRecordUpdatedString() returns Group._RecordUpdatedKey as LocaleString', () => {
    chai.expect(testObj.getRecordUpdatedString()).to.equal(new Date('1995-08-19T00:00:00.001Z').toLocaleString())
  })
  it ('getSource() returns Group._SourceKey', () => {
    chai.expect(testObj.getSource()).to.equal('LDAP')
  })
  it ('getGid() returns Group._GidKey', () => {
    chai.expect(testObj.getGid()).to.equal(104)
  })
  it ('getIdentity() returns Group._IdentityKey', () => {
    chai.expect(testObj.getIdentity()).to.equal('b5665877-f9ee-4074-a38b-39219cde6b4d')
  })
  it ('getName() returns Group._NameKey', () => {
    chai.expect(testObj.getName()).to.equal('app-users')
  })
  // Test validators - valid data
  it ('isDescriptionValid() returns true for valid Description', () => {
    chai.expect(testObj.isDescriptionValid()).to.equal(true)
  })
  it ('isNameValid() returns true for valid Name', () => {
    chai.expect(testObj.isNameValid()).to.equal(true)
  })
  // Test validators - invalid data
  it ('isDescriptionValid() returns false for invalid Description', () => {
    const invalidObj = testObj.updateField(TCLASS._DescriptionKey, 'X')
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isDescriptionValid()).to.equal(false)
  })
  it ('isNameValid() returns false for invalid Name', () => {
    const invalidObj = testObj.updateField(TCLASS._NameKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isNameValid()).to.equal(false)
  })
  // Test get create payload
  it ('getFetchPayload(SAVE_NEW) returns correct payload', () => {
    chai.expect(testObj.getFetchPayload(defaultVerbs.SAVE_NEW)).to.eql({"description":"This is a really long description of a group","gid":104,"name":"app-users"})
  })
  // Test get update payload
  it ('getFetchPayload(SAVE_UPDATE) returns correct payload', () => {
    chai.expect(testObj.getFetchPayload(defaultVerbs.SAVE_UPDATE)).to.eql({"description":"This is a really long description of a group","gid":104,"name":"app-users"})
  })
})
