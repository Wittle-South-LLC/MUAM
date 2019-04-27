/* GroupSearch.jsx - Search for groups */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label,
         ListGroup, ListGroupItemHeading, ListGroupItem, ListGroupItemText } from 'reactstrap'
import { defineMessages, intlShape } from 'react-intl'
import { GroupService } from '../state/OrimServices'
import Group from '../state/Group'

export default class GroupSearch extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Bind class functions
    this.onSubmit = this.onSubmit.bind(this)
    this.onDragStart = this.onDragStart.bind(this)

    // Internationalized text
    this.iText = defineMessages({
      pageTitle: { id: 'GroupSearch.title', defaultMessage: 'Group Search' },
      searchLabel: { id: 'GroupSearch.searchLabel', defaultMessage: 'Search For:' },
      searchButton: { id: 'GroupSearch.searchButton', defaultMessage: 'Search'}
    })
  }
  onDragStart (e) {
    e.dataTransfer.setData("text", e.target.id)
    e.dataTransfer.setData("type", "Group")
    e.stopPropagation()
  }
  onSubmit (e) {
    this.context.dispatch(GroupService.search(e.target.searchText.value))
    e.preventDefault()
  }
  render () {
    let formatMessage = this.context.intl.formatMessage
    let sResults = GroupService.getSearchResults()
    let sResultItems = sResults.map((sGroup) =>
      <ListGroupItem className="justify-content-between" key={sGroup.get(Group._IdentityKey)}
                     id={sGroup.get(Group._IdentityKey)} draggable={true} onDragStart={this.onDragStart}>
        <ListGroupItemHeading>
          {sGroup.get(Group._NameKey) + "  [" + sGroup.get(Group._GidKey) + "]  " }
        </ListGroupItemHeading>
        <ListGroupItemText>
          {sGroup.get(Group._DescriptionKey)}
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

GroupSearch.contextTypes = {
  dispatch: PropTypes.func,
  intl: intlShape
}
