import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Container } from 'reactstrap'
import Navigation from './Navigation'
import './Content.css'

export default class Content extends React.Component {

  render() {
    return (
      <Container fluid className={classNames('content', {'is-open': this.props.isOpen})}>
        <Navigation
          toggle={this.props.toggle}
          isOpen={this.props.isOpen}
          logout={this.props.logout} />
        {this.props.children}
      </Container>
    );
  }
}

Content.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  logout: PropTypes.func
}
