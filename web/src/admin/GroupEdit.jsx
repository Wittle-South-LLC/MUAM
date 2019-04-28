/* GroupEdit.jsx - Editor pane for a group */

import React from 'react'
import PropTypes from 'prop-types'
import { Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap'
import { intlShape, defineMessages } from 'react-intl'
import { GroupService } from '../state/OrimServices'
import Group from '../state/Group'

export default class GroupEdit extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Method bindings
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

    // Internationalized text
    this.iText = defineMessages({
      pageTitle: { id: 'GroupEdit.title', defaultMessage: 'Group Editor' },
      cancelEdit: { id: 'GroupEdit.cancelEdit', defaultMessage: 'Cancel' },
      saveGroup: { id: 'GroupEdit.saveGroup', defaultMessage: 'Save' }
    })
  }
  handleChange (e) {
    this.context.dispatch(GroupService.editField(e.target.id, e.target.value, this.props.group))
  }
  onSubmit (e) {
    e.preventDefault()
    this.context.dispatch(GroupService.saveUpdate(this.props.group))
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    return (
      <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="name">{formatMessage(Group.msgs.nameLabel)}</Label>
              <Input type="text" name="name" id="name"
                     placeholder={formatMessage(Group.msgs.namePlaceholder)}
                     value={this.props.group.getName()}
                     invalid={!this.props.group.isNameValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(Group.msgs.nameInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="gid">{formatMessage(Group.msgs.gidLabel)}</Label>
              <Input type="number" name="gid" id="gid"
                     placeholder={formatMessage(Group.msgs.gidPlaceholder)}
                     value={this.props.group.getGid()}
                     invalid={!this.props.group.isGidValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(Group.msgs.gidInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={12}>
            <FormGroup>
              <Label for="description">{formatMessage(Group.msgs.descriptionLabel)}</Label>
              <Input type="textarea" name="description" id="description"
                     placeholder={formatMessage(Group.msgs.descriptionPlaceholder)}
                     value={this.props.group.getDescription()}
                     invalid={!this.props.group.isDescriptionValid()}
                     onChange={this.handleChange} />
              <FormFeedback>{formatMessage(Group.msgs.descriptionInvalid)}</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
      </Form>
    )
  }
}

GroupEdit.propTypes = {
  group: PropTypes.object.isRequired
}

GroupEdit.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape
}
