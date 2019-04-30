/* UserSearch.jsx - Search for users */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label,
         ListGroup, ListGroupItemHeading, ListGroupItem, ListGroupItemText } from 'reactstrap'
import { defineMessages, intlShape } from 'react-intl'
import { UserService } from '../state/OrimServices'
import User from '../state/User'

export default class UserSearch extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Bind class functions
    this.onSubmit = this.onSubmit.bind(this)
    this.onDragStart = this.onDragStart.bind(this)

    // Internationalized text
    this.iText = defineMessages({
      pageTitle: { id: 'UserSearch.title', defaultMessage: 'User Search' },
      searchLabel: { id: 'UserSearch.searchLabel', defaultMessage: 'Search For:' },
      searchButton: { id: 'UserSearch.searchButton', defaultMessage: 'Search'}
    })
  }
  onDragStart (e) {
    e.dataTransfer.setData("text", e.target.id)
    e.dataTransfer.setData("type", "User")
    e.stopPropagation()
  }
  onSubmit (e) {
    this.context.dispatch(UserService.search(e.target.searchText.value))
    e.preventDefault()
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    let sResults = UserService.getSearchResults()
    let sResultItems = sResults.map((sUser) =>
      <ListGroupItem className="justify-content-between" key={sUser.get(User._IdentityKey)}
                     id={sUser.get(User._IdentityKey)} draggable={true} onDragStart={this.onDragStart}>
        <ListGroupItemHeading>
          {sUser.get(User._UsernameKey)}
        </ListGroupItemHeading>
        <ListGroupItemText>
          {sUser.get(User._FullNameKey)}
        </ListGroupItemText>
      </ListGroupItem>
    )
    return (
      <Card>
        <CardBody>
          <CardTitle>{formatMessage(this.iText.pageTitle)}</CardTitle>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="searchText">{formatMessage(this.iText.searchLabel)}</Label>
              <Input type="text" id="searchText" name="searchText" />
              <Button type="submit">{formatMessage(this.iText.searchButton)}</Button>
            </FormGroup>
          </Form>
        <ListGroup>
          {sResultItems}
        </ListGroup>
        </CardBody>
      </Card>
    )
  }
}

UserSearch.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape
}
