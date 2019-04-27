/* MemberList.jsx - List of members of a group, or groups for a user */
import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardTitle, Table } from 'reactstrap'
import { defineMessages, intlShape } from 'react-intl'
import { UserService, GroupService } from '../state/OrimServices'
import User from '../state/User'
import Group from '../state/Group'
import Membership from '../state/Membership'

export default class MemberList extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Internationalized text
    this.iText = defineMessages({
      cardTitle: { id: 'MemberList.title', defaultMessage: 'Membership' }
    })
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    const headerRow = this.props.listType === "Users"
      ? <tr>
          <th>{formatMessage(User.msgs.firstNameLabel)}</th>
          <th>{formatMessage(User.msgs.lastNameLabel)}</th>
          <th>{formatMessage(User.msgs.usernameLabel)}</th>
          <th>{formatMessage(Membership.msgs.isAdminLabel)}</th>
          <th>{formatMessage(Membership.msgs.isOwnerLabel)}</th>
        </tr>
      : <tr>
          <th>{formatMessage(Group.msgs.nameLabel)}</th>
          <th>{formatMessage(Group.msgs.gidLabel)}</th>
          <th>{formatMessage(Membership.msgs.isAdminLabel)}</th>
          <th>{formatMessage(Membership.msgs.isOwnerLabel)}</th>
        </tr>
    const rows = []
    this.props.list.forEach((membership, itemId) => {
      let item = this.props.listType === "Users"
        ? UserService.getById(itemId)
        : GroupService.getById(itemId)
      rows.push(
        this.props.listType === "Users"
          ? <tr key={itemId}>
              <td>{item.getFirstName()}</td>
              <td>{item.getLastName()}</td>
              <td>{item.getUsername()}</td>
              <td>{membership.getIsAdmin() ? <i className="fas fa-check" /> : ""}</td>
              <td>{membership.getIsOwner() ? <i className="fas fa-check" /> : ""}</td>
            </tr>
          : <tr key={itemId}>
              <td>{item.getName()}</td>
              <td>{item.getGid()}</td>
              <td>{membership.getIsAdmin() ? <i className="fas fa-check" /> : ""}</td>
              <td>{membership.getIsOwner() ? <i className="fas fa-check" /> : ""}</td>
            </tr>
      )
    })
    return (
      <Card>
        <CardBody>
          <CardTitle>{formatMessage(this.iText.cardTitle)}</CardTitle>
          <Table>
            <thead>
              {headerRow}
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    )
  }
}

MemberList.propTypes = {
  listType: PropTypes.string.isRequired,
  list: PropTypes.object
}

MemberList.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape
}
