import React from 'react';
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { Navbar, Button, Nav, NavItem, NavLink } from 'reactstrap';
import { intlShape, defineMessages } from 'react-intl'

export default class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.iText = defineMessages({
      logoutLink: { id: 'Navigation.logoutLink', defaultMessage: 'Logout' },
    })
  }
  render(){
    let formatMessage = this.context.intl.formatMessage
    return (
      <Navbar color="light" light className="navbar shadow-sm p-3 mb-5 bg-white rounded" expand="md">
        <Button color="info" onClick={this.props.toggle}>
          <FontAwesomeIcon icon={faAlignLeft}/>
        </Button>
        {this.props.logout && <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink onClick={this.props.logout}>{formatMessage(this.iText.logoutLink)}</NavLink>
          </NavItem>
        </Nav>}
      </Navbar>
    )
  }
}

Navigation.contextTypes = {
  intl: intlShape.isRequired
}

Navigation.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  logout: PropTypes.func
}


