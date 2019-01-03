// @flow
import React, { useState } from "react"

import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import Dialog from "@material-ui/core/Dialog"

import TodoForm from "../todoItem/styled/todoForm"
import TodoItemModel from "../../models/todoItem"

type Props = {
  onAddTodoItem: (todoItem: TodoItemModel) => void
}

const AddTodo = (props: Props) => {
  const [modalOpen, setModalOpen] = useState(false)
  const todoItem = new TodoItemModel({})

  const toggleModalOpen = () => {
    setModalOpen(!modalOpen)
  }

  const onChange = (todoItem: TodoItemModel) => {
    setModalOpen(false)
    props.onAddTodoItem(todoItem)
  }

  return (
    <React.Fragment>
      <Fab onClick={toggleModalOpen} color="primary">
        <AddIcon />
      </Fab>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={modalOpen}
        onClose={toggleModalOpen}
      >
        <TodoForm title="Add todo" todoItem={todoItem} onChange={onChange} />
      </Dialog>
    </React.Fragment>
  )
}

export default AddTodo
