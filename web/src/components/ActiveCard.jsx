import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody } from 'reactstrap'
import ActiveCardTitle from './ActiveCardTitle'

export default class ActiveCard extends React.Component {
  constructor (props, context) {
    super(props, context)

    // Component method bindings
    this.onAdd = this.onAdd.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onDelStart = this.onDelStart.bind(this)
    this.onDelFinish = this.onDelFinish.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSave = this.onSave.bind(this)

  }
  onAdd (e) {
    this.context.dispatch(this.props.service.createNew())
  }
  onCancel (e) {
    if (this.props.service.isCreating()) {
      this.context.dispatch(this.props.service.cancelNew())
    } else if (this.props.service.isEditing()) {
      this.context.dispatch(this.props.service.cancelEdit())
    } else if (this.props.service.isDeleting()) {
      this.context.dispatch(this.props.service.cancelDelete())
    }
  }
  onDelStart () {
    this.context.dispatch(this.props.service.startDelete(this.props.service.getById(this.props.selectedId)))
  }
  onDelFinish () {
    this.context.dispatch(this.props.service.commitDelete(this.props.service.getById(this.props.selectedId)))
  }
  onEdit () {
    this.context.dispatch(this.props.service.startEdit(this.props.service.getById(this.props.selectedId)))
  }
  onSave () {
    if (this.props.service.isCreating()) {
      const obj = this.props.service.getCreating()
      try {
        this.context.dispatch(this.props.service.saveNew(obj))
      } catch (e) {
        console.log('Caught error: ', e)
      }
    } else if (this.props.service.isEditing()) {
      const obj = this.props.service.getById(this.props.selectedId)
      this.context.dispatch(this.props.service.saveUpdate(obj))
    }
  }
  render () {
    const showAdd = !this.props.selectedId && this.props.allowAdd ? true : undefined
    const showCancel = this.props.service.isCreating() || this.props.service.isEditing() || this.props.service.isDeleting() ? true : undefined
    const showDelete = this.props.selectedId && !this.props.service.isEditing() && !this.props.service.isCreating() && !this.props.service.isDeleting() ? true : undefined
    const showEdit = this.props.selectedId && !this.props.service.isCreating() && !this.props.service.isEditing() && !this.props.service.isDeleting() ? true : undefined
    const showSave = this.props.service.isCreating() || this.props.service.isEditing() ? true : undefined
    return (
      <Card>
        <CardBody>
          <ActiveCardTitle onAdd={showAdd && this.onAdd}
                           onCancel={showCancel && this.onCancel}
                           onDelete={showDelete && this.onDelStart}
                           onEdit={showEdit && this.onEdit}
                           onSave={showSave && this.onSave}
          >
            {this.props.title}
          </ActiveCardTitle>
          {this.props.children}
        </CardBody>
      </Card>
    )
  }
}

ActiveCard.propTypes = {
  allowAdd: PropTypes.bool,
  service: PropTypes.object.isRequired,
  selectedId: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

ActiveCard.defaultProps = {
  allowAdd: true
}

ActiveCard.contextTypes = {
  dispatch: PropTypes.func
}
