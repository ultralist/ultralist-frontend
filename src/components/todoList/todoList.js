// @flow
import React, { useState, useEffect } from "react"

import Typography from "@material-ui/core/Typography"
import Snackbar from "@material-ui/core/Snackbar"
import { makeStyles } from "@material-ui/styles"

import Storage from "../../backend/storage"
import TodoItemModel from "../../models/todoItem"
import TodoListModel from "../../models/todoList"
import FilterModel, { LoadFromStorage } from "../../models/filter"
import FilterChips from "./filterChips"

import AddTodo from "./addTodo"
import TodoGroup from "./todoGroup"
import BottomBar from "../bottomBar"

type Props = {
  todoList: TodoListModel,
  onAddTodoItem: (todoItem: TodoItemModel) => void,
  onChangeTodoItem: (todoItem: TodoItemModel) => void,
  onDeleteTodoItem: (todoItem: TodoItemModel) => void
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
    textAlign: "center",
    marginTop: 20
  },
  filterChips: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  }
})

const TodoList = (props: Props) => {
  const classes = useStyles()
  const storage = new Storage()
  const [filterModel, setFilterModel] = useState(LoadFromStorage())
  const [snackbarText, setSnackbarText] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [selectedTodoUUID, setSelectedTodoUUID] = useState(null)

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

  const onDeleteTodo = (todo: TodoItemModel) => {
    props.todoList.deleteTodo(todo)
    setSnackbarText("Todo deleted.")
    setSnackbarOpen(true)
    props.onDeleteTodoItem(todo)
  }

  const onChangeFilter = (filter: FilterModel) => {
    filter.save()
    setFilterModel(filter)
  }

  const onSubjectClick = (subject: string) => {
    filterModel.addSubjectContains(subject)
    onChangeFilter(filterModel)
  }

  const todoUUIDs = groups.map(g => g.todos.map(t => t.uuid)).flat()
  const onKeypress = event => {
    if (storage.isModalOpen()) return

    let nextTodoUUID = todoUUIDs[todoUUIDs.indexOf(selectedTodoUUID) + 1]
    if (nextTodoUUID === undefined) nextTodoUUID = todoUUIDs[0]

    let prevTodoUUID = todoUUIDs[todoUUIDs.indexOf(selectedTodoUUID) - 1]
    if (prevTodoUUID === undefined)
      prevTodoUUID = todoUUIDs[todoUUIDs.length - 1]

    if (event.keyCode === 106) setSelectedTodoUUID(nextTodoUUID)
    if (event.keyCode === 107) setSelectedTodoUUID(prevTodoUUID)
  }

  useEffect(() => {
    document.addEventListener("keypress", onKeypress)

    return () => {
      document.removeEventListener("keypress", onKeypress)
    }
  })

  return (
    <React.Fragment>
      <div className={classes.listContainer}>
        <Typography component="h4" variant="h4" className={classes.listName}>
          {props.todoList.name}
        </Typography>

        <div className={classes.filterChips}>
          <FilterChips
            currentFilter={filterModel}
            onChangeFilter={onChangeFilter}
          />
        </div>

        {groups.map(g => (
          <TodoGroup
            key={g.uuid}
            selectedTodoUUID={selectedTodoUUID}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
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
        onClose={(event, reason) => {
          if (reason === "clickaway") return
          setSnackbarOpen(false)
        }}
        disableWindowBlurListener={true}
        message={<span>{snackbarText}</span>}
      />
    </React.Fragment>
  )
}

export default TodoList
