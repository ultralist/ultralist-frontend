// @flow
import React from "react"

import Dialog from "@material-ui/core/Dialog"

import TodoItemModel from "../../../shared/models/todoItem"
import TodoForm from "../../todoItem/styled/todoForm"

import ModalStorage from "../../../shared/storage/modalStorage"
import StorageContext from "../../../shared/storageContext"

type Props = {
  todoItem: TodoItemModel,
  show: boolean,
  onClose: () => void,
  onEditTodo: (todoItem: TodoItemModel) => void,
  onDeleteTodo: (todoItem: TodoItemModel) => void
}

const EditTodo = (props: Props) => {
  const modalStorage = new ModalStorage(React.useContext(StorageContext))

  console.log("setting modal is open to ", props.show)
  modalStorage.setModalIsOpen(props.show, "editTodoItemModal")

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
      <TodoForm
        title="Edit todo"
        todoItem={props.todoItem}
        onChange={onChange}
        onDelete={onDelete}
        onClose={props.onClose}
      />
    </Dialog>
  )
}

export default EditTodo
