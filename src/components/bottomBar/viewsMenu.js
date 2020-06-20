// @flow
import React from "react"
import { Button, Menu, MenuItem, Divider } from "@material-ui/core"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"

import FilterModel from "../../shared/models/filter"

import CreateViewDialog from "./views/createViewDialog"
import ManageViewsDialog from "./views/manageViewsDialog"

type Props = {
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const ViewsMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [showCreateViewDialog, setShowCreateViewDialog] = React.useState(false)
  const [showManageViewsDialog, setShowManageViewsDialog] = React.useState(
    false
  )

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onChooseView = (view: FilterModel) => {
    const vm = new FilterModel(view)
    handleClose()
    props.onChangeFilter(vm)
  }

  const onShowCreateViewDialog = () => {
    setShowCreateViewDialog(true)
    handleClose()
  }

  const onShowManageViewsDIalog = () => {
    setShowManageViewsDialog(true)
    handleClose()
  }

  const onCloseCreateViewDialog = () => {
    setShowCreateViewDialog(false)
  }

  const onCloseManageViewsDialog = () => {
    setShowManageViewsDialog(false)
  }

  return (
    <React.Fragment>
      <Button color="inherit" onClick={handleClick}>
        Views
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onShowCreateViewDialog}>Save current view</MenuItem>
        <MenuItem onClick={onShowManageViewsDIalog}>Manage views...</MenuItem>
        {user.views.length > 0 && <Divider />}
        {user.views.length > 0 &&
          user.views.map(v => (
            <MenuItem onClick={() => onChooseView(v)}>{v.name}</MenuItem>
          ))}
      </Menu>
      <CreateViewDialog
        filter={props.currentFilter}
        user={user}
        show={showCreateViewDialog}
        onClose={onCloseCreateViewDialog}
      />
      <ManageViewsDialog
        user={user}
        views={user.views}
        show={showManageViewsDialog}
        onClose={onCloseManageViewsDialog}
      />
    </React.Fragment>
  )
}

export default ViewsMenu
