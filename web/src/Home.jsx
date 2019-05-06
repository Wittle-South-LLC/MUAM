/* Home.jsx - Main page for group administration */
import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { Button, Card, CardTitle, CardBody, Form, FormGroup, Input, Label } from 'reactstrap'
import { loggedInUser } from './state/clientState'
import { UserService } from './state/OrimServices'
import User from './state/User'

export default class Home extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Method bindings
    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)

    // Initial state
    this.state = {
      loginUsername: undefined,
      loginPassword: undefined
    }

    // Message components
    this.componentText = defineMessages({
      loginButtonText: { id: 'home.loginButton', defaultMessage: 'Login' }
    })
  }
  handleChange (e) {
    if (e.target.id === 'username') {
      this.setState({loginUsername: e.target.value})
    } else if (e.target.id === 'password') {
      this.setState({loginPassword: e.target.value})
    }
  }
  handleLogin (e) {
    this.context.dispatch(UserService.login(this.state.loginUsername, this.state.loginPassword))
    this.setState({
      loginUsername: undefined,
      loginPassword: undefined
    })
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    const lUser = loggedInUser(this.context.reduxState)
    const homeContent = lUser ? <p>Welcome {UserService.getById(lUser.getId()).getFirstName()}!</p> : <p>Home</p>
    return (
      <div>
        { loggedInUser(this.context.reduxState) !== undefined
          ? homeContent
          : <Card>
              <CardTitle>Please log in</CardTitle>
              <CardBody>
                <Form className="form">
                  <FormGroup onSubmit={this.handleLogin}>
                    <Label for="username">{formatMessage(User.msgs.usernameLabel)}</Label>
                    <Input type='text' name='username' id='username'
                           placeholder={formatMessage(User.msgs.usernamePlaceholder)}
                           value={this.state.loginUsername || ''}
                           onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">{formatMessage(User.msgs.usernameLabel)}</Label>
                    <Input type='password' name='password' id='password'
                           placeholder={formatMessage(User.msgs.passwordPlaceholder)}
                           value={this.state.loginPassword || ''}
                           onChange={this.handleChange} />
                  </FormGroup>
                  <Button onClick={this.handleLogin}>{formatMessage(this.componentText.loginButtonText)}</Button>
                </Form>
              </CardBody>
            </Card>
        }
      </div>
    )
  }
}

Home.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object.isRequired,
  router: PropTypes.object
}
