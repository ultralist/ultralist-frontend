// @flow
import React from "react"
import IconButton from "@material-ui/core/IconButton"
import TodayIcon from "@material-ui/icons/Today"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"

import TodoItemModel from "../../../models/todoItem"

type Props = {
  todoItem: TodoItemModel,
  onChange: (todoItem: TodoItemModel) => void
}

type State = {
  isOpen: boolean,
  anchorEl: EventTarget | null
}

class SetDueButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      anchorEl: null,
      isOpen: false
    }
  }

  onOpenMenu = (event: Event) => {
    this.setState({ anchorEl: event.currentTarget, isOpen: true })
  }

  onCloseMenu = () => {
    this.setState({ anchorEl: null, isOpen: false })
  }

  setDueToday = () => {
    this.props.todoItem.setDueToday()
    this.onCloseMenu()
    this.props.onChange(this.props.todoItem)
  }

  setDueTomorrow = () => {
    this.props.todoItem.setDueTomorrow()
    this.onCloseMenu()
    this.props.onChange(this.props.todoItem)
  }

  setDueMonday = () => {
    this.props.todoItem.setDueMonday()
    this.onCloseMenu()
    this.props.onChange(this.props.todoItem)
  }

  render() {
    return (
      <IconButton onClick={this.onOpenMenu} aria-label="Due Today">
        <TodayIcon />
        <Menu
          id="s"
          anchorEl={this.state.anchorEl}
          open={this.state.isOpen}
          onClose={this.onCloseMenu}
        >
          <MenuItem onClick={this.setDueToday}>Due Today</MenuItem>
          <MenuItem onClick={this.setDueTomorrow}>Due Tomorrow</MenuItem>
          <MenuItem onClick={this.setDueMonday}>Due Monday</MenuItem>
        </Menu>
      </IconButton>
    )
  }
}

export default SetDueButton
