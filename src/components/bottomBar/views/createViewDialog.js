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
import ViewModel from "../../../shared/models/view"
import FilterModel from "../../../shared/models/filter"

import BackendContext from "../../../shared/backendContext"
import ViewsBackend from "../../../shared/backend/viewsBackend"

type Props = {
  filter: FilterModel,
  show: boolean,
  user: UserModel,
  onClose: () => void
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

const CreateView = (props: Props) => {
  const classes = useStyles()
  const [viewName, setViewName] = React.useState("")

  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  const viewsBackend = new ViewsBackend(
    props.user.token,
    React.useContext(BackendContext)
  )

  modalStorage.setModalIsOpen(props.show)

  const onCreateView = () => {
    viewsBackend
      .createView(
        new ViewModel({
          name: viewName,
          subjectContains: props.filter.subjectContains,
          archived: props.filter.archived,
          completed: props.filter.completed,
          isPriority: props.filter.isPriority,
          due: props.filter.due,
          group: props.filter.group
        })
      )
      .then(() => {
        props.enqueueSnackbar("View created!")
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
