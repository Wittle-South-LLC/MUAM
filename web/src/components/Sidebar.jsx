import React from 'react';
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faHome, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavItem, NavLink, Nav } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom'
import { intlShape, defineMessages } from 'react-intl'
import classNames from 'classnames'
import './Sidebar.css'

export default class Sidebar extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.iText = defineMessages({
      title: { id: 'Sidebar.title', defaultMessage: 'Sidebar' },
      groupsLink: { id: 'Sidebar.groupsLink', defaultMessage: 'Groups' },
      homeLink: { id: 'Sidebar.homeLink', defaultMessage: 'Home' },
      showStateLink: { id: 'Sidebar.showStateLink', defaultMessage: 'Show State' },
      usersLink: { id: 'Sidebar.usersLink', defaultMessage: 'Users' },
    })
  }
  render() {
    let formatMessage = this.context.intl.formatMessage
    return (
      <div className={classNames('sidebar', {'is-open': this.props.isOpen})}>
        <div className="sidebar-header">
          <a color="info" onClick={this.props.toggle} style={{color: '#fff'}}>&times;</a>
          <h3>{formatMessage(this.iText.title)}</h3>
        </div>
          <Nav vertical>
            <NavItem>
              <NavLink tag={ RRNavLink } exact to="/home">
                <FontAwesomeIcon icon={faHome} className="mr-2"/>
                {formatMessage(this.iText.homeLink)}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ RRNavLink } exact to="/groups">
                <FontAwesomeIcon icon={faUsers} className="mr-2"/>
                {formatMessage(this.iText.groupsLink)}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ RRNavLink } exact to="/users">
                <FontAwesomeIcon icon={faUser} className="mr-2"/>
                {formatMessage(this.iText.usersLink)}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={ RRNavLink } exact to="/showstate">
                <FontAwesomeIcon icon={faDatabase} className="mr-2"/>
                {formatMessage(this.iText.showStateLink)}
              </NavLink>
            </NavItem>
          </Nav>
      </div>
    )
  }
}

Sidebar.contextTypes = {
  intl: intlShape.isRequired,
  router: PropTypes.object
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired
}
