// @flow
import React from "react"
import { Button, Menu, MenuItem, Divider } from "@material-ui/core"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"

import FilterModel from "../../shared/models/filter"
import ViewModel from "../../shared/models/view"

import CreateViewDialog from "./views/createViewDialog"

type Props = {
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const ViewsMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [showCreateViewDialog, setShowCreateViewDialog] = React.useState(false)

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onChooseView = (view: ViewModel) => {
    const vm = new ViewModel(view)
    handleClose()
    props.onChangeFilter(vm)
  }

  const onShowCreateViewDialog = () => {
    setShowCreateViewDialog(true)
  }

  const onCloseCreateViewDialog = () => {
    setShowCreateViewDialog(false)
    handleClose()
  }

  return (
    <React.Fragment>
      <Button color="inherit" onClick={handleClick}>
        Views
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onShowCreateViewDialog}>Save current view</MenuItem>
        <MenuItem>Manage views...</MenuItem>
        <Divider />
        {user.views.map(v => (
          <MenuItem onClick={() => onChooseView(v)}>{v.name}</MenuItem>
        ))}
      </Menu>
      <CreateViewDialog
        filter={props.currentFilter}
        user={user}
        show={showCreateViewDialog}
        onClose={onCloseCreateViewDialog}
      />
    </React.Fragment>
  )
}

export default ViewsMenu
