/* MemberList.jsx - List of members of a group, or groups for a user */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Table } from 'reactstrap'
import { defineMessages, intlShape } from 'react-intl'
import { UserService, GroupService, MembershipService } from '../state/OrimServices'
import ActiveCard from '../components/ActiveCard'
import User from '../state/User'
import Group from '../state/Group'
import Membership from '../state/Membership'

export default class MemberList extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.confirmDelete = this.confirmDelete.bind(this)
    this.getControlForMember = this.getControlForMember.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.onClick = this.onClick.bind(this)

    this.state = {
      selectedId: undefined
    }

    // Internationalized text
    this.iText = defineMessages({
      cardTitle: { id: 'MemberList.title', defaultMessage: 'Membership' },
      confirmDelete: { id: 'MemberList.confirmDelete', defaultMessage: '?'}
    })
  }
  confirmDelete (e) {
    this.context.dispatch(MembershipService.commitDelete(MembershipService.getById(MembershipService.getDeletingId())))
  }
  handleToggle (e) {
    this.context.dispatch(MembershipService.editField(e.target.id, e.target.checked, MembershipService.getById(MembershipService.getEditingId())))
    e.stopPropagation()
  }
  onClick (e) {
    if (e.target.parentNode.id) {
      this.setState({
        selectedId: this.state.selectedId !== e.target.parentNode.id ? e.target.parentNode.id : undefined
      })
    }
  }
  getControlForMember(member) {
    if (MembershipService.getEditingId() === member.getId()) {
      return <Input type="checkbox" name="is_admin" id="is_admin"
              checked={member.getIsAdmin()}
              onChange={this.handleToggle} />
    } else {
      return member.getIsAdmin() ? <i className="fas fa-check" /> : ""
    }
  }
  render () {
    const deletingId = MembershipService.getDeletingId()
    let formatMessage = this.context.intl.formatMessage
    const headerRow = this.props.listType === "Users"
      ? <tr>
          {deletingId && <th>{formatMessage(this.iText.confirmDelete)}</th>}
          <th>{formatMessage(User.msgs.firstNameLabel)}</th>
          <th>{formatMessage(User.msgs.lastNameLabel)}</th>
          <th>{formatMessage(User.msgs.usernameLabel)}</th>
          <th>{formatMessage(Membership.msgs.isAdminLabel)}</th>
          <th>{formatMessage(Membership.msgs.isOwnerLabel)}</th>
        </tr>
      : <tr>
          {deletingId && <th>{formatMessage(this.iText.confirmDelete)}</th>}
          <th>{formatMessage(Group.msgs.nameLabel)}</th>
          <th>{formatMessage(Group.msgs.gidLabel)}</th>
          <th>{formatMessage(Membership.msgs.isAdminLabel)}</th>
          <th>{formatMessage(Membership.msgs.isOwnerLabel)}</th>
        </tr>
    const rows = []
    if (this.props.list) {
      this.props.list.forEach((membership, itemId) => {
        let item = this.props.listType === "Users"
          ? UserService.getById(itemId)
          : GroupService.getById(itemId)
        const memberId = membership.getId()
        rows.push(
          this.props.listType === "Users"
            ? <tr key={memberId} id={memberId} onClick={this.onClick} className={memberId === this.state.selectedId ? "selectedRow" : undefined}>
                {deletingId && (deletingId === memberId ? <td><i className="fa fa-trash fa-pl" style={{color: 'red'}} onClick={this.confirmDelete}></i></td> : <td></td>)}
                <td>{item.getFirstName()}</td>
                <td>{item.getLastName()}</td>
                <td>{item.getUsername()}</td>
                <td>{this.getControlForMember(membership)}</td>
                <td>{membership.getIsOwner() ? <i className="fas fa-check" /> : ""}</td>
              </tr>
            : <tr key={memberId} id={memberId} onClick={this.onClick} className={memberId === this.state.selectedId ? "selectedRow" : undefined}>
                {deletingId && (deletingId === memberId ? <td><i className="fa fa-trash fa-pl" style={{color: 'red'}} onClick={this.confirmDelete}></i></td> : <td></td>)}
                <td>{item.getName()}</td>
                <td>{item.getGid()}</td>
                <td>{this.getControlForMember(membership)}</td>
                <td>{membership.getIsOwner() ? <i className="fas fa-check" /> : ""}</td>
              </tr>
        )
      })
    }
    return (
      <ActiveCard title={formatMessage(this.iText.cardTitle)}
                  service={MembershipService}
                  selectedId={this.state.selectedId}
                  allowAdd={false}>
        <Form>
          <Table>
            <thead>
              {headerRow}
            </thead>
            <tbody>
              {rows}
            </tbody>
          </Table>
        </Form>
      </ActiveCard>
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
