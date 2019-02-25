/* GroupAdmin.jsx - Main page for group administration */
import React from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'

export default class GroupAdmin extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Message components
    this.componentText = defineMessages({
      pageTitle: { id: 'GroupAdmin.title', defaultMessage: 'Group Administration' }
    })
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    return (
      <p>{formatMessage(this.componentText.pageTitle)}</p>
    )
  }
}

GroupAdmin.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object.isRequired,
  router: PropTypes.object
}
