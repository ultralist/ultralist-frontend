// @flow
import React from "react"

import Dialog from "@material-ui/core/Dialog"

import TodoItemModel from "../../../models/todoItem"
import TodoForm from "../../todoItem/styled/todoForm"

type Props = {
  todoItem: TodoItemModel,
  show: boolean,
  onClose: () => void,
  onEditTodo: (todoItem: TodoItemModel) => void,
  onDeleteTodo: (todoItem: TodoItemModel) => void
}

const EditTodo = (props: Props) => {
  const onChange = (todoItem: TodoItemModel) => {
    props.onClose()
    props.onEditTodo(todoItem)
  }

  const onDelete = (todoItem: TodoItemModel) => {
    props.onClose()
    props.onDeleteTodo(todoItem)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={props.show} onClose={props.onClose}>
      <TodoForm title="Edit todo" todoItem={props.todoItem} onChange={onChange} onDelete={onDelete} onClose={props.onClose} />
    </Dialog>
  )
}

export default EditTodo
