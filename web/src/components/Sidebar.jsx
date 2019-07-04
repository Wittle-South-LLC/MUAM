import React from 'react';
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faHome, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import { NavItem, NavLink, Nav } from 'reactstrap'
import { intlShape, defineMessages } from 'react-intl'
import classNames from 'classnames'
import './Sidebar.css'

export default class Sidebar extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onClick = this.onClick.bind(this)
    this.iText = defineMessages({
      title: { id: 'Sidebar.title', defaultMessage: 'MUAM' },
      groupsLink: { id: 'Sidebar.groupsLink', defaultMessage: 'Groups' },
      homeLink: { id: 'Sidebar.homeLink', defaultMessage: 'Home' },
      showStateLink: { id: 'Sidebar.showStateLink', defaultMessage: 'Show State' },
      usersLink: { id: 'Sidebar.usersLink', defaultMessage: 'Users' },
    })
  }
  onClick(e) {
    var newPath = e.target
    while (newPath && !newPath.id ) {
      newPath = newPath.parentNode
    }
    if (newPath) { 
      this.context.router.history.push(newPath.id)
    }
    if (!this.props.isOpen) {
      this.props.toggle()
    }
    e.preventDefault()
  }
  render() {
    let formatMessage = this.context.intl.formatMessage
    return (
      <div className={classNames('sidebar', {'is-open': this.props.isOpen})}>
        <div className="sidebar-header">
          <a color="info" onClick={this.props.toggle} style={{color: '#fff'}} href="/#">&times;</a>
          { !this.props.isOpen ? <h3>{formatMessage(this.iText.title)}</h3> : <div className="closed">{formatMessage(this.iText.title)}</div> }
        </div>
          <Nav vertical>
            <NavItem>
              <NavLink id="/home" onClick={this.onClick}>
                <FontAwesomeIcon icon={faHome} className="mr-2"/>
                <span id="/home">{formatMessage(this.iText.homeLink)}</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink id="/groups" onClick={this.onClick}>
                <FontAwesomeIcon icon={faUsers} className="mr-2"/>
                <span id="/groups">{formatMessage(this.iText.groupsLink)}</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink id="/users" onClick={this.onClick}>
                <FontAwesomeIcon icon={faUser} className="mr-2"/>
                <span id="/users">{formatMessage(this.iText.usersLink)}</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink id="/showstate" onClick={this.onClick}>
                <FontAwesomeIcon icon={faDatabase} className="mr-2"/>
                <span id="/showstate">{formatMessage(this.iText.showStateLink)}</span>
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
