// @flow
import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/styles"

import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import Dialog from "@material-ui/core/Dialog"
import Tooltip from "@material-ui/core/Tooltip"

import Storage from "../../backend/storage"
import TodoForm from "../todoItem/styled/todoForm"
import TodoItemModel from "../../models/todoItem"

type Props = {
  onAddTodoItem: (todoItem: TodoItemModel) => void
}

const useStyles = makeStyles({
  fab: {
    position: "fixed",
    zIndex: 1101,
    bottom: 30,
    left: 0,
    right: 0,
    margin: "0 auto"
  }
})

const AddTodo = (props: Props) => {
  const storage = new Storage()
  const classes = useStyles()
  const [modalOpen, setModalOpen] = useState(false)
  const todoItem = new TodoItemModel({})

  storage.setModalIsOpen(modalOpen)

  const toggleModalOpen = () => {
    setModalOpen(!modalOpen)
  }

  const onChange = (todoItem: TodoItemModel) => {
    setModalOpen(false)
    props.onAddTodoItem(todoItem)
  }

  const onKeypress = event => {
    if (event.keyCode === 97 && !storage.isModalOpen()) {
      setTimeout(() => setModalOpen(true), 10)
    }
    return false
  }

  useEffect(() => {
    document.addEventListener("keypress", onKeypress)

    return () => {
      document.removeEventListener("keypress", onKeypress)
    }
  }, [])

  return (
    <React.Fragment>
      <Fab onClick={toggleModalOpen} className={classes.fab}>
        <Tooltip disableFocusListener={true} title="Create new todo">
          <AddIcon />
        </Tooltip>
      </Fab>
      <Dialog fullWidth maxWidth="sm" open={modalOpen} onClose={toggleModalOpen}>
        <TodoForm title="Add todo" todoItem={todoItem} onChange={onChange} showDelete={false} />
      </Dialog>
    </React.Fragment>
  )
}

export default AddTodo
