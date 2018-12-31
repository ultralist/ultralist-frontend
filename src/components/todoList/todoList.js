// @flow
import React, { useState } from "react"

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import TextField from "@material-ui/core/TextField"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import { withStyles } from "@material-ui/core/styles"

import { BY_CONTEXT, BY_PROJECT, BY_ALL } from "../../constants"
import utils from "../../utils"

import FilterModel from "../../models/filter"
import TodoItemModel from "../../models/todoItem"
import TodoListModel from "../../models/todoList"

import textFilter from "./textFilter"
import filterTodos from "./filterTodos"
import group from "./grouper"
import TodoGroup from "./todoGroup"

type Props = {
  todoList: TodoListModel,
  classes: Object
}

const styles = theme => ({
  searchBox: {
    marginLeft: 20,
    marginRight: 20,
    width: "90%"
  }
})

const searchRef = React.createRef()

const TodoList = (props: Props) => {
  const [filterModel, setFilterModel] = useState(new FilterModel({ archived: false }))
  const filteredTodos = filterTodos(props.todoList.todos, filterModel)
  const groups = group(filteredTodos, textFilter.currentGrouping(searchRef))

  const onChange = (todoItem: TodoItemModel) => {
    console.log("todoItem change", todoItem)
  }

  const changeFilterTextEvent = (ev: Event) => {
    ev.preventDefault()
    changeFilterText(searchRef.current.value)
  }

  const changePriority = () => {
    if (textFilter.isPriority(searchRef)) {
      changeFilterText(textFilter.removeTextFilter(searchRef, "is", "priority"))
    } else {
      changeFilterText(textFilter.addTextFilter(searchRef, "is", "priority"))
    }
  }

  const changeArchived = () => {
    if (textFilter.isArchived(searchRef)) {
      changeFilterText(textFilter.removeTextFilter(searchRef, "is", "archived"))
      changeFilterText(textFilter.addTextFilter(searchRef, "not", "archived"))
    } else {
      changeFilterText(textFilter.addTextFilter(searchRef, "is", "archived"))
      changeFilterText(textFilter.removeTextFilter(searchRef, "not", "archived"))
    }
  }

  const changeCompleted = () => {
    if (textFilter.isCompleted(searchRef)) {
      changeFilterText(textFilter.removeTextFilter(searchRef, "is", "completed"))
    } else {
      changeFilterText(textFilter.addTextFilter(searchRef, "is", "completed"))
    }
  }

  const changeGrouping = (ev: Event, group: string) => {
    if (group === BY_ALL) {
      changeFilterText(textFilter.removeTextFilter(searchRef, "group", null))
    } else {
      changeFilterText(textFilter.changeTextFilter(searchRef, "group", group))
    }
  }

  const changeFilterText = (str: string) => {
    searchRef.current.value = str
    const [filterModel, grouping] = textFilter.filter(str)
    setFilterModel(filterModel)
  }

  return (
    <React.Fragment>
      <h2>{props.todoList.name}</h2>

      <Grid container spacing={24}>
        <Grid item xs={12} sm={4}>
          <form onSubmit={changeFilterTextEvent}>
            <TextField
              id="outlined-search"
              label="Search"
              type="search"
              className={props.classes.searchBox}
              margin="dense"
              autoComplete="off"
              defaultValue="not:archived"
              inputRef={searchRef}
            />
          </form>
        </Grid>
        <Grid item xs={12} sm={4}>
          <ToggleButtonGroup exclusive value={textFilter.currentGrouping(searchRef)} onChange={changeGrouping}>
            <ToggleButton value={BY_ALL} size="small">
              No grouping
            </ToggleButton>
            <ToggleButton value={BY_PROJECT} size="small">
              By project
            </ToggleButton>
            <ToggleButton value={BY_CONTEXT} size="small">
              By context
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControlLabel control={<Switch checked={textFilter.isPriority(searchRef)} onChange={changePriority} />} label="Priority" />
          <FormControlLabel control={<Switch checked={textFilter.isArchived(searchRef)} onChange={changeArchived} />} label="Archived" />
          <FormControlLabel control={<Switch checked={textFilter.isCompleted(searchRef)} onChange={changeCompleted} />} label="Completed" />
        </Grid>
      </Grid>

      {groups.map(g => (
        <TodoGroup
          onChange={onChange}
          onSubjectClick={changeFilterText}
          group={g}
        />
      ))}
    </React.Fragment>
  )
}

export default withStyles(styles)(TodoList)
