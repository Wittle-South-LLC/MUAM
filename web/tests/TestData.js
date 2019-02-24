import { Map } from 'immutable'
import { defaultVerbs, status } from 'redux-immutable-model'
import baseApp from '../src/state/baseApp'

export const defaultLoginData = {
  Groups: [{
    users: null,
    description: 'This is a really long description of a group',
    source: 'LDAP',
    record_created: '1995-08-19T00:00:00.000Z',
    record_updated: '1995-08-19T00:00:00.001Z',
    group_id: 'b5665877-f9ee-4074-a38b-39219cde6b4d',
    gid: 104,
    name: 'app-users'
  }],
  Memberships: [{
    group_id: 'b5665877-f9ee-4074-a38b-39219cde6b4d',
    user_id: 'b5665877-f9ee-4074-a38b-39219cde6b67',
    is_owner: null,
    is_admin: null
  }],
  Users: [{
    password: 'testing123',
    groups: null,
    user_id: 'b5665877-f9ee-4074-a38b-39219cde6b67',
    username: 'testing',
    email: 'testing@wittlesouth.com',
    first_name: 'Tester',
    full_name: 'Tester, Unit X',
    last_name: 'Unit',
    phone: '+1 (919) 999-9999',
    source: 'LDAP',
    create_users: null,
    create_groups: true,
    grant_privs: null,
    record_created: '1995-08-19T00:00:00.002Z',
    record_updated: '1995-08-19T00:00:00.003Z'
  }]
}

export const defaultState = baseApp(undefined, {
  type: 'async',
  verb: defaultVerbs.LOGIN,
  status: status.SUCCESS,
  receivedData: defaultLoginData
})

export const resetState = () => baseApp(undefined, {
  type: 'async',
  verb: defaultVerbs.HYDRATE,
  status: status.SUCCESS,
  receivedData: defaultLoginData
})
