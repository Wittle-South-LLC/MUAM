/* Home.jsx - Main page for group administration */
import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { Card, CardTitle, CardBody, Form, FormGroup, Input, Label } from 'reactstrap'
import { loggedInUser } from './state/clientState'
// import { UserService } from './state/OrimServices'

export default class Home extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      authenticated: loggedInUser(context.reduxState) != undefined
    }
  }
  render () {
    const homeContent = <p>Home</p>
    return (
      <div>
        { this.state.authenticated
          ? homeContent
          : <Card>
              <CardTitle>Please log in</CardTitle>
              <CardBody>
                <Form className="form">
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input type='text' name='username' id='username' placeholder='User name...' />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type='password' name='password' id='password' placeholder='Password...' />
                  </FormGroup>
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
