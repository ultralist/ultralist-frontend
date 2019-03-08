// @flow
import React from "react"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingBottom: 70
  },
  grow: {
    flexGrow: 1
  }
})

const TopBar = props => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="title" color="inherit">
            Ultralist
          </Typography>

          <div className={classes.grow} />
          <div>{props.children}</div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default TopBar
