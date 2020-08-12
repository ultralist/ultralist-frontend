// @flow
import React from "react"
import { Button, Menu, MenuItem, Divider } from "@material-ui/core"

import FilterModel from "../../shared/models/filter"

import CreateViewDialog from "./views/createViewDialog"
import ManageViewsDialog from "./views/manageViewsDialog"

import UserContext from "../utils/userContext"

type Props = {
  todoListUUID: string,
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const ViewsMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [showCreateViewDialog, setShowCreateViewDialog] = React.useState(false)
  const [showManageViewsDialog, setShowManageViewsDialog] = React.useState(
    false
  )

  const { user } = React.useContext(UserContext)

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

  const viewsForTodoList = user.views.filter(
    v => v.todoListUUID === props.todoListUUID
  )

  return (
    <React.Fragment>
      <Button color="inherit" onClick={handleClick}>
        Views
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onShowCreateViewDialog}>Save current view</MenuItem>
        <MenuItem onClick={onShowManageViewsDIalog}>Manage views...</MenuItem>
        {viewsForTodoList.length > 0 && <Divider />}
        {viewsForTodoList.length > 0 &&
          viewsForTodoList.map((v, idx) => (
            <MenuItem key={idx} onClick={() => onChooseView(v)}>
              {v.name}
            </MenuItem>
          ))}
      </Menu>
      <CreateViewDialog
        filter={props.currentFilter}
        todoListUUID={props.todoListUUID}
        show={showCreateViewDialog}
        onClose={onCloseCreateViewDialog}
      />
      <ManageViewsDialog
        views={viewsForTodoList}
        show={showManageViewsDialog}
        onClose={onCloseManageViewsDialog}
      />
    </React.Fragment>
  )
}

export default ViewsMenu
