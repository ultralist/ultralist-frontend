// @flow
import React from "react"
import { Button, Menu, MenuItem, Divider } from "@material-ui/core"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"

import FilterModel from "../../shared/models/filter"
import ViewModel from "../../shared/models/view"

type Props = {
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const GroupingMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onChooseView = (view: ViewModel) => {
    const vm = new ViewModel(view)
    handleClose()
    props.onChangeFilter(vm)
  }

  return (
    <React.Fragment>
      <Button color="inherit" onClick={handleClick}>
        Views
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>Save current view</MenuItem>
        <MenuItem>Manage views...</MenuItem>
        <Divider />
        {user.views.map(v => (
          <MenuItem onClick={() => onChooseView(v)}>{v.name}</MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}

export default GroupingMenu
