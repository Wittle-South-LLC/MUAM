/* GroupAdmin.jsx - Main page for group administration */
import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label, ListGroup,
        ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap'
import { GroupService } from '../state/OrimServices'
import { intlShape, defineMessages } from 'react-intl'

export default class GroupAdmin extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Method bindings
    this.onSelect = this.onSelect.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.startDelete = this.startDelete.bind(this)
    this.startAdd = this.startAdd.bind(this)

    // Internationalized text
    this.iText = defineMessages({
      pageTitle: { id: 'GroupAdmin.title', defaultMessage: 'Group Administration' },
      groupsLabel: { id: 'GroupAdmin.groupsLabel', defaultMessage: 'Groups:' }
    })

    this.state = {
      selectedGroupId: undefined
    }
  }
  onSelect (e) {
    // Find the ListGroupItem with the ID
    let idElement = e.target
    while (!idElement.id && idElement.parentNode) {
      idElement = idElement.parentNode
    }
    console.log('idElement.id = ', idElement.id)
    this.setState({
      selectedGroupId: idElement.id
    })
  }
  onSubmit (e) {
    console.log('Trying to stop propagation')
    e.preventDefault()
  }
  startAdd (e) {
    console.log('Starting to add')
    e.stopPropagation()
  }
  startDelete (e) {
    console.log('Starting to delete')
    e.stopPropagation()
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    let groupsList = GroupService.getObjectArray()
    let groupsLGItems = groupsList.map((group) =>
      <ListGroupItem className="justify-content-between" key={group.getId()}
                     id={group.getId()} onClick={this.onSelect}
                     active={group.getId() === this.state.selectedGroupId}>
        <ListGroupItemHeading>
          {group.getName() + "  "}
          <Badge pill>{group.getUsers().size + " users"}</Badge>
        </ListGroupItemHeading>
        <ListGroupItemText>
          {group.getDescription()}
        </ListGroupItemText>
      </ListGroupItem>
    )
    return (
      <Card md={this.state.selectedGroupId ? 6 : 12}>
        <CardBody>
          <CardTitle>{formatMessage(this.iText.pageTitle)}</CardTitle>
          <ListGroup>
            {groupsLGItems}
          </ListGroup>
          <Button outline size="sm"><i className="fa fa-plus" onClick={this.startAdd}/></Button>
          <Button outline size="sm" disabled={this.state.selectedGroupId === undefined}>
            <i className="fa fa-minus" onClick={this.startDelete}/>
          </Button>
        </CardBody>
      </Card>
    )
  }
}

GroupAdmin.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object.isRequired,
  router: PropTypes.object
}
