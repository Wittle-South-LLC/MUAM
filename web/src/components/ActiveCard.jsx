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

    // State
    this.state = {
      adding: this.props.service.isCreating(),
      deleting: this.props.service.isDeleting(),
      editing: this.props.service.isEditing()
    }
  }
  onAdd (e) {
    this.setState({
      adding: true
    })
    this.context.dispatch(this.props.service.createNew())
  }
  onCancel (e) {
    if (this.state.adding) {
      this.context.dispatch(this.props.service.cancelNew())
    } else if (this.state.editing) {
      this.context.dispatch(this.props.service.cancelEdit())
    } else if (this.state.deleting) {
      this.context.dispatch(this.props.service.cancelDelete())
    }
    this.setState({
      adding: false,
      deleting: false,
      editing: false
    })
  }
  onDelStart () {
    this.context.dispatch(this.props.service.startDelete(this.props.selectedId))
    this.setState({
      deleting: true
    })
  }
  onDelFinish () {
    this.context.dispatch(this.props.service.deleteId(this.props.selectedId))
    this.setState({
      deleting: false
    })
  }
  onEdit () {
    this.context.dispatch(this.props.service.startEdit(this.props.selectedId))
    this.setState({
      editing: true
    })
  }
  onSave () {
    if (this.state.adding) {
      const obj = this.props.service.getCreating()
      try {
        this.context.dispatch(this.props.service.saveNew(obj))
      } catch (e) {
        console.log('Caught error: ', e)
      }
    } else if (this.state.editing) {
      const obj = this.props.service.getById(this.props.selectedId)
      this.context.dispatch(this.props.service.saveUpdate(obj))
    }
    this.setState({
      editing: false,
      adding: false
    })
  }
  render () {
    const showAdd = !this.props.selectedId ? true : undefined
    const showCancel = this.state.adding || this.state.editing || this.state.deleting ? true : undefined
    const showDelete = this.props.selectedId && !this.state.editing && !this.state.adding && !this.state.deleting ? true : undefined
    const showEdit = this.props.selectedId && !this.state.adding && !this.state.editing && !this.state.deleting ? true : undefined
    const showSave = this.state.adding || this.state.editing ? true : undefined
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
  service: PropTypes.object.isRequired,
  selectedId: PropTypes.string,
  title: PropTypes.string
}

ActiveCard.contextTypes = {
  dispatch: PropTypes.func
}
