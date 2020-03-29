// @flow
import React, { useState, useEffect } from "react"

import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/styles"
import { withSnackbar } from "notistack"

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
  const [filterModelAttrs, setFilterModelAttrs] = useState(LoadFromStorage())
  const filterModel = new FilterModel(filterModelAttrs)
  const [selectedTodoUUID, setSelectedTodoUUID] = useState(null)

  const groups = filterModel.applyFilter(props.todoList.todos)

  const onAddTodo = (todo: TodoItemModel) => {
    props.todoList.addTodo(todo)
    props.enqueueSnackbar("Todo Added.")
    props.onAddTodoItem(todo)
  }

  const onChangeTodo = (todo: TodoItemModel) => {
    props.onChangeTodoItem(todo)
    props.todoList.updateTodo(todo)
    props.enqueueSnackbar("Todo updated.")
  }

  const onDeleteTodo = (todo: TodoItemModel) => {
    props.todoList.deleteTodo(todo)
    props.enqueueSnackbar("Todo deleted.")
    props.onDeleteTodoItem(todo)
  }

  const onChangeFilter = (filter: FilterModel) => {
    filter.save()
    setFilterModelAttrs(filter.toJSON())
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
    </React.Fragment>
  )
}

export default withSnackbar(TodoList)
