// @flow
import React, { useState } from "react"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/styles"

import GroupingMenu from "./bottomBar/groupingMenu"

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

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.right}>
          <Button color="inherit">Filter</Button>
          <GroupingMenu onChooseGrouping={props.onChooseGrouping} />
          <div className={classes.grow} />
          <Button color="inherit">Views</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default BottomBar
