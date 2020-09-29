// @flow
import React from "react"
import { withSnackbar } from "notistack"

import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  TextField
} from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"

import TodoListModel from "../../shared/models/todoList"

import StorageContext from "../../shared/storageContext"
import ModalStorage from "../../shared/storage/modalStorage"

import UserContext from "../utils/userContext"
import BackendContext from "../../shared/backendContext"
import TodoListBackend from "../../shared/backend/todoListBackend"
import UserBackend from "../../shared/backend/userBackend"

type Props = {
  todoList: TodoListModel,
  isOpen: boolean,
  onClose: () => void
}

const useStyles = makeStyles({
  textField: {
    width: "100%"
  },
  marginTop: {
    marginTop: 20
  }
})

const ManageTodolistDialog = (props: Props) => {
  const classes = useStyles()
  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  const [todoListName, setTodoListName] = React.useState(props.todoList.name)

  const { user, setUser } = React.useContext(UserContext)

  const todoListBackend = new TodoListBackend(
    user.token,
    React.useContext(BackendContext)
  )
  const userBackend = new UserBackend(
    user.token,
    React.useContext(BackendContext)
  )

  modalStorage.setModalIsOpen(props.isOpen, "ManageTodolistDialog")

  const onSaveTodolist = () => {
    if (todoListName === props.todoList.name) {
      props.onClose()
      return
    }
    todoListBackend
      .updateTodoListName(props.todoList.uuid, todoListName)
      .then(() => {
        props.enqueueSnackbar("Todo list updated!")
        userBackend.getUser().then(setUser)
        props.onClose()
      })
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.isOpen}>
      <DialogTitle>Manage todolist</DialogTitle>
      <DialogContent>
        <DialogContentText>Rename or delete this todolist.</DialogContentText>
        <TextField
          label="Name"
          required
          margin="dense"
          autoFocus
          value={todoListName}
          onChange={ev => setTodoListName(ev.target.value)}
          className={classes.textField}
          autoComplete="off"
        />
        <div className={classes.marginTop}>
          <Button variant="contained" color="secondary">
            Delete this todolist
          </Button>
        </div>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={props.onClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={onSaveTodolist}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default withSnackbar(ManageTodolistDialog)
