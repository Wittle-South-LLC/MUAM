/* UserEdit.jsx - Editor pane for a user */

import React from 'react'
import PropTypes from 'prop-types'
import { Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import { intlShape } from 'react-intl'
import { UserService } from '../state/OrimServices'
import User from '../state/User'

export default class UserEdit extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Method bindings
    this.handleChange = this.handleChange.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }
  handleChange (e) {
    this.context.dispatch(UserService.editField(e.target.id, e.target.value, this.props.user))
  }
  handleToggle (e) {
    this.context.dispatch(UserService.editField(e.target.id, e.target.checked, this.props.user))
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    return (
      <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="username">{formatMessage(User.msgs.usernameLabel)}</Label>
              <Input type="text" name="username" id="username"
                     placeholder={formatMessage(User.msgs.usernamePlaceholder)}
                     value={this.props.user.getUsername()}
                     invalid={!this.props.user.isUsernameValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(User.msgs.usernameInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="password">{formatMessage(User.msgs.passwordLabel)}</Label>
              <Input type="password" name="password" id="password"
                     placeholder={formatMessage(User.msgs.passwordPlaceholder)}
                     value={this.props.user.getPassword()}
                     invalid={!this.props.user.isPasswordValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(User.msgs.passwordInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="first_name">{formatMessage(User.msgs.firstNameLabel)}</Label>
              <Input type="text" name="first_name" id="first_name"
                     placeholder={formatMessage(User.msgs.firstNamePlaceholder)}
                     value={this.props.user.getFirstName()}
                     invalid={!this.props.user.isFirstNameValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(User.msgs.firstNameInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="last_name">{formatMessage(User.msgs.lastNameLabel)}</Label>
              <Input type="text" name="last_name" id="last_name"
                     placeholder={formatMessage(User.msgs.lastNamePlaceholder)}
                     value={this.props.user.getLastName()}
                     invalid={!this.props.user.isLastNameValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(User.msgs.lastNameInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
            <FormGroup>
              <Label for="full_name">{formatMessage(User.msgs.fullNameLabel)}</Label>
              <Input type="text" name="full_name" id="full_name"
                     placeholder={formatMessage(User.msgs.fullNamePlaceholder)}
                     value={this.props.user.getFullName()}
                     invalid={!this.props.user.isFullNameValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(User.msgs.fullNameInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="email">{formatMessage(User.msgs.emailLabel)}</Label>
              <Input type="text" name="email" id="email"
                     placeholder={formatMessage(User.msgs.emailPlaceholder)}
                     value={this.props.user.getEmail()}
                     invalid={!this.props.user.isEmailValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(User.msgs.emailInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="phone">{formatMessage(User.msgs.phoneLabel)}</Label>
              <Input type="text" name="phone" id="phone"
                     placeholder={formatMessage(User.msgs.phonePlaceholder)}
                     value={this.props.user.getPhone() || ''}
                     invalid={!this.props.user.isPhoneValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(User.msgs.phoneInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={4}>
            <FormGroup check>
              <Input type="checkbox" name="create_users" id="create_users"
                     checked={this.props.user.getCreateUsers()}
                     onChange={this.handleToggle} />
              <Label for="create_users"check >{formatMessage(User.msgs.createUsersLabel)}</Label>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup check>
              <Input type="checkbox" name="create_groups" id="create_groups"
                     checked={this.props.user.getCreateGroups()}
                     onChange={this.handleToggle} />
              <Label for="create_groups" check>{formatMessage(User.msgs.createGroupsLabel)}</Label>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup check>
              <Input type="checkbox" name="grant_privs" id="grant_privs"
                     checked={this.props.user.getGrantPrivs()}
                     onChange={this.handleToggle} />
              <Label for="grant_privs" check>{formatMessage(User.msgs.grantPrivsLabel)}</Label>
            </FormGroup>
          </Col>
        </Row>
      </Form>    
    )
  }
}

UserEdit.propTypes = {
  user: PropTypes.object.isRequired
}

UserEdit.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape
}