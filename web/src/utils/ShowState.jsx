/* ShowState.jsx - Diagnostic component to display the current state */
import React from 'react'
import PropTypes from 'prop-types'
import { TabContent, TabPane } from 'reactstrap'

export default class ShowState extends React.Component {
  render () {
    let stateElements = [
      {key: 'clientState', label: 'Client State'},
      {key: 'Users', label: 'Users'},
      {key: 'Groups', label: 'Groups'}
    ]
    let stateView = []
    stateElements.forEach((member) => {
      if (!this.context.reduxState.get(member.key)) {
        console.log('this.context.state.get(%s) is undefined!', member.key)
      } else {
        stateView.push(
          <TabPane key={member.key}>
              <pre>{JSON.stringify(this.context.reduxState.get(member.key).toJS(), undefined, 4)}</pre>
          </TabPane>
        )
      }
    })
    return (
      <TabContent>
        {stateView}
      </TabContent>
    )
  }
}

ShowState.contextTypes = {
  reduxState: PropTypes.object
}
