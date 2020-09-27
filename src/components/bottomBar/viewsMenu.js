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
  const [showManageViewsDialog, setShowManageViewsDialog] = React.useState(
    false
  )

  const { user } = React.useContext(UserContext)

  const onShowManageViewsDialog = () => {
    setShowManageViewsDialog(true)
  }

  const onCloseManageViewsDialog = () => {
    setShowManageViewsDialog(false)
  }

  const viewsForTodoList = user.views.filter(
    v => v.todoListUUID === props.todoListUUID
  )

  return (
    <React.Fragment>
      <Button color="inherit" onClick={() => onShowManageViewsDialog()}>
        Views
      </Button>
      <ManageViewsDialog
        views={viewsForTodoList}
        show={showManageViewsDialog}
        onClose={onCloseManageViewsDialog}
      />
    </React.Fragment>
  )
}

export default ViewsMenu
