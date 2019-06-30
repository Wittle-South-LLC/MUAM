/* CustomUserService.js - Customized service for User objects */
import { callAPI, SimpleObjectService, status } from 'redux-immutable-model'
import User from './User'

export default class CustomUserService extends SimpleObjectService {
  constructor(config) {
    super(User, config)

    // Method bindings
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
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

  reducer (state, action) {
    let newState = super.reducer(state, action)
    if (action.verb === this.config.verbs.LOGIN && action.status === status.SUCCESS) {
      newState = this.delete(action.rimObj)
    }
    return newState
  }
}
