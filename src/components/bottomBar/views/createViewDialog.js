// @flow
import React from "react"
import { withSnackbar } from "notistack"

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField
} from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"

import StorageContext from "../../../shared/storageContext"
import ModalStorage from "../../../shared/storage/modalStorage"

import UserModel from "../../../shared/models/user"
import FilterModel from "../../../shared/models/filter"

import BackendContext from "../../../shared/backendContext"
import ViewsBackend from "../../../shared/backend/viewsBackend"
import UserBackend from "../../../shared/backend/userBackend"
import UserContext from "../../utils/userContext"

type Props = {
  filter: FilterModel,
  todoListUUID: string,
  show: boolean,
  onClose: () => void
}

const useStyles = makeStyles({
  icon: {
    color: "#fff !important" // TODO: make this use theme
  },
  margin: {
    marginLeft: 20,
    width: "90%"
  }
})

const CreateView = (props: Props) => {
  const classes = useStyles()
  const [viewName, setViewName] = React.useState("")
  const { user, setUser } = React.useContext(UserContext)

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

  const onCreateView = () => {
    props.filter.name = viewName
    props.filter.todoListUUID = props.todoListUUID
    viewsBackend.createView(props.filter).then(() => {
      props.enqueueSnackbar("View created!")
      setViewName("")
      userBackend.getUser().then(setUser)
      props.onClose()
    })
  }

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.show}>
        <DialogTitle>Create view</DialogTitle>
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

        <DialogActions>
          <Button color="primary" onClick={onCreateView}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default withSnackbar(CreateView)
