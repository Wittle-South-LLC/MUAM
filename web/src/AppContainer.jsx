import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap';
import { intlShape, defineMessages } from 'react-intl'
import { UserService } from './state/OrimServices'
import { loggedInUser, needsHydrate, setMessage } from './state/clientState'
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import UserAdmin from './admin/UserAdmin'
import GroupAdmin from './admin/GroupAdmin'
import ShowState from './utils/ShowState'
import Home from './Home'

export default class AppContainer extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.listenStore = this.listenStore.bind(this)
    this.init = this.init.bind(this)
    this.logout = this.logout.bind(this)
    this.getRoute = this.getRoute.bind(this)
    this.toggle = this.toggle.bind(this)

    // Will be set when app is subscribed to state changes
    this.unsubscribe = undefined

    this.componentText = defineMessages({
      enLocaleDesc: { id: 'AppContainer.en_locale_description', defaultMessage: 'English' },
      frLocaleDesc: { id: 'AppContainer.fr_locale_description', defaultMessage: 'French' },
      brandTitle: { id: 'AppContainer.brandTitle', defaultMessage: 'MUAM' },
      groupsLink: { id: 'AppContainer.groupsLink', defaultMessage: 'Groups' },
      logout: { id: 'AppContainer.logout', defaultMessage: 'Logout' },
      showStateLink: { id: 'AppContainer.showStateLink', defaultMessage: 'Show State' },
      usersLink: { id: 'AppContainer.usersLink', defaultMessage: 'Users' },
      containerGreetingStatus: {
        id: 'AppContainer.greeting_status',
        defaultMessage: 'Administer users and groups for Wittle South Ventures applications'
      },
      containerTitle: {
        id: 'AppContainer.title',
        defaultMessage: 'wittlesouth.com User Administration'
      }
    })
 
     // Set the initial status message for newly activated application
    this.props.store.dispatch(setMessage(this.componentText.containerGreetingStatus))

    // Initialize the state to the current store state
    this.state = {
      reduxState: props.store.getState(),
      isOpen: false
    }
    UserService.setState(props.store.getState().get(UserService.getStatePath()))

    this.currentLocale = props.getCurrentLocale()
    this.currentUser = UserService.getCurrent()
    this.init()
  }

  componentDidUpdate() {
    if (needsHydrate(this.state.reduxState)) {
      let lUser = loggedInUser(this.state.reduxState)
      const fullUser = lUser ? UserService.getById(lUser.getId()) : undefined
      if (fullUser) {
        this.props.store.dispatch(UserService.hydrate(fullUser))
      }
    }
  }

  logout() {
    let myUser = loggedInUser(this.state.reduxState)
    this.props.store.dispatch(UserService.logout(myUser))
  }

  // Put the Redux state and dispatch method into context
  getChildContext () {
    return {
      reduxState: this.props.store.getState(),
      dispatch: this.props.store.dispatch
    }
  }

  init () {
    // Define the locales we will support; needs to be done in render because locale can change
    this.availableLocales = [
      {localeCode: 'en', localeDesc: this.context.intl.formatMessage(this.componentText.enLocaleDesc)},
      {localeCode: 'fr', localeDesc: this.context.intl.formatMessage(this.componentText.frLocaleDesc)}
    ]
  }

  // When the app has mounted, subscribe to state change notifications
  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(this.listenStore)
  }

  // If the app is going to unmount, unsubscribe to state
  componentWillUnmount() {
    if (this.unsubscribe) { this.unsubscribe() }
  }

  // Listen for route changes in state
  // TODO: hide internal state structure for route transitions
  listenStore() {
    if (this.props.store.getState().hasIn(['clientState', 'transitionTo'])) {
      this.context.router.history.push(this.props.store.getState().getIn(['clientState', 'transitionTo']))
    }
    this.setState({
      reduxState: this.props.store.getState()
    })
  }

/*
  shouldComponentUpdate(nextProps, nextState) {
    console.log('In Should Component Update')
    return true
  }
*/

  // Will return the provided route if the user is authenticated, and a redirect otherwise
  getRoute (authRoute) {
    let ret = loggedInUser(this.state.reduxState) !== undefined
      ? authRoute
      : () => <Redirect to='/home' />
    return ret
  }

  toggle (e) {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
//    let formatMessage = this.context.intl.formatMessage
    let myUser = loggedInUser(this.state.reduxState)
    let locale = this.props.getCurrentLocale()
    if (locale !== this.currentLocale) {
      this.currentLocale = locale
      this.init()
    }
    // TODO: Hide internal state
    let msgData = this.state.reduxState.getIn(['clientState', 'message'])
    // let msgType = this.state.reduxState.getIn(['clientState', 'messageType'])
    if (msgData.toJS) {
      msgData = msgData.toJS()
//    } else if (msgData.message) {
//       msgType = 'Error'
    } else if (!(msgData.id && msgData.defaultMessage)) {
      console.log('Container.render() Note: message is not valid', msgData)
    } else {
      console.log('Container.render() Note: message was a JS object and not an Immutable object')
    }
/*
          <span className="bg-primary text-black"><i className="fas fas-bars" onClick={this.toggle} /></span>
*/
    return (
      <Container fluid={true} id="appName" className="App wrapper">
        <Sidebar toggle={this.toggle} isOpen={this.state.isOpen}/>
        <Content toggle={this.toggle} isOpen={this.state.isOpen} logout={myUser && this.logout}>
        <Switch>
          <Route path={'/users'} component={this.getRoute(UserAdmin)} />
          <Route path={'/groups'} component={this.getRoute(GroupAdmin)} />
          <Route path={'/showstate'} component={this.getRoute(ShowState)} />
          <Route component={Home} />
        </Switch>
        </Content>
      </Container>
    )
  }
}

AppContainer.contextTypes = {
  intl: intlShape.isRequired,
  router: PropTypes.object
}

// Define the types of child context the container will produce
AppContainer.childContextTypes = {
  dispatch: PropTypes.func,
  reduxState: PropTypes.object
}
