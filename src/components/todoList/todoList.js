// @flow
import React, { useState, useEffect } from "react"

import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"

import { makeStyles } from "@material-ui/styles"
import { withSnackbar } from "notistack"

import TodoItemModel from "../../shared/models/todoItem"
import TodoListModel from "../../shared/models/todoList"
import FilterModel from "../../shared/models/filter"
import FilterChips from "./filterChips"

import StorageContext from "../../shared/storageContext"
import FilterStorage from "../../shared/storage/filterStorage"
import ModalStorage from "../../shared/storage/modalStorage"

import AddTodo from "./addTodo"
import TodoGroup from "./todoGroup"
import BottomBar from "../bottomBar"

import CLIAuthCompletedDialog from "../initialDialogs/CLIAuthCompletedDialog"
import WelcomeDialog from "../initialDialogs/welcomeDialog"
import SlackAppInstalledDialog from "../initialDialogs/slackAppInstalledDialog"
import SlackAddUserDialog from "../initialDialogs/slackAddUserDialog"

type Props = {
  todoList: TodoListModel,
  onAddTodoItem: (todoItem: TodoItemModel) => void,
  onChangeTodoItem: (todoItem: TodoItemModel) => void,
  onDeleteTodoItem: (todoItem: TodoItemModel) => void
}

const useStyles = makeStyles({
  mainContainer: {
    paddingBottom: 100
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
  const filterStorage = new FilterStorage(React.useContext(StorageContext))
  const modalStorage = new ModalStorage(React.useContext(StorageContext))

  const [filterModelAttrs, setFilterModelAttrs] = useState(
    filterStorage.loadFilter().toJSON()
  )
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
    filterStorage.saveFilter(filter)
    setFilterModelAttrs(filter.toJSON())
  }

  const onSubjectClick = (subject: string) => {
    filterModel.addSubjectContains(subject)
    onChangeFilter(filterModel)
  }

  const todoUUIDs = groups.map(g => g.todos.map(t => t.uuid)).flat()
  const onKeypress = event => {
    if (modalStorage.isModalOpen()) return

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
      <Container maxWidth="md" className={classes.mainContainer}>
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
      </Container>

      <CLIAuthCompletedDialog />
      <WelcomeDialog />
      <SlackAppInstalledDialog />
      <SlackAddUserDialog />

      <AddTodo onAddTodoItem={onAddTodo} />
      <BottomBar currentFilter={filterModel} onChangeFilter={onChangeFilter} />
    </React.Fragment>
  )
}

export default withSnackbar(TodoList)
