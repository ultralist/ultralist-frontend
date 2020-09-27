// @flow
import React from "react"

import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core"

import UserContext from "../../utils/userContext"
import FilterContext from "../../utils/filterContext"

type Props = {
  isOpen: boolean,
  onClose: () => void,
  onChooseView: (viewID: string) => void
}

const ChooseViewDialog = (props: Props) => {
  const { user } = React.useContext(UserContext)
  const { filter } = React.useContext(FilterContext)

  const views = user.views.filter(v => v.todoListUUID === filter.todoListUUID)

  const onChooseView = (viewID: string) => {
    props.onClose()
    props.onChooseView(viewID)
  }

  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Choose a view for your list</DialogTitle>
      {views.map(v => (
        <List key={v.id}>
          <ListItem button onClick={() => onChooseView(v.id)}>
            <ListItemText primary={v.name} />
          </ListItem>
        </List>
      ))}
    </Dialog>
  )
}

export default ChooseViewDialog
