// @flow
import React from "react"

import { AppBar, Toolbar } from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"

import FilterContext from "./utils/filterContext"
import FilterModel from "../shared/models/filter"

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

type Props = {
  todoListUUID: string
}

const BottomBar = (props: Props) => {
  const classes = useStyles()
  const { filter, setFilter } = React.useContext(FilterContext)

  const onChangeFilter = (f: FilterModel) => {
    setFilter(f)
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.right}>
          <div className={classes.grow} />

          <ViewsMenu
            todoListUUID={props.todoListUUID}
            currentFilter={filter}
            onChangeFilter={onChangeFilter}
          />
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default BottomBar
