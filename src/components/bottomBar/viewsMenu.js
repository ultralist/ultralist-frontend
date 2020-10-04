// @flow
import React from "react"
import { Button, Menu, MenuItem, Divider } from "@material-ui/core"

import FilterModel from "../../shared/models/filter"

import ManageViewsDialog from "./views/manageViewsDialog"

import TodoListContext from "../utils/todoListContext"

type Props = {
  todoListUUID: string,
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const ViewsMenu = (props: Props) => {
  const [showManageViewsDialog, setShowManageViewsDialog] = React.useState(
    false
  )
  const { todoList } = React.useContext(TodoListContext)

  const onShowManageViewsDialog = () => {
    setShowManageViewsDialog(true)
  }

  const onCloseManageViewsDialog = () => {
    setShowManageViewsDialog(false)
  }

  return (
    <React.Fragment>
      <Button color="inherit" onClick={() => onShowManageViewsDialog()}>
        Views
      </Button>
      <ManageViewsDialog
        views={todoList.views}
        show={showManageViewsDialog}
        onClose={onCloseManageViewsDialog}
      />
    </React.Fragment>
  )
}

export default ViewsMenu
