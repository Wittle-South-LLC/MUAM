/* UserAdmin.jsx - User administration */
import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'

export default class UserAdmin extends React.Component {
  constructor (props, context) {
    super(props, context)
  }
  render () {
    return (
      <p>UserAdmin</p>
    )
  }
}

UserAdmin.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object.isRequired,
  router: PropTypes.object
}
