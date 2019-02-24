/* Home.jsx - Main page for group administration */
import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { Button, Card, CardTitle, CardBody, Form, FormGroup, Input, Label } from 'reactstrap'
import { loggedInUser } from './state/clientState'
import { UserService } from './state/OrimServices'

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
  }
  render () {
    const homeContent = <p>Home</p>
    return (
      <div>
        { loggedInUser(this.context.reduxState) != undefined
          ? homeContent
          : <Card>
              <CardTitle>Please log in</CardTitle>
              <CardBody>
                <Form className="form">
                  <FormGroup onSubmit={this.handleLogin}>
                    <Label for="username">Username</Label>
                    <Input type='text' name='username' id='username'
                           placeholder='User name...'
                           value={this.state.loginUsername || ''}
                           onChange={this.handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type='password' name='password' id='password'
                           placeholder='Password...'
                           value={this.state.loginPassword || ''}
                           onChange={this.handleChange} />
                  </FormGroup>
                  <Button onClick={this.handleLogin}>Login</Button>
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
