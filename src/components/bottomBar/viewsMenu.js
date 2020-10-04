// @flow
import React from "react"
import { Button } from "@material-ui/core"

import FilterModel from "../../shared/models/filter"

import ManageViewsDialog from "./views/manageViewsDialog"

type Props = {
  todoListUUID: string,
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const ViewsMenu = (props: Props) => {
  const [showManageViewsDialog, setShowManageViewsDialog] = React.useState(
    false
  )

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
        show={showManageViewsDialog}
        onClose={onCloseManageViewsDialog}
      />
    </React.Fragment>
  )
}

export default ViewsMenu
