/* GroupEdit.jsx - Editor pane for a group */

import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label } from 'reactstrap'
import { intlShape, defineMessages } from 'react-intl'
import Group from '../state/Group'
import { GroupService } from '../state/OrimServices'

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
      <Card>
        <CardBody>
          <CardTitle>{formatMessage(this.iText.pageTitle)}</CardTitle>
          <Form>
            <FormGroup>
              <Label for="name">{formatMessage(Group.msgs.nameLabel)}</Label>
              <Input type="text" name="name" id="name"
                     placeholder={formatMessage(Group.msgs.namePlaceholder)}
                     value={this.props.group.getName()}
                     onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="gid">{formatMessage(Group.msgs.gidLabel)}</Label>
              <Input type="number" name="gid" id="gid"
                     placeholder={formatMessage(Group.msgs.gidPlaceholder)}
                     value={this.props.group.getGid()}
                     onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="description">{formatMessage(Group.msgs.descriptionLabel)}</Label>
              <Input type="textarea" name="description" id="description"
                     placeholder={formatMessage(Group.msgs.descriptionPlaceholder)}
                     value={this.props.group.getDescription()}
                     onChange={this.handleChange} />
            </FormGroup>
            <Button onClick={this.onSubmit}>{formatMessage(this.iText.saveGroup)}</Button>
            <Button>{formatMessage(this.iText.cancelEdit)}</Button>
          </Form>
        </CardBody>
      </Card>
    )
  }
}

GroupEdit.propTypes = {
  group: PropTypes.object.isRequired
}

GroupEdit.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object.isRequired,
  router: PropTypes.object
}
