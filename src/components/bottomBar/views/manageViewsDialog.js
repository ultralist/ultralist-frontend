// @flow
import React from "react"
import { withSnackbar } from "notistack"

import {
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogActions,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from "@material-ui/core"

import { DeleteOutlined as DeleteIcon } from "@material-ui/icons"

import UserModel from "../../../shared/models/user"

import StorageContext from "../../../shared/storageContext"
import ModalStorage from "../../../shared/storage/modalStorage"
import UserStorage from "../../../shared/storage/userStorage"
import FilterModel from "../../../shared/models/filter"

import AlertDialog from "../../alertDialog"

import BackendContext from "../../../shared/backendContext"
import ViewsBackend from "../../../shared/backend/viewsBackend"
import UserBackend from "../../../shared/backend/userBackend"

type Props = {
  user: UserModel,
  views: ViewModel[],
  show: boolean,
  onClose: () => void
}

const ManageViewsDialog = (props: Props) => {
  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  const viewsBackend = new ViewsBackend(
    props.user.token,
    React.useContext(BackendContext)
  )
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)
  const [viewToDelete, setViewToDelete] = React.useState(null)
  const [views, setViews] = React.useState(
    props.views.map(v => new FilterModel(v))
  )

  const userBackend = new UserBackend(
    props.user.token,
    React.useContext(BackendContext),
    new UserStorage(React.useContext(StorageContext))
  )

  modalStorage.setModalIsOpen(props.show, "manageViews")

  const onStartDeleteView = (view: FilterModel) => {
    setViewToDelete(view)
    setShowDeleteAlert(true)
  }

  const onDeleteView = () => {
    setShowDeleteAlert(false)

    viewsBackend.deleteView(viewToDelete).then(() => {
      props.enqueueSnackbar("View deleted.")
      setViews(views.filter(v => v.id !== viewToDelete.id))
      setViewToDelete(null)
      userBackend.getUser()
    })
  }

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.show}>
        <DialogTitle>Manage views</DialogTitle>

        <List>
          {views.map((view, idx) => (
            <React.Fragment>
              <ListItem key={idx}>
                <ListItemIcon>
                  <Tooltip title="Delete this view">
                    <IconButton onClick={() => onStartDeleteView(view)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemIcon>

                <ListItemText>
                  <Typography>{view.name}</Typography>
                  {view.toFilterStrings().map(s => (
                    <Chip key={s} label={s} />
                  ))}
                </ListItemText>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <DialogActions>
          <Button color="primary" onClick={props.onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <AlertDialog
        show={showDeleteAlert}
        title="Delete this view?"
        content="Are you sure you wish to delete this view?"
        onOK={onDeleteView}
        onClose={() => setShowDeleteAlert(false)}
      />
    </React.Fragment>
  )
}

export default withSnackbar(ManageViewsDialog)
