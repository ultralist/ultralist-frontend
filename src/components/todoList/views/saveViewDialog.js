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

import StorageContext from "../../../shared/storageContext"
import ModalStorage from "../../../shared/storage/modalStorage"

import BackendContext from "../../../shared/backendContext"
import ViewsBackend from "../../../shared/backend/viewsBackend"
import UserBackend from "../../../shared/backend/userBackend"

import UserContext from "../../utils/userContext"
import TodoListContext from "../../utils/todoListContext"

type Props = {
  isOpen: boolean,
  todoListUUID: string,
  onClose: () => void
}

const useStyles = makeStyles({
  icon: {
    color: "#fff !important" // TODO: make this use theme
  },
  margin: {
    width: "100%"
  }
})

const SaveView = (props: Props) => {
  const classes = useStyles()

  const { user, setUser } = React.useContext(UserContext)
  const { todoList, setTodoList, view } = React.useContext(TodoListContext)

  const [viewName, setViewName] = React.useState(view.name)

  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  const viewsBackend = new ViewsBackend(
    user.token,
    React.useContext(BackendContext)
  )
  const userBackend = new UserBackend(
    user.token,
    React.useContext(BackendContext)
  )

  modalStorage.setModalIsOpen(props.show, "createViewDialog")

  const onSaveView = () => {
    if (view.name === viewName) {
      viewsBackend.updateView(view).then(() => {
        props.enqueueSnackbar("View updated!")
        userBackend.getUser().then(setUser)
        props.onClose()
      })
    } else {
      const filter = view
      filter.name = viewName
      filter.todoListUUID = props.todoListUUID
      todoList.views.push(filter)
      viewsBackend.createView(filter).then(() => {
        props.enqueueSnackbar("View created!")
        userBackend.getUser().then(setUser)
        props.onClose()
      })
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.isOpen}>
      <DialogTitle>Save view</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To overwrite the existing view, keep the same name.
        </DialogContentText>
        <TextField
          label="Name"
          required
          margin="dense"
          autoFocus
          value={viewName}
          onChange={ev => setViewName(ev.target.value)}
          className={classes.margin}
          autoComplete="off"
        />
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onSaveView}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default withSnackbar(SaveView)
