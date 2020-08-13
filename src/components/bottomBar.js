// @flow
import React from "react"

import { AppBar, Button, Toolbar } from "@material-ui/core"

import { makeStyles } from "@material-ui/styles"

import FilterModel from "../shared/models/filter"

import GroupingMenu from "./bottomBar/groupingMenu"
import FilterDialog from "./bottomBar/filterDialog"
import ColumnsDialog from "./bottomBar/columnsDialog"
import ViewsMenu from "./bottomBar/viewsMenu"
import ViewSwitcher from "./bottomBar/views/viewSwitcher"

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
  todoListUUID: string,
  currentFilter: FilterModel,
  onChangeFilter: (f: FilterModel) => void
}

const BottomBar = (props: Props) => {
  const classes = useStyles()

  const onChangeFilterView = () => {
    props.currentFilter.toggleViewType()
    props.onChangeFilter(props.currentFilter)
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar className={classes.right}>
          <ViewSwitcher
            checked={props.currentFilter.viewType === "kanban"}
            onChange={onChangeFilterView}
          />
          <FilterDialog
            currentFilter={props.currentFilter}
            onChangeFilter={props.onChangeFilter}
          />
          {props.currentFilter.viewType !== "kanban" && (
            <GroupingMenu
              currentFilter={props.currentFilter}
              onChangeFilter={props.onChangeFilter}
            />
          )}

          {props.currentFilter.viewType === "kanban" && (
            <ColumnsDialog
              currentFilter={props.currentFilter}
              onChangeFilter={props.onChangeFilter}
            />
          )}

          <div className={classes.grow} />

          <ViewsMenu
            todoListUUID={props.todoListUUID}
            currentFilter={props.currentFilter}
            onChangeFilter={props.onChangeFilter}
          />
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default BottomBar
