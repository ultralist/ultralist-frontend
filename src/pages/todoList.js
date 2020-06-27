// @flow
import React, { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"

import { parseISO } from "date-fns"
import { withSnackbar } from "notistack"
import { makeStyles } from "@material-ui/styles"
import grey from "@material-ui/core/colors/grey"

import BackendContext from "../shared/backendContext"
import TodoListBackend from "../shared/backend/todoListBackend"

import EventCache from "../shared/backend/eventCache"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"
import TodoList from "../components/todoList/todoList"
import TodoListChooser from "../components/topBar/todoListChooser"
import CreateTodoList from "../components/topBar/createTodoList"
import {
  createAddEvent,
  createUpdateEvent,
  createDeleteEvent
} from "../shared/models/todoEvent"
import TodoItemModel from "../shared/models/todoItem"
import { WebsocketProcessor } from "../config/websocket"

import TodoListModel, {
  createTodoListFromBackend
} from "../shared/models/todoList"

import useUserStorage from "../components/utils/useUserStorage"

const eventCache = new EventCache()

const useStyles = makeStyles({
  greyBackground: {
    backgroundColor: grey[100],
    height: "100vh"
  }
})

const TodoListApp = (props: Props) => {
  const classes = useStyles()

  const [user, setUser] = useUserStorage()
  console.log("user = ", user)

  const backend = new TodoListBackend(
    user ? user.token : "",
    React.useContext(BackendContext)
  )

  const [todoList, setTodoList] = React.useState(() => {
    const byId = user.todoLists.find(
      list => list.uuid === props.match.params.id
    )
    const todoListUUID = byId ? byId.uuid : user.todoLists[0].uuid
    return new TodoListModel(user.todoLists.find(l => l.uuid === todoListUUID))
  })

  window.socket.registerSocket(user)

  const fetchList = (list: TodoListModel) => {
    if (!navigator.onLine) return

    backend.fetchTodoList(list.uuid).then(list => {
      const idx = user.todoLists.findIndex(l => l.uuid === list.uuid)
      user.todoLists.splice(idx, 1, list)
      setUser(user)
    })
  }

  const processSocketUpdate = data => {
    setTimeout(() => {
      const updatedAt = parseISO(data.updated_at)
      const updatedList = user.todoLists.find(list => list.id === data.uuid)
      if (updatedAt > updatedList.updatedAt) {
        fetchList(updatedList)
      }
    }, 500)
  }

  useEffect(() => {
    const socketProcessor = new WebsocketProcessor(
      "todolist_update",
      processSocketUpdate
    )
    window.socket.registerProcessor(socketProcessor)

    return () => {
      window.socket.deregisterProcessor("todolist_update")
    }
  }, [])

  const updateTodoList = () => {
    if (!navigator.onLine) return

    const idx = user.todoLists.findIndex(l => l.uuid === todoList.uuid)
    const list = user.todoLists.find(l => l.uuid === todoList.uuid)
    user.todoLists.splice(idx, 1, list)
    setUser(user)

    backend.updateTodoList(todoList.uuid, eventCache).then(() => {
      eventCache.clear()
    })
  }

  const onAddTodoItem = (todoItem: TodoItemModel) => {
    todoList.addTodo(todoItem)
    eventCache.addItem(createAddEvent(todoItem))
    updateTodoList()
    console.log("add item todoList = ", todoList)
    setTodoList(new TodoListModel(todoList))
  }

  const onChangeTodoItem = (todoItem: TodoItemModel) => {
    todoList.updateTodo(todoItem)
    setTodoList(new TodoListModel(todoList))
    eventCache.addItem(createUpdateEvent(todoItem))
    updateTodoList()
  }

  const onDeleteTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createDeleteEvent(todoItem))
    todoList.deleteTodo(todoItem)
    updateTodoList()
    setTodoList(new TodoListModel(todoList))
  }

  const onChangeTodoList = (newList: TodoListModel) => {
    props.history.push(`/todolist/${newList.uuid}`)
    setTodoList(new TodoListModel(newList))
  }

  const onCreateTodoList = (todoList: TodoListModel) => {
    backend.createTodoList(todoList.uuid, todoList.name).then(newList => {
      newList = createTodoListFromBackend(newList)
      user.todoLists.push(newList)
      setUser(user)
      props.enqueueSnackbar("Todolist created.")
      setTodoList(newList)
    })
  }

  if (!user) {
    return <Redirect to="/login" />
  }

  return (
    <React.Fragment>
      <div className={classes.greyBackground}>
        <TopBar>
          <CreateTodoList onCreateTodoList={onCreateTodoList} />
          <TodoListChooser
            todoLists={user.todoLists}
            onSelectTodoList={onChangeTodoList}
          />
          <UserIcon />
        </TopBar>

        <TodoList
          user={user}
          todoList={todoList}
          onAddTodoItem={onAddTodoItem}
          onChangeTodoItem={onChangeTodoItem}
          onDeleteTodoItem={onDeleteTodoItem}
        />
      </div>
    </React.Fragment>
  )
}
export default withSnackbar(TodoListApp)
