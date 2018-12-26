// @flow
import React, { useState } from "react"
import TextField from "@material-ui/core/TextField"
import { withStyles } from "@material-ui/core/styles"

import { BY_CONTEXT, BY_PROJECT, BY_ALL } from "../../constants"
import utils from "../../utils"

import FilterModel from "../../models/filter"
import TodoItemModel from "../../models/todoItem"
import TodoListModel from "../../models/todoList"

import textFilter from "./textFilter"
import filter from "./filter"
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
  },
})

const searchRef = React.createRef()

const TodoList = (props: Props) => {
  const [filterModel, setFilterModel] = useState(new FilterModel({}))
  const [filterText, setFilterText] = useState("")
  const [currentGrouping, setCurrentGrouping] = useState(BY_ALL)

  const filteredTodos = filter(props.todoList.todos, filterModel)
  const groups = group(filteredTodos, currentGrouping)


  const onChange = (todoItem: TodoItemModel) => {
    console.log("todoItem change", todoItem)
  }

  const changeFilterTextEvent = (ev: Event) => {
    ev.preventDefault()
    changeFilterText(searchRef.current.value)
  }

  const changeFilterText = (str: string) => {
    searchRef.current.value = str
    const [filterModel, grouping] = textFilter(str)
    setFilterModel(filterModel)
    setCurrentGrouping(grouping)
  }

  return (
    <React.Fragment>
      <h2>{props.todoList.name}</h2>

      <form onSubmit={changeFilterTextEvent}>
        <TextField
          id="outlined-search"
          label="Search"
          type="search"
          className={props.classes.searchBox}
          margin="dense"
          autoComplete="off"
          inputRef={searchRef}
        />
      </form>

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
