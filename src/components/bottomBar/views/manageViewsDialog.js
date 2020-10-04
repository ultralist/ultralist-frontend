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
  ListItemText,
  Tooltip,
  Typography
} from "@material-ui/core"

import {
  DeleteOutlined as DeleteIcon,
  StarBorder as SetDefaultIcon,
  Star as IsDefaultIcon
} from "@material-ui/icons"

import StorageContext from "../../../shared/storageContext"
import ModalStorage from "../../../shared/storage/modalStorage"
import FilterModel from "../../../shared/models/filter"

import AlertDialog from "../../alertDialog"

import BackendContext from "../../../shared/backendContext"
import ViewsBackend from "../../../shared/backend/viewsBackend"
import UserBackend from "../../../shared/backend/userBackend"
import UserContext from "../../utils/userContext"
import TodoListContext from "../../utils/todoListContext"

type Props = {
  show: boolean,
  onClose: () => void
}

const ManageViewsDialog = (props: Props) => {
  const { todoList, setTodoList } = React.useContext(TodoListContext)
  const { user, setUser } = React.useContext(UserContext)
  const modalStorage = new ModalStorage(React.useContext(StorageContext))
  const viewsBackend = new ViewsBackend(
    user.token,
    React.useContext(BackendContext)
  )
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)
  const [viewToDelete, setViewToDelete] = React.useState(null)

  const userBackend = new UserBackend(
    user.token,
    React.useContext(BackendContext)
  )

  modalStorage.setModalIsOpen(props.show, "manageViews")

  const onStartDeleteView = (view: FilterModel) => {
    setViewToDelete(view)
    setShowDeleteAlert(true)
  }

  const onDeleteView = () => {
    setShowDeleteAlert(false)

    viewsBackend.deleteView(viewToDelete).then(() => {
      const newViews = todoList.views.filter(v => v.id !== viewToDelete.id)
      todoList.views = newViews
      setTodoList(todoList)
      setViewToDelete(null)
      userBackend.getUser().then(setUser)
      props.enqueueSnackbar("View deleted.")
    })
  }

  const onSetDefault = (view: FilterModel) => {
    todoList.views.forEach(v => (v.isDefault = false))
    const arrayView = todoList.views.find(v => v.id === view.id)
    arrayView.isDefault = true
    setTodoList(todoList)
    viewsBackend.updateView(arrayView).then(() => {
      props.enqueueSnackbar("Default view updated.")
      userBackend.getUser().then(setUser)
    })
  }

  const views = todoList.views.map(v => new FilterModel(v))

  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" onClose={props.onClose} open={props.show}>
        <DialogTitle>Manage views</DialogTitle>

        <List>
          {views.map((view, idx) => (
            <React.Fragment key={idx}>
              <ListItem>
                <Tooltip title="Set as default">
                  <IconButton onClick={() => onSetDefault(view)}>
                    {view.isDefault ? <IsDefaultIcon /> : <SetDefaultIcon />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete this view">
                  <IconButton onClick={() => onStartDeleteView(view)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>

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
