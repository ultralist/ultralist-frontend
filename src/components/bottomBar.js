// @flow
import React from "react"

import { AppBar, Toolbar } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

import ViewsMenu from "./bottomBar/viewsMenu"

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

type Props = {}

const BottomBar = (props: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.right}>
          <div className={classes.grow} />

          <ViewsMenu />
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default BottomBar
