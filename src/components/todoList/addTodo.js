// @flow
import React, { useState } from "react"
import { makeStyles } from "@material-ui/styles"

import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import Dialog from "@material-ui/core/Dialog"
import Tooltip from "@material-ui/core/Tooltip"

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
  const classes = useStyles()
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
      <Fab onClick={toggleModalOpen} className={classes.fab}>
        <Tooltip disableFocusListener={true} title="Create new todo">
          <AddIcon />
        </Tooltip>
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
