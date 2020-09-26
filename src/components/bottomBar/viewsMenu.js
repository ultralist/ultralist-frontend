// @flow
import React from "react"
import { Button, Menu, MenuItem, Divider } from "@material-ui/core"

import FilterModel from "../../shared/models/filter"

import ManageViewsDialog from "./views/manageViewsDialog"

import UserContext from "../utils/userContext"

type Props = {
  todoListUUID: string,
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const ViewsMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
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

  const onShowManageViewsDIalog = () => {
    setShowManageViewsDialog(true)
    handleClose()
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
        <MenuItem onClick={onShowManageViewsDIalog}>Manage views...</MenuItem>
        {viewsForTodoList.length > 0 && <Divider />}
        {viewsForTodoList.length > 0 &&
          viewsForTodoList.map((v, idx) => (
            <MenuItem key={idx} onClick={() => onChooseView(v)}>
              {v.name}
            </MenuItem>
          ))}
      </Menu>
      <ManageViewsDialog
        views={viewsForTodoList}
        show={showManageViewsDialog}
        onClose={onCloseManageViewsDialog}
      />
    </React.Fragment>
  )
}

export default ViewsMenu
