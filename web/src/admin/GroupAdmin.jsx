/* GroupAdmin.jsx - Main page for group administration */
import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Breadcrumb, BreadcrumbItem, Card, CardBody, CardText,
         CardTitle, Col, ListGroup, ListGroupItem,
         ListGroupItemHeading, ListGroupItemText, Row } from 'reactstrap'
import { defineMessages, intlShape } from 'react-intl'
import { GroupService, MembershipService } from '../state/OrimServices'
import Group from '../state/Group'
import ActiveCard from '../components/ActiveCard'
import GroupEdit from './GroupEdit'
import GroupDetail from './GroupDetail'
import UserSearch from './UserSearch'
import MemberList from './MemberList'

export default class GroupAdmin extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Method bindings
    this.confirmDelete = this.confirmDelete.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onClear = this.onClear.bind(this)

    // Internationalized text
    this.iText = defineMessages({
      pageTitle: { id: 'GroupAdmin.title', defaultMessage: 'Group Administration' },
      groupsLabel: { id: 'GroupAdmin.groupsLabel', defaultMessage: 'Groups:' }
    })

    this.state = {
      selectedGroupId: undefined
    }
    if (GroupService.isEditing()) {
      this.state.selectedGroupId = GroupService.getEditing().getId()
    } else if (GroupService.isCreating()) {
      this.state.selectedGroupId = GroupService._NewID
    } else if (GroupService.isDeleting()) {
      this.state.selectedGroupId = GroupService.getDeleting().getId()
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
  confirmDelete (e) {
    this.setState({
      selectedGroupId: undefined
    })
    this.context.dispatch(GroupService.commitDelete(GroupService.getById(this.state.selectedGroupId)))
  }
  onClear () {
    this.setState({
      selectedGroupId: undefined
    })
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    let groupsList = GroupService.getObjectArray()
    let selectedGroup = GroupService.getById(this.state.selectedGroupId)
    let groupsLGItems = groupsList.map((group) =>
      <ListGroupItem className="justify-content-between" key={group.getId()}
                     id={group.getId()} onClick={this.onSelect}
                     active={group.getId() === this.state.selectedGroupId}>
        <ListGroupItemHeading>
          {group.getName() + "  [" + group.getGid() + "]  " }
          {MembershipService.getMembersForGroup(group) && <Badge pill>{MembershipService.getMembersForGroup(group).size + " users"}</Badge>}
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
    var leftSide = GroupService.isEditing() || GroupService.isCreating()
      ? <GroupEdit group={GroupService.getById(GroupService.isCreating() ? Group._NewID : GroupService.getEditing().getId())}>
        </GroupEdit>
      : <ListGroup>
          {groupsLGItems}
        </ListGroup>
    if (this.state.selectedGroupId && (!GroupService.isEditing() || GroupService.isCreating())) {
      leftSide = <GroupDetail group={selectedGroup} confirmDelete={this.confirmDelete}/>
    }
    const myTitle= selectedGroup
      ? <Breadcrumb className="inlineBreadcrumb">
          <BreadcrumbItem onClick={this.onClear}>{formatMessage(this.iText.pageTitle)}</BreadcrumbItem>
          <BreadcrumbItem active>{selectedGroup.getName()}</BreadcrumbItem>
        </Breadcrumb>
      : <Breadcrumb className="inlineBreadcrumb">
          <BreadcrumbItem active>{formatMessage(this.iText.pageTitle)}</BreadcrumbItem>
        </Breadcrumb>
    return (
      <Row>
        <Col md={6}>
          <ActiveCard title={myTitle}
                      service={GroupService}
                      selectedId={this.state.selectedGroupId}>
            {leftSide}
          </ActiveCard>
        </Col>
        <Col md={6}>
          {this.state.selectedGroupId 
            ? <div>
                <MemberList listType="Users" list={MembershipService.getMembersForGroup(selectedGroup)}></MemberList>
                <UserSearch />
              </div>
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
