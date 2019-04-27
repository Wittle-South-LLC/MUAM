/* UserAdmin.jsx - User administration */
import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Breadcrumb, BreadcrumbItem, Card, CardBody, CardText,
         CardTitle, Col, ListGroup, ListGroupItem, ListGroupItemHeading,
         ListGroupItemText, Row } from 'reactstrap'
import { defineMessages, intlShape } from 'react-intl'
import { MembershipService, UserService } from '../state/OrimServices'
import User from '../state/User'
import ActiveCard from '../components/ActiveCard'
import UserEdit from './UserEdit'
import UserDetail from './UserDetail'
import GroupSearch from './GroupSearch'
import MemberList from './MemberList'

export default class UserAdmin extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Method bindings
    this.onSelect = this.onSelect.bind(this)
    this.onClear = this.onClear.bind(this)

    // Message components
    this.iText = defineMessages({
      pageTitle: { id: 'UserAdmin.title', defaultMessage: 'User Administration' },
      usersLabel: { id: 'UserAdmin.usersLabel', defaultMessage: 'Users:' }
    })
    this.state = {
      selectedUserId: undefined
    }
    if (UserService.isEditing()) {
      this.state.selectedUserId = UserService.getEditingId()
    } else if (UserService.isCreating()) {
      this.state.selectedUserId = UserService._NewID
    }
  }
  onSelect (e) {
    // Find the ListGroupItem with the ID
    let idElement = e.target
    while (!idElement.id && idElement.parentNode) {
      idElement = idElement.parentNode
    }
    this.setState({
      selectedUserId: idElement.id
    })
  }
  onClear () {
    this.setState({
      selectedUserId: undefined
    })
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    let usersList = UserService.getObjectArray()
    let selectedUser = UserService.getById(this.state.selectedUserId)
    let usersLGItems = usersList.map((user) =>
      <ListGroupItem className="justify-content-between" key={user.getId()}
                     id={user.getId()} onClick={this.onSelect}
                     active={user.getId() === this.state.selectedUserId}>
        <ListGroupItemHeading>
          {user.getFullName() + "  [" + user.getUsername() + "]  " }
          <Badge pill>{user.getGroups().size + " groups"}</Badge>
          <i className="fa fa-minus float-right"/>
        </ListGroupItemHeading>
        <ListGroupItemText>
          {user.getLastName() + ", " + user.getFirstName()}
        </ListGroupItemText>
      </ListGroupItem>
    )
    let rightStuff = <Card>
      <CardBody>
        <CardTitle>User Administration Instructions</CardTitle>
        <CardText>Select a user to see the list of groups</CardText>
      </CardBody>
    </Card>
    var leftSide = UserService.isEditing() || UserService.isCreating()
      ? <UserEdit user={UserService.getById(UserService.isCreating() ? User._NewID : UserService.getEditingId())}>
        </UserEdit>
      : <ListGroup>
          {usersLGItems}
        </ListGroup>
    if (this.state.selectedUserId && (!UserService.isEditing() || UserService.isCreating())) {
      leftSide = <UserDetail user={selectedUser} />
    }
    const myTitle= selectedUser
      ? <Breadcrumb className="inlineBreadcrumb">
          <BreadcrumbItem onClick={this.onClear}>{formatMessage(this.iText.pageTitle)}</BreadcrumbItem>
          <BreadcrumbItem active>{selectedUser.getUsername()}</BreadcrumbItem>
        </Breadcrumb>
      : <Breadcrumb className="inlineBreadcrumb">
          <BreadcrumbItem active>{formatMessage(this.iText.pageTitle)}</BreadcrumbItem>
        </Breadcrumb>
    return (
      <Row>
        <Col md={6}>
          <ActiveCard title={myTitle}
                      service={UserService}
                      selectedId={this.state.selectedUserId}>
            {leftSide}
          </ActiveCard>
        </Col>
        <Col md={6}>
          {this.state.selectedUserId 
            ? <div>
                <MemberList listType="Groups" list={MembershipService.getMembersForUser(this.state.selectedUserId)}></MemberList>
                <GroupSearch />
              </div>
            : rightStuff
          }
        </Col>
      </Row>
    )
  }
}

UserAdmin.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object.isRequired,
  router: PropTypes.object
}
