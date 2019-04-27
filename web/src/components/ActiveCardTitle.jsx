import React from 'react'
import PropTypes from 'prop-types'
import { CardTitle } from 'reactstrap'

export default class ActiveCardTitle extends React.Component {
  render () {
    return (
      <CardTitle className="iconCardHeader">
        {this.props.children}
        {this.props.onAdd && <i className="fa fa-plus fa-pl fa-pull-right" onClick={this.props.onAdd}></i>}
        {this.props.onCancel && <i className="fa fa-undo fa-pl fa-pull-right" onClick={this.props.onCancel}></i>}
        {this.props.onDelete && <i className="fa fa-trash fa-pl fa-pull-right" onClick={this.props.onDelete}></i>}
        {this.props.onEdit && <i className="fa fa-edit fa-pl fa-pull-right" onClick={this.props.onEdit}></i>}
        {this.props.onSave && <i className="fa fa-save fa-pl fa-pull-right" onClick={this.props.onSave}></i>}
      </CardTitle>
    )
  }
}

ActiveCardTitle.propTypes = {
  onAdd: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func
}

