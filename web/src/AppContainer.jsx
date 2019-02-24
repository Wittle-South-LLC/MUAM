import React from 'react'
import PropTypes from 'prop-types'
import { NavLink as RRNavLink, Redirect, Route, Switch } from 'react-router-dom'
import { Col, Collapse, Container, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, Row } from 'reactstrap'
import { intlShape, defineMessages } from 'react-intl'
import { UserService } from './state/OrimServices'
import { loggedInUser, setMessage } from './state/clientState'
import UserAdmin from './admin/UserAdmin'
import GroupAdmin from './admin/GroupAdmin'
import ShowState from './utils/ShowState'
import Home from './Home'

export default class AppContainer extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.listenStore = this.listenStore.bind(this)
    this.init = this.init.bind(this)
    this.getRoute = this.getRoute.bind(this)
    this.toggle = this.toggle.bind(this)

    // Will be set when app is subscribed to state changes
    this.unsubscribe = undefined

    this.componentText = defineMessages({
      enLocaleDesc: { id: 'container.en_locale_description', defaultMessage: 'English' },
      frLocaleDesc: { id: 'container.fr_locale_description', defaultMessage: 'French' },
      containerGreetingStatus: {
        id: 'container.greeting_status',
        defaultMessage: 'Administer users and groups for Wittle South Ventures applications'
      },
      containerTitle: {
        id: 'container.title',
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
    console.log('UserService.getStatePath() = ', UserService.getStatePath())
    console.log('this.state.reduxState = ', this.state.reduxState.toJS())
    UserService.setState(props.store.getState().get(UserService.getStatePath()))

    this.currentLocale = props.getCurrentLocale()
    this.currentUser = UserService.getCurrent()
    this.init()
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

  // Will return the provided route if the user is authenticated, and a redirect otherwise
  getRoute (authRoute) {
    let ret = loggedInUser(this.state.reduxState) !== undefined
      ? authRoute
      : () => <Redirect to='/home' />
    return ret
  }

  toggle (e) {
    console.log('Toggling')
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    let locale = this.props.getCurrentLocale()
    if (locale !== this.currentLocale) {
      this.currentLocale = locale
      this.init()
    }
    // TODO: Hide internal state
    let msgData = this.state.reduxState.getIn(['clientState', 'message'])
    let msgType = this.state.reduxState.getIn(['clientState', 'messageType'])
    if (msgData.toJS) {
      msgData = msgData.toJS()
    } else if (msgData.message) {
      msgType = 'Error'
    } else if (!(msgData.id && msgData.defaultMessage)) {
      console.log('Container.render() Note: message is not valid', msgData)
    } else {
      console.log('Container.render() Note: message was a JS object and not an Immutable object')
    }
    return (
      <Container fluid={true} id="appName">
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">MUAM</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem><NavLink tag={ RRNavLink } exact to="/groups">Groups</NavLink></NavItem>              
              <NavItem><NavLink tag={ RRNavLink } exact to="/users">Users</NavLink></NavItem>              
              <NavItem><NavLink tag={ RRNavLink } exact to="/showstate">Show State</NavLink></NavItem>              
            </Nav>
          </Collapse>
        </Navbar>
        <Row>
          <Col md={ loggedInUser(this.state.reduxState) !== undefined ? 9 : 12 }
              className='scroll-vertical'
              id='appMainBody'>
          <Switch>
              <Route path={'/users'} component={this.getRoute(UserAdmin)} />
              <Route path={'/groups'} component={this.getRoute(GroupAdmin)} />
              <Route path={'/showstate'} component={this.getRoute(ShowState)} />
              <Route component={Home} />
          </Switch>
            </Col>
        </Row>
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
