/* UserService.js - Customized service for User objects */
import { callAPI, BaseRIMService } from 'redux-immutable-model'
import User from './User'
import { defineMessages } from 'react-intl'

export default class CustomUserService extends BaseRIMService {
  constructor(config) {
    super(User, config)

    // Method bindings
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)

    // Internationalization Messages
    this.msgs = defineMessages({
      usernameLabel: { id: 'User.usernameLabel', defaultMessage: 'Username' },
      usernamePlaceholder: { id: 'User.usernamePlaceholder', defaultMessage: 'Username...' },
      passwordLabel: { id: 'User.passwordLabel', defaultMessage: 'Password' },
      passwordPlaceholder: { id: 'User.passwordPlaceholder', defaultMessage: 'Password...' }
    })
  }

  reducer(state, action) {
    return super.reducer(state, action)
  }

  // Add action to perform login
  login (username, password) {
    const myUser = new User({username: username, password: password}, false, false, true)
    this.setById(myUser)
    return callAPI(this, this.config.verbs.LOGIN, 'POST', myUser)
  }

  // Add action to perform logout
  logout (user) {
    return callAPI(this, this.config.verbs.LOGOUT, 'POST', user)
  }
}