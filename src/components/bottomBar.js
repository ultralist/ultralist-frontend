// @flow
import React, { useState } from "react"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  appBar: {
    top: "auto",
    bottom: 0
  }
})

const BottomBar = props => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <div>{props.children}</div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default BottomBar
