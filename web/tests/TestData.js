import { Map } from 'immutable'
import { defaultVerbs, status } from 'redux-immutable-model'
import baseApp from '../src/state/baseApp'
import User from '../src/state/User';

export const defaultLoginData = {
  Groups: [{
    description: 'This is a really long description of a group',
    record_created: '1995-08-19T00:00:00.000Z',
    record_updated: '1995-08-19T00:00:00.001Z',
    source: 'LDAP',
    gid: 104,
    group_id: 'b5665877-f9ee-4074-a38b-39219cde6b4d',
    name: 'app-users'
  }],
  Memberships: [{
    group_id: 'b5665877-f9ee-4074-a38b-39219cde6b4d',
    is_admin: null,
    is_owner: null,
    user_id: 'b5665877-f9ee-4074-a38b-39219cde6b67'
  }],
  Users: [{
    user_id: 'b5665877-f9ee-4074-a38b-39219cde6b67',
    username: 'testing',
    create_groups: true,
    create_users: null,
    password: 'MyPassword.ResetMe',
    email: 'testing@wittlesouth.com',
    first_name: 'Tester',
    full_name: 'Tester, Unit X',
    grant_privs: null,
    last_name: 'Unit',
    phone: '+1 (919) 999-9999',
    record_created: '1995-08-19T00:00:00.002Z',
    record_updated: '1995-08-19T00:00:00.003Z',
    source: 'LDAP'
  }]
}

export const defaultState = baseApp(undefined, {
  type: 'async',
  verb: defaultVerbs.LOGIN,
  status: status.SUCCESS,
  receivedData: defaultLoginData,
  rimObj: new User()
})

export const resetState = () => baseApp(undefined, {
  type: 'async',
  verb: defaultVerbs.HYDRATE,
  status: status.SUCCESS,
  receivedData: defaultLoginData
})
