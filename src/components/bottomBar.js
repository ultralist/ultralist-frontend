// @flow
import React, { useState } from "react"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/styles"

import { BY_ALL, BY_CONTEXT, BY_PROJECT } from "../constants"

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  right: {
    justifyContent: "flex-end"
  },
  grow: {
    flexGrow: 1
  },
  appBar: {
    top: "auto",
    bottom: 0
  }
})

type Props = {
  onChooseGrouping: (g: string) => void
}

const BottomBar = (props: Props) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const onChooseGrouping = (g: string) => {
    handleClose()
    props.onChooseGrouping(g)
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.right}>
          <Button color="inherit">Filter</Button>

          <Button color="inherit" onClick={handleClick}>
            Group
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
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

          <div className={classes.grow} />
          <Button color="inherit">Views</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default BottomBar
