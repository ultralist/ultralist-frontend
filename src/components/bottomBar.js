// @flow
import React from "react"

import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/styles"

import FilterModel from "../shared/models/filter"

import GroupingMenu from "./bottomBar/groupingMenu"
import FilterDialog from "./bottomBar/filterDialog"

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
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const BottomBar = (props: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.right}>
          <FilterDialog
            currentFilter={props.currentFilter}
            onChangeFilter={props.onChangeFilter}
          />
          <GroupingMenu
            currentFilter={props.currentFilter}
            onChangeFilter={props.onChangeFilter}
          />
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default BottomBar
