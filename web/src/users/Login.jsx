/* Home.jsx - Login card component */
import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { Button, Card, CardBody, CardHeader, Form, FormGroup, Input } from 'reactstrap'

export default class Login extends React.Component {
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
    this.iText = defineMessages({
      loginButtonText: { id: 'login.loginButton', defaultMessage: 'Login' },
      loginCardTitle: { id: 'login.CardTitle', defaultMessage: 'Sign In' }
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
    this.context.dispatch(this.props.userService.login(this.state.loginUsername, this.state.loginPassword))
    this.setState({
      loginUsername: undefined,
      loginPassword: undefined
    })
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    return (
      <Card>
        <CardHeader className="text-center bg-primary text-white">
          {formatMessage(this.iText.loginCardTitle)}
        </CardHeader>
        <CardBody>
          <Form className="form text-center">
            <FormGroup onSubmit={this.handleLogin}>
              <Input type='text' name='username' id='username'
                     placeholder={formatMessage(this.props.userMsgs.usernamePlaceholder)}
                     value={this.state.loginUsername || ''}
                     onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input type='password' name='password' id='password'
                     placeholder={formatMessage(this.props.userMsgs.passwordPlaceholder)}
                     value={this.state.loginPassword || ''}
                     onChange={this.handleChange} />
            </FormGroup>
            <Button outline color="primary" className="btn-block" onClick={this.handleLogin}>
              {formatMessage(this.iText.loginButtonText)}
            </Button>
            <p className="p-3">or sign in with:</p>
            <span className="fa-stack">
              <i className="fas fa-circle fa-stack-2x text-primary" />
              <i className="fab fa-facebook-f fa-stack-1x fa-inverse" />
            </span>
          </Form>
        </CardBody>
      </Card>        
    )
  }
}

Login.propTypes = {
  userService: PropTypes.object.isRequired,
  userMsgs: PropTypes.object.isRequired
}

Login.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object
}
