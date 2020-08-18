// @flow
import React from "react"

import { Dialog } from "@material-ui/core"

import TodoForm from "../todoItem/styled/todoForm"
import TodoItemModel from "../../shared/models/todoItem"

import ModalStorage from "../../shared/storage/modalStorage"
import StorageContext from "../../shared/storageContext"

type Props = {
  show: boolean,
  onClose: () => void,
  onAddTodoItem: (todoItem: TodoItemModel) => void,
  todoItemAttrs?: Object
}

const AddTodo = (props: Props) => {
  const todoItem = new TodoItemModel(props.todoItemAttrs || {})
  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  modalStorage.setModalIsOpen(props.show, "addTodo")

  const onChange = (addedTodoItem: TodoItemModel) => {
    props.onClose()
    props.onAddTodoItem(addedTodoItem)
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={props.show} onClose={props.onClose}>
      <TodoForm
        title="Add todo"
        todoItem={todoItem}
        onChange={onChange}
        onClose={props.onClose}
        showDelete={false}
      />
    </Dialog>
  )
}

export default AddTodo
