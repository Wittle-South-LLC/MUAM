/* GroupAdmin.jsx - Main page for group administration */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { GroupService } from '../state/OrimServices'
import { intlShape, defineMessages } from 'react-intl'

export default class GroupAdmin extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Method bindings
    this.onSelect = this.onSelect.bind(this)

    // Internationalized text
    this.iText = defineMessages({
      pageTitle: { id: 'GroupAdmin.title', defaultMessage: 'Group Administration' },
      groupsLabel: { id: 'GroupAdmin.groupsLabel', defaultMessage: 'Groups:' }
    })
  }
  onSelect (e) {
    console.log('onSelect e = ', e)
    console.log('onSelect e.target = ', e.target)
    console.log('onSelect e.target.value = ', e.target.value)
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    let groupsList = GroupService.getObjectArray()
    let groupsOptions = groupsList.map((group) => <option key={group.getId()}>{group.getName()}</option>)
    return (
      <Form>
        <p>{formatMessage(this.iText.pageTitle)}</p>
        <FormGroup>
          <Label for="selectGroup">{formatMessage(this.iText.groupsLabel)}</Label>
          <Input type="select" name="selectGroup" multiple onChange={this.onSelect}>
            {groupsOptions}
          </Input>
          <Button outline size="sm"><i className="fa fa-plus" /></Button>
          <Button outline size="sm"><i className="fa fa-minus" /></Button>
        </FormGroup>
      </Form>
    )
  }
}

GroupAdmin.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object.isRequired,
  router: PropTypes.object
}
