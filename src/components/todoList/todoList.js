// @flow
import React, { useState } from "react"

import Typography from "@material-ui/core/Typography"
import Snackbar from "@material-ui/core/Snackbar"
import { makeStyles } from "@material-ui/styles"

import TodoItemModel from "../../models/todoItem"
import TodoListModel from "../../models/todoList"
import FilterModel, { LoadDefaultOrStoredFilter } from "../../models/filter"

import AddTodo from "./addTodo"
import TodoGroup from "./todoGroup"
import BottomBar from "../bottomBar"

type Props = {
  todoList: TodoListModel,
  onAddTodoItem: (todoItem: TodoItemModel) => void,
  onChangeTodoItem: (todoItem: TodoItemModel) => void
}

const useStyles = makeStyles({
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
  },
  listContainer: {
    paddingTop: 70,
    paddingBottom: 70
  },
  listName: {
    textAlign: "center"
  }
})

const TodoList = (props: Props) => {
  const classes = useStyles()
  const [filterModel, setFilterModel] = useState(LoadDefaultOrStoredFilter())
  const [snackbarText, setSnackbarText] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const groups = filterModel.applyFilter(props.todoList.todos)

  const onAddTodo = (todo: TodoItemModel) => {
    props.todoList.addTodo(todo)
    setSnackbarText("Todo added.")
    setSnackbarOpen(true)
    props.onAddTodoItem(todo)
  }

  const onChangeTodo = (todo: TodoItemModel) => {
    props.todoList.updateTodo(todo)
    setSnackbarText("Todo updated.")
    setSnackbarOpen(true)
    props.onChangeTodoItem(todo)
  }

  const onChangeFilter = (filter: FilterModel) => {
    filter.saveFilterString()
    setFilterModel(filter)
  }

  const onSubjectClick = (subject: string) => {
    filterModel.addSubjectContains(subject)
    onChangeFilter(filterModel)
  }

  return (
    <React.Fragment>
      <div className={classes.listContainer}>
        <Typography component="h4" variant="h4" className={classes.listName}>
          {props.todoList.name}
        </Typography>

        {groups.map(g => (
          <TodoGroup
            key={g.uuid}
            onChange={onChangeTodo}
            onSubjectClick={onSubjectClick}
            group={g}
          />
        ))}
      </div>

      <AddTodo onAddTodoItem={onAddTodo} />
      <BottomBar currentFilter={filterModel} onChangeFilter={onChangeFilter} />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={<span>{snackbarText}</span>}
      />
    </React.Fragment>
  )
}

export default TodoList
