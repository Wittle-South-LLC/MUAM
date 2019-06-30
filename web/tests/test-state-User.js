/* test-state-User.js - Tests User state */
import { describe, it, beforeEach } from 'mocha'
import chai from 'chai'
// import nock from 'nock'
// import { isd } from './TestUtils'
import User from '../src/state/User'
import { UserService } from '../src/state/OrimServices'
// import baseApp from '../src/state/baseApp'
import { defaultState } from './TestData'
// import { testCreateNew, testEditField, testLogin, testSaveNew,
//          testSaveUpdate, testSaveDelete } from './ActionTests'

const TEST_ID = 'b5665877-f9ee-4074-a38b-39219cde6b67'
const TCLASS = User
const TSERVICE = UserService

describe('User: testing RimObject actions', () => {
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
  it ('getIdentity() returns User._IdentityKey', () => {
    chai.expect(testObj.getIdentity()).to.equal('b5665877-f9ee-4074-a38b-39219cde6b67')
  })
  it ('getUsername() returns User._UsernameKey', () => {
    chai.expect(testObj.getUsername()).to.equal('testing')
  })
  it ('getCreateGroups() returns User._CreateGroupsKey', () => {
    chai.expect(testObj.getCreateGroups()).to.equal(true)
  })
  it ('getCreateUsers() returns User._CreateUsersKey', () => {
    chai.expect(testObj.getCreateUsers()).to.equal(null)
  })
  it ('getEmail() returns User._EmailKey', () => {
    chai.expect(testObj.getEmail()).to.equal('testing@wittlesouth.com')
  })
  it ('getFirstName() returns User._FirstNameKey', () => {
    chai.expect(testObj.getFirstName()).to.equal('Tester')
  })
  it ('getFullName() returns User._FullNameKey', () => {
    chai.expect(testObj.getFullName()).to.equal('Tester, Unit X')
  })
  it ('getGrantPrivs() returns User._GrantPrivsKey', () => {
    chai.expect(testObj.getGrantPrivs()).to.equal(null)
  })
  it ('getLastName() returns User._LastNameKey', () => {
    chai.expect(testObj.getLastName()).to.equal('Unit')
  })
  it ('getPassword() returns User._PasswordKey', () => {
    chai.expect(testObj.getPassword()).to.equal('MyPassword.ResetMe')
  })
  it ('getPhone() returns User._PhoneKey', () => {
    chai.expect(testObj.getPhone()).to.equal('+1 (919) 999-9999')
  })
  it ('getRecordCreated() returns User._RecordCreatedKey', () => {
    chai.expect(testObj.getRecordCreated().toJSON()).to.equal('1995-08-19T00:00:00.002Z')
  })
  it ('getRecordCreatedString() returns User._RecordCreatedKey as LocaleString', () => {
    chai.expect(testObj.getRecordCreatedString()).to.equal(new Date('1995-08-19T00:00:00.002Z').toLocaleString())
  })
  it ('getRecordUpdated() returns User._RecordUpdatedKey', () => {
    chai.expect(testObj.getRecordUpdated().toJSON()).to.equal('1995-08-19T00:00:00.003Z')
  })
  it ('getRecordUpdatedString() returns User._RecordUpdatedKey as LocaleString', () => {
    chai.expect(testObj.getRecordUpdatedString()).to.equal(new Date('1995-08-19T00:00:00.003Z').toLocaleString())
  })
  it ('getSource() returns User._SourceKey', () => {
    chai.expect(testObj.getSource()).to.equal('LDAP')
  })
  // Test validators - valid data
  it ('isUsernameValid() returns true for valid Username', () => {
    chai.expect(testObj.isUsernameValid()).to.equal(true)
  })
  it ('isCreateGroupsValid() returns true for valid CreateGroups', () => {
    chai.expect(testObj.isCreateGroupsValid()).to.equal(true)
  })
  it ('isCreateUsersValid() returns true for valid CreateUsers', () => {
    chai.expect(testObj.isCreateUsersValid()).to.equal(true)
  })
  it ('isEmailValid() returns true for valid Email', () => {
    chai.expect(testObj.isEmailValid()).to.equal(true)
  })
  it ('isFirstNameValid() returns true for valid FirstName', () => {
    chai.expect(testObj.isFirstNameValid()).to.equal(true)
  })
  it ('isFullNameValid() returns true for valid FullName', () => {
    chai.expect(testObj.isFullNameValid()).to.equal(true)
  })
  it ('isGrantPrivsValid() returns true for valid GrantPrivs', () => {
    chai.expect(testObj.isGrantPrivsValid()).to.equal(true)
  })
  it ('isLastNameValid() returns true for valid LastName', () => {
    chai.expect(testObj.isLastNameValid()).to.equal(true)
  })
  it ('isPasswordValid() returns true for valid Password', () => {
    chai.expect(testObj.isPasswordValid()).to.equal(true)
  })
  it ('isPhoneValid() returns true for valid Phone', () => {
    chai.expect(testObj.isPhoneValid()).to.equal(true)
  })
  // Test validators - invalid data
  it ('isUsernameValid() returns false for invalid Username', () => {
    const invalidObj = testObj.updateField(TCLASS._UsernameKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isUsernameValid()).to.equal(false)
  })
  it ('isCreateGroupsValid() returns false for invalid CreateGroups', () => {
    const invalidObj = testObj.updateField(TCLASS._CreateGroupsKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isCreateGroupsValid()).to.equal(false)
  })
  it ('isCreateUsersValid() returns false for invalid CreateUsers', () => {
    const invalidObj = testObj.updateField(TCLASS._CreateUsersKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isCreateUsersValid()).to.equal(false)
  })
  it ('isEmailValid() returns false for invalid Email', () => {
    const invalidObj = testObj.updateField(TCLASS._EmailKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isEmailValid()).to.equal(false)
  })
  it ('isFirstNameValid() returns false for invalid FirstName', () => {
    const invalidObj = testObj.updateField(TCLASS._FirstNameKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isFirstNameValid()).to.equal(false)
  })
  it ('isFullNameValid() returns false for invalid FullName', () => {
    const invalidObj = testObj.updateField(TCLASS._FullNameKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isFullNameValid()).to.equal(false)
  })
  it ('isGrantPrivsValid() returns false for invalid GrantPrivs', () => {
    const invalidObj = testObj.updateField(TCLASS._GrantPrivsKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isGrantPrivsValid()).to.equal(false)
  })
  it ('isLastNameValid() returns false for invalid LastName', () => {
    const invalidObj = testObj.updateField(TCLASS._LastNameKey, undefined)
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isLastNameValid()).to.equal(false)
  })
  it ('isPasswordValid() returns false for invalid Password', () => {
    const invalidObj = testObj.updateField(TCLASS._PasswordKey, 'X')
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isPasswordValid()).to.equal(false)
  })
  it ('isPhoneValid() returns false for invalid Phone', () => {
    const invalidObj = testObj.updateField(TCLASS._PhoneKey, 'X')
    chai.expect(invalidObj.isValid()).to.equal(false)
    chai.expect(invalidObj.isPhoneValid()).to.equal(false)
  })
  // Test get create payload
  it ('getCreatePayload() returns correct payload', () => {
    chai.expect(testObj.getCreatePayload()).to.eql({"username":"testing","create_groups":true,"create_users":null,"email":"testing@wittlesouth.com","first_name":"Tester","full_name":"Tester, Unit X","grant_privs":null,"last_name":"Unit","password":"MyPassword.ResetMe","phone":"+1 (919) 999-9999"})
  })
  // Test get update payload
  it ('getUpdatePayload() returns correct payload', () => {
    chai.expect(testObj.getUpdatePayload()).to.eql({"username":"testing","create_groups":true,"create_users":null,"email":"testing@wittlesouth.com","first_name":"Tester","full_name":"Tester, Unit X","grant_privs":null,"last_name":"Unit","password":"MyPassword.ResetMe","phone":"+1 (919) 999-9999"})
  })
})
