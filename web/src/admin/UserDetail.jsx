/* UserDetail.jsx - Detail pane for user */

import React from 'react'
import PropTypes from 'prop-types'
import { intlShape } from 'react-intl'
import { Card, CardHeader, CardBody, Col, Row } from 'reactstrap'
import User from '../state/User'
import { MembershipService } from '../state/OrimServices'

export default class UserDetail extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)
  }
  onDragOver (e) {
    e.preventDefault()
  }
  onDrop (e) {
    e.preventDefault()
    const droppedType = e.dataTransfer.getData("type")
    const droppedId = e.dataTransfer.getData("text")
    const newMembership = MembershipService.newGroupForUser(this.props.user, droppedId)
    try {
      this.context.dispatch(MembershipService.saveNew(newMembership))
    } catch (e) {
      console.log('Validation Error: ', e)
    }
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    const labelCols = 4
    const valueCols = 8
    return (
      <Card onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <CardHeader>{this.props.user.getFullName()}</CardHeader>
        <CardBody>
          <Row>
            <Col md={labelCols}>{formatMessage(User.msgs.firstNameLabel)}</Col>
            <Col md={valueCols}>{this.props.user.getFirstName()}</Col>
          </Row>
          <Row>
            <Col md={labelCols}>{formatMessage(User.msgs.lastNameLabel)}</Col>
            <Col md={valueCols}>{this.props.user.getLastName()}</Col>
          </Row>
          <Row>
            <Col md={labelCols}>{formatMessage(User.msgs.emailLabel)}</Col>
            <Col md={valueCols}>{this.props.user.getEmail()}</Col>
          </Row>
          <Row>
            <Col md={labelCols}>{formatMessage(User.msgs.phoneLabel)}</Col>
            <Col md={valueCols}>{this.props.user.getPhone()}</Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

UserDetail.propTypes = {
  user: PropTypes.object.isRequired
}

UserDetail.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape
}
