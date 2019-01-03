// @flow
import React, { useState } from "react"

import Dialog from "@material-ui/core/Dialog"

import TodoItemModel from "../../../models/todoItem"
import TodoForm from "../../todoItem/styled/todoForm"

type Props = {
  todoItem: TodoItemModel,
  show: boolean,
  onClose: () => void,
  onEditTodo: (todoItem: TodoItemModel) => void
}

const EditTodo = (props: Props) => {
  const onChange = (todoItem: TodoItemModel) => {
    props.onClose()
    props.onEditTodo(todoItem)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={props.show} onClose={props.onClose}>
      <TodoForm
        title="Edit todo"
        todoItem={props.todoItem}
        onChange={onChange}
      />
    </Dialog>
  )
}

export default EditTodo
