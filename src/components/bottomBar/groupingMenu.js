// @flow
import React, { useState } from "react"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"

import { BY_ALL, BY_CONTEXT, BY_PROJECT } from "../../constants"

type Props = {
  onChooseGrouping: (group: string) => void
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
    props.onChooseGrouping(group)
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
