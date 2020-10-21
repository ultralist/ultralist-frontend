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
import TodoListContext from "../utils/todoListContext"
import BackendContext from "../../shared/backendContext"
import TodoListBackend from "../../shared/backend/todoListBackend"
import UserBackend from "../../shared/backend/userBackend"

import AlertDialog from "../alertDialog"

type Props = {
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
  const nameRef = React.useRef(null)

  const { user, setUser } = React.useContext(UserContext)
  const { todoList, setTodoList } = React.useContext(TodoListContext)

  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)

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
    if (nameRef.current.value === todoList.name) {
      props.onClose()
      return
    }

    todoList.setName(nameRef.current.value)
    todoList.name = nameRef.current.value
    setTodoList(todoList)
    props.enqueueSnackbar("Todo list updated!")
    props.onClose()
  }

  const onDeleteTodoList = () => {
    setTodoList(null)
    props.enqueueSnackbar("Todo list deleted!")
    props.onClose()
  }

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={props.onClose}
        open={props.isOpen}
      >
        <DialogTitle>Manage todolist</DialogTitle>
        <DialogContent>
          <DialogContentText>Rename or delete this todolist.</DialogContentText>
          <TextField
            label="Name"
            inputRef={nameRef}
            required
            margin="dense"
            autoFocus
            defaultValue={todoList.name}
            className={classes.textField}
            autoComplete="off"
          />
          <div className={classes.marginTop}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setShowDeleteAlert(true)}
            >
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
      <AlertDialog
        show={showDeleteAlert}
        title="Delete this todo list?"
        content="Are you sure you wish to delete this todo list?"
        showCancel
        onOK={onDeleteTodoList}
        onClose={() => setShowDeleteAlert(false)}
      />
    </React.Fragment>
  )
}

export default withSnackbar(ManageTodolistDialog)
