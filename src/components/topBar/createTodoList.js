// @flow
import React from "react"

import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

import { makeStyles } from "@material-ui/styles"

import TodoListModel from "../../shared/models/todoList"

type Props = {
  onCreateTodoList: (newList: TodoListModel) => void,
  onClose: () => void,
  isOpen: boolean
}

const useStyles = makeStyles(theme => {
  return {
    icon: {
      color: "#fff !important" // TODO: make this use theme
    },
    margin: {
      marginLeft: 20,
      width: "90%"
    }
  }
})

const nameRef = React.createRef()

const CreateTodoList = (props: Props) => {
  const classes = useStyles()
  const onCreateList = () => {
    const newList = new TodoListModel({ name: nameRef.current.value })
    props.onCreateTodoList(newList)
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.isOpen}>
      <DialogTitle>Create New Todolist</DialogTitle>
      <TextField
        label="Name"
        margin="dense"
        autoFocus
        className={classes.margin}
        autoComplete="off"
        inputRef={nameRef}
      />

      <DialogActions>
        <Button color="primary" onClick={onCreateList}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateTodoList
