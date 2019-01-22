// @flow
import React, { useState } from "react"

import Divider from "@material-ui/core/Divider"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Grid from "@material-ui/core/Grid"
import Switch from "@material-ui/core/Switch"
import TextField from "@material-ui/core/TextField"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"

import {
  BY_CONTEXT,
  BY_PROJECT,
  BY_ALL,
  DEFAULT_FILTER_STRING
} from "../../constants"
import utils from "../../utils"

import FilterModel from "../../models/filter"
import TodoItemModel from "../../models/todoItem"
import TodoListModel from "../../models/todoList"

import textFilter from "./logic/textFilter"
import filterTodos from "./logic/filterTodos"
import group from "./logic/grouper"

import AddTodo from "./addTodo"
import TodoGroup from "./todoGroup"

type Props = {
  todoList: TodoListModel,
  onAddTodoItem: (todoItem: TodoItemModel) => void,
  onChangeTodoItem: (todoItem: TodoItemModel) => void
}

const useStyles = makeStyles({
  searchBoxOuter: {
    margin: 20
  },
  searchBox: {
    width: "90%"
  },
  hidden: {
    display: "none"
  },
  toggleContainer: {
    height: 56,
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: "8px 0",
    minWidth: 300
  },
  controls: {
    marginLeft: 20,
    minWidth: 300
  }
})

const searchRef = React.createRef()

const TodoList = (props: Props) => {
  const classes = useStyles()
  const [defaultFilter, _] = textFilter.filter(DEFAULT_FILTER_STRING)
  const [filterModel, setFilterModel] = useState(defaultFilter)
  const filteredTodos = filterTodos(props.todoList.todos, filterModel)
  const groups = group(filteredTodos, textFilter.currentGrouping(searchRef))

  const changeFilterTextEvent = (ev: Event) => {
    ev.preventDefault()
    changeFilterText(searchRef.current.value)
  }

  const onAddTodo = (todo: TodoItemModel) => {
    props.todoList.addTodo(todo)
    props.onAddTodoItem(todo)
  }

  const onChangeTodo = (todo: TodoItemModel) => {
    props.todoList.updateTodo(todo)
    props.onChangeTodoItem(todo)
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
      changeFilterText(
        textFilter.removeTextFilter(searchRef, "not", "archived")
      )
    }
  }

  const changeCompleted = () => {
    if (textFilter.isCompleted(searchRef)) {
      changeFilterText(
        textFilter.removeTextFilter(searchRef, "is", "completed")
      )
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

  const Controls = () => (
    <div className={classes.controls}>
      <FormControlLabel
        control={
          <Switch
            checked={textFilter.isPriority(searchRef)}
            onChange={changePriority}
          />
        }
        label="Priority"
      />
      <FormControlLabel
        control={
          <Switch
            checked={textFilter.isArchived(searchRef)}
            onChange={changeArchived}
          />
        }
        label="Archived"
      />
      <FormControlLabel
        control={
          <Switch
            checked={textFilter.isCompleted(searchRef)}
            onChange={changeCompleted}
          />
        }
        label="Completed"
      />
    </div>
  )

  const GroupController = () => (
    <div className={classes.toggleContainer}>
      <ToggleButtonGroup
        exclusive
        value={textFilter.currentGrouping(searchRef)}
        onChange={changeGrouping}
      >
        <ToggleButton value={BY_ALL} size="small">
          None
        </ToggleButton>
        <ToggleButton value={BY_PROJECT} size="small">
          P
        </ToggleButton>
        <ToggleButton value={BY_CONTEXT} size="small">
          C
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  )

  return (
    <React.Fragment>
      <Typography component="h3" variant="h3">
        {props.todoList.name}
      </Typography>

      <form className={classes.searchBoxOuter} onSubmit={changeFilterTextEvent}>
        <TextField
          id="outlined-search"
          label="Search"
          type="search"
          className={classes.searchBox}
          margin="dense"
          autoComplete="off"
          defaultValue={DEFAULT_FILTER_STRING}
          inputRef={searchRef}
        />
      </form>

      <Grid alignContent="center" alignItems="center" container spacing={16}>
        <Grid item sm={12} md={4}>
          <Controls />
        </Grid>
        <Grid item sm={12} md={4}>
          <GroupController />
        </Grid>
      </Grid>

      <Divider variant="middle" />

      {groups.map(g => (
        <TodoGroup
          key={g.uuid}
          onChange={onChangeTodo}
          onSubjectClick={changeFilterText}
          group={g}
        />
      ))}

      <AddTodo onAddTodoItem={onAddTodo} />
    </React.Fragment>
  )
}

export default TodoList
