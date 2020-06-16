// @flow
import React, { useState } from "react"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"

import FilterModel from "../../shared/models/filter"

const BY_ALL = "all"
const BY_CONTEXT = "context"
const BY_PROJECT = "project"

type Props = {
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const GroupingMenu = (props: Props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onChooseGrouping = (group: string) => {
    handleClose()
    props.currentFilter.group = group
    props.onChangeFilter(props.currentFilter)
  }

  return (
    <React.Fragment>
      <Button color="inherit" onClick={handleClick}>
        Group
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onChooseGrouping.bind(this, BY_ALL)}>
          No grouping
        </MenuItem>
        <MenuItem onClick={onChooseGrouping.bind(this, BY_CONTEXT)}>
          By Context
        </MenuItem>
        <MenuItem onClick={onChooseGrouping.bind(this, BY_PROJECT)}>
          By Project
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default GroupingMenu
