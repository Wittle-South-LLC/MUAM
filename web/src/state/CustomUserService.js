/* UserService.js - Customized service for User objects */
import { callAPI, BaseRIMService } from 'redux-immutable-model'
import User from './User'

export default class CustomUserService extends BaseRIMService {
  constructor(config) {
    super(User, config)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  reducer(state, action) {
    console.log('CustomUserService.reducer this = ', this)
    return super.reducer(state, action)
  }

  // Add action to perform login
  login (username, password) {
    const myUser = new User({username: username, password: password}, false, false, true)
    console.log('myUser = ', myUser)
    this.setById(myUser)
    console.log('myUser id = ', myUser.getId())
    if (this.getById(myUser.getId())) {
      console.log('myUser IS in the service')
    } else {
      console.log('myUser is NOT in the service')
    }
    console.log('Passing this: ', this)
    return callAPI(this, this.config.verbs.LOGIN, 'POST', myUser)
  }

  // Add action to perform logout
  logout (user) {
    return callAPI(this, this.config.verbs.LOGOUT, 'POST', user)
  }
}