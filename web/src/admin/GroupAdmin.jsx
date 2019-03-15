/* GroupAdmin.jsx - Main page for group administration */
import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Button, Card, CardBody, CardText, CardTitle, Col,
         ListGroup, ListGroupItem,
         ListGroupItemHeading, ListGroupItemText, Row } from 'reactstrap'
import { intlShape, defineMessages } from 'react-intl'
import { GroupService, MembershipService } from '../state/OrimServices'
import MemberList from './MemberList'

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
          {group.getName() + "  [" + group.getGid() + "]  " }
          <Badge pill>{group.getUsers().size + " users"}</Badge>
          <i className="fa fa-minus float-right"/>
        </ListGroupItemHeading>
        <ListGroupItemText>
          {group.getDescription()}
        </ListGroupItemText>
      </ListGroupItem>
    )
    let rightStuff = <Card>
      <CardBody>
        <CardTitle>Group Administration Instructions</CardTitle>
        <CardText>Select a group to see the list of users</CardText>
      </CardBody>
    </Card>
    return (
      <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <CardTitle>{formatMessage(this.iText.pageTitle)}<i className="fa fa-plus float-right"></i></CardTitle>
              <ListGroup>
                {groupsLGItems}
              </ListGroup>
              <Button outline size="xs"><i className="fa fa-plus" onClick={this.startAdd}/></Button>
              <Button outline size="xs" disabled={this.state.selectedGroupId === undefined}>
                <i className="fa fa-minus" onClick={this.startDelete}/>
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          {this.state.selectedGroupId 
            ? <MemberList listType="Users" list={MembershipService.getMembersForGroup(this.state.selectedGroupId)}></MemberList>
            : rightStuff
          }
        </Col>
      </Row>
    )
  }
}

GroupAdmin.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object.isRequired,
  router: PropTypes.object
}
