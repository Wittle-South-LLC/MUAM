/* UserAdmin.jsx - User administration */
import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Button, Card, CardBody, CardText, CardTitle, Col, ListGroup,
         ListGroupItem, ListGroupItemHeading, ListGroupItemText,
         Row } from 'reactstrap'
import { defineMessages, intlShape } from 'react-intl'
import { GroupService, MembershipService, UserService } from '../state/OrimServices'
import MemberList from './MemberList'

export default class UserAdmin extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Method bindings
    this.onSelect = this.onSelect.bind(this)

    // Message components
    this.iText = defineMessages({
      pageTitle: { id: 'UserAdmin.title', defaultMessage: 'User Administration' },
      usersLabel: { id: 'UserAdmin.usersLabel', defaultMessage: 'Users:' }
    })
    this.state = {
      selectedUserId: undefined
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
  render () {
    let formatMessage = this.context.intl.formatMessage
    let usersList = UserService.getObjectArray()
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
    return (
      <Row>
        <Col md={6}>
          <Card>
            <CardBody>
              <CardTitle>{formatMessage(this.iText.pageTitle)}<i className="fa fa-plus float-right"></i></CardTitle>
              <ListGroup>
                {usersLGItems}
              </ListGroup>
              <Button outline size="xs"><i className="fa fa-plus" onClick={this.startAdd}/></Button>
              <Button outline size="xs" disabled={this.state.selectedGroupId === undefined}>
                <i className="fa fa-minus" onClick={this.startDelete}/>
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          {this.state.selectedUserId 
            ? <MemberList listType="Groups" list={MembershipService.getMembersForUser(this.state.selectedUserId)}></MemberList>
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
