// @flow
import React from "react"
import { IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core"
import TodayIcon from "@material-ui/icons/Today"

import TodoItemModel from "../../../shared/models/todoItem"

type Props = {
  todoItem: TodoItemModel,
  onChange: (todoItem: TodoItemModel) => void,
  onShowEditModal: () => void
}

const SetDueButton = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [isOpen, setIsOpen] = React.useState(false)

  const onOpenMenu = (event: Event) => {
    setAnchorEl(event.currentTarget)
    setIsOpen(true)
  }

  const onCloseMenu = () => {
    setIsOpen(false)
    setAnchorEl(null)
  }

  const setDueToday = () => {
    props.todoItem.setDueToday()
    onCloseMenu()
    props.onChange(props.todoItem)
  }

  const setDueTomorrow = () => {
    props.todoItem.setDueTomorrow()
    onCloseMenu()
    props.onChange(props.todoItem)
  }

  const setDueMonday = () => {
    props.todoItem.setDueMonday()
    onCloseMenu()
    props.onChange(props.todoItem)
  }

  const onShowEditModal = () => {
    onCloseMenu()
    props.onShowEditModal()
  }

  return (
    <React.Fragment>
      <Tooltip title="Set due date">
        <IconButton onClick={onOpenMenu} aria-label="Due Today">
          <TodayIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={onCloseMenu}>
        <MenuItem onClick={setDueToday}>Due Today</MenuItem>
        <MenuItem onClick={setDueTomorrow}>Due Tomorrow</MenuItem>
        <MenuItem onClick={setDueMonday}>Due Monday</MenuItem>
        <MenuItem onClick={onShowEditModal}>More...</MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default SetDueButton
