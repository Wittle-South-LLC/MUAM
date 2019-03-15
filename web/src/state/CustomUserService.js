/* CustomUserService.js - Customized service for User objects */
import { callAPI, BaseRIMService, status } from 'redux-immutable-model'
import User from './User'

const VERB_NEW = 'NEW'
const VERB_CANCEL_NEW = 'CANCEL_NEW'

export default class CustomUserService extends BaseRIMService {
  constructor(config) {
    super(User, config)

    // Method bindings
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }
  reducer(state, action) {
    let newState = super.reducer(state, action)
    // If we've logged in successfully, the new user object we created with username/password
    // is no longer needed, so it should be deleted
    if (action.verb === this.config.verbs.LOGIN && action.status === status.SUCCESS) {
      newState = this.deleteId(User._NewID)
    } else if (action.verb === VERB_NEW) {
      newState = this.setById(new User())
    } else if (action.verb === VERB_CANCEL_NEW) {
      newState = this.deleteId(User._NewID)
    }
    return this.setState(newState)
  }

  // Add action to perform hydrate
  hydrate(user) {
    return callAPI(this, this.config.verbs.HYDRATE, 'GET', user)
  }

  // Synchronous action to cancel a create new
  cancelNew () {
    return { type: 'async', verb: VERB_CANCEL_NEW }
  }

  // Synchronous action to create a new user in state
  createNew (newPath = undefined) {
    return { type: 'async', verb: VERB_NEW, newPath }
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
