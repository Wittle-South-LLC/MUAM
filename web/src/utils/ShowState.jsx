/* ShowState.jsx - Diagnostic component to display the current state */
import React from 'react'
import PropTypes from 'prop-types'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

export default class ShowState extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeKey: 'Users'
    }
    this.toggle = this.toggle.bind(this)
  }
  toggle(key) {
    this.setState({
      activeKey: key
    })
  }
  render () {
    let stateElements = [
      {key: 'clientState', label: 'Client State'},
      {key: 'Users', label: 'Users'},
      {key: 'Memberships', label: 'Memberhips'},
      {key: 'Groups', label: 'Groups'}
    ]
    let stateView = []
    let navView = []
    stateElements.forEach((member) => {
      if (!this.context.reduxState.get(member.key)) {
        console.log('this.context.reduxState.get(%s) is undefined!', member.key)
      } else {
        navView.push(
          <NavItem key={member.key}>
            <NavLink onClick={() => this.toggle(member.key)} active={this.state.activeKey === member.key}>{member.key}</NavLink>
          </NavItem>
        )
        stateView.push(
          <TabPane key={member.key} tabId={member.key}>
              <pre>{JSON.stringify(this.context.reduxState.get(member.key).toJS(), undefined, 4)}</pre>
          </TabPane>
        )
      }
    })
    return (
      <div>
        <Nav tabs={true}>
          {navView}
        </Nav>
        <TabContent activeTab={this.state.activeKey}>
          {stateView}
        </TabContent>
      </div>
    )
  }
}

ShowState.contextTypes = {
  reduxState: PropTypes.object
}
