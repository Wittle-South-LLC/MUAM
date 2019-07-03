/* Home.jsx - Main page for group administration */
import React from 'react'
import PropTypes from 'prop-types'
import { intlShape} from 'react-intl'
import { Col, Row } from 'reactstrap'
import { loggedInUser } from './state/clientState'
import { UserService } from './state/OrimServices'
import User from './state/User'
import Login from './users/Login'

export default class Home extends React.Component {
  render () {
    const lUser = loggedInUser(this.context.reduxState)
    const fullUser = lUser ? UserService.getById(lUser.getId()) : undefined
    const homeContent = fullUser ? <p>Welcome {fullUser.getFirstName()}!</p> : <p>Home</p>
    return (
      <div>
        { loggedInUser(this.context.reduxState) !== undefined
          ? homeContent
          : <Row>
              <Col sm={{ size: 4, offset: 4}}>
                <Login userService={UserService} userMsgs={User.msgs}/>
              </Col>
            </Row>
        }
      </div>
    )
  }
}

Home.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape,
  reduxState: PropTypes.object.isRequired,
  router: PropTypes.object
}
