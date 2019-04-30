/* GroupDetail.jsx - Detail pane for group */

import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, intlShape } from 'react-intl'
import { Button, Card, CardHeader, CardBody, Col, Row } from 'reactstrap'
import Group from '../state/Group'
import { GroupService, MembershipService } from '../state/OrimServices'

export default class GroupDetail extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.onDragOver = this.onDragOver.bind(this)
    this.onDrop = this.onDrop.bind(this)

    this.iText = defineMessages({
      confirmDelete: { id: 'GroupDetail.confirmDelete', defaultMessage: 'Confirm Delete' },
      delete: { id: 'GroupDetail.delete', defaultMessage: 'Delete' }
    })
  }
  onDragOver (e) {
    e.preventDefault()
  }
  onDrop (e) {
    e.preventDefault()
    const droppedId = e.dataTransfer.getData("text")
    const newMembership = MembershipService.newUserForGroup(this.props.group, droppedId)
    try {
      this.context.dispatch(MembershipService.saveNew(newMembership))
    } catch (e) {
      console.log('Validation Error: ', e)
    }
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    if (!this.props.group) { return (<p>No Group</p>) }
    const labelCols = 4
    const valueCols = 8
    return (
      <Card onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <CardHeader>{this.props.group.getName()}</CardHeader>
        <CardBody>
          {GroupService.isDeleting() &&
            <Row>
              <Col md={labelCols}>{formatMessage(this.iText.confirmDelete)}</Col>
              <Col md={valueCols}><Button color="danger" size="sm" onClick={this.props.confirmDelete}>{formatMessage(this.iText.delete)}</Button></Col>
            </Row>
          }
          <Row>
            <Col md={labelCols}>{formatMessage(Group.msgs.descriptionLabel)}</Col>
            <Col md={valueCols}>{this.props.group.getDescription()}</Col>
          </Row>
          <Row>
            <Col md={labelCols}>{formatMessage(Group.msgs.gidLabel)}</Col>
            <Col md={valueCols}>{this.props.group.getGid()}</Col>
          </Row>
        </CardBody>
      </Card>
    )
  }
}

GroupDetail.propTypes = {
  group: PropTypes.object.isRequired
}

GroupDetail.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape
}
