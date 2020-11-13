// @flow
import React from "react"

import {
  Card,
  CardActions,
  CardContent,
  Badge,
  Button,
  Tooltip,
  Typography
} from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"

import TodoListContext from "../../utils/todoListContext"

import FilterChips from "./filterChips"
import FilterDialog from "./filterDialog"
import ChooseViewDialog from "./chooseViewDialog"
import SaveViewDialog from "./saveViewDialog"

const UnsavedChangesSaveButton = props => (
  <Tooltip title="Save how the list is currently filtered.  You have unsaved changes to your filter.">
    <Button onClick={props.onClick} size="small">
      <Badge color="secondary" variant="dot">
        Save
      </Badge>
    </Button>
  </Tooltip>
)
const DisabledSaveButton = () => (
  <Button disabled size="small">
    Save
  </Button>
)

const useStyles = makeStyles({
  card: {
    minWidth: 500
  }
})

type Props = {
  todoListUUID: string
}

const View = (props: Props) => {
  const classes = useStyles()

  const { todoList, view, setView } = React.useContext(TodoListContext)

  const [showFilterDialog, setShowFilterDialog] = React.useState(false)
  const [showChooseViewDialog, setShowChooseViewDialog] = React.useState(false)
  const [showSaveViewDialog, setShowSaveViewDialog] = React.useState(false)

  const onCloseFilterDialog = () => {
    setShowFilterDialog(false)
  }

  const onCloseChooseViewDialog = () => {
    setShowChooseViewDialog(false)
  }

  const onCloseSaveViewDialog = () => {
    setShowSaveViewDialog(false)
  }

  const onChooseView = (viewID: string) => {
    const v = todoList.views.find(v => v.id === viewID)
    setView(v)
  }

  return (
    <React.Fragment>
      <Card className={classes.card}>
        <CardContent>
          <div>
            <Typography color="textSecondary" gutterBottom>
              Current view: {view.name}
            </Typography>
          </div>

          <FilterChips onOpenFilterDialog={() => setShowFilterDialog(true)} />
        </CardContent>

        <CardActions>
          <Tooltip title="Load a saved view">
            <Button size="small" onClick={() => setShowChooseViewDialog(true)}>
              Load
            </Button>
          </Tooltip>
          {todoList.viewChanged(view) ? (
            <UnsavedChangesSaveButton
              onClick={() => setShowSaveViewDialog(true)}
            />
          ) : (
            <DisabledSaveButton />
          )}
        </CardActions>
      </Card>

      <FilterDialog isOpen={showFilterDialog} onClose={onCloseFilterDialog} />
      <ChooseViewDialog
        isOpen={showChooseViewDialog}
        onChooseView={onChooseView}
        onClose={onCloseChooseViewDialog}
      />
      <SaveViewDialog
        isOpen={showSaveViewDialog}
        onClose={onCloseSaveViewDialog}
        todoListUUID={props.todoListUUID}
      />
    </React.Fragment>
  )
}

export default View
