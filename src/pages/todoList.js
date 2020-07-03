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

  const processSocketUpdate = data => {
    setTimeout(() => {
      const updatedAt = parseISO(data.data.updated_at)
      const updatedList = new TodoListModel(
        user.todoLists.find(list => list.uuid === data.data.uuid)
      )
      if (updatedList && updatedAt > parseISO(updatedList.updatedAt)) {
        fetchList(updatedList)
      }
    }, 500)
  }

  const fetchList = (updatedList: TodoListModel) => {
    if (!navigator.onLine) return

    backend.fetchTodoList(updatedList.uuid).then(list => {
      const idx = user.todoLists.findIndex(l => l.uuid === list.uuid)
      user.todoLists.splice(idx, 1, list)
      setUser(user)
      if (list.uuid === todoList.uuid) {
        setTodoList(new TodoListModel(list))
        window.localStorage.setItem(
          "focusUpdate",
          JSON.stringify({ time: new Date().getTime() })
        )
      }
    })
  }

  const onFocus = () => {
    const lastUpdateTime = JSON.parse(
      window.localStorage.getItem("focusUpdate")
    ).time
    const currentTime = new Date().getTime()
    if (currentTime - lastUpdateTime > 600000) {
      fetchList(todoList)
    }
    window.socket.deregisterProcessor("todolist_update")
    window.socket.registerProcessor(socketProcessor)
  }

  const socketProcessor = new WebsocketProcessor(
    "todolist_update",
    processSocketUpdate
  )

  useEffect(() => {
    window.addEventListener("focus", onFocus)
    window.socket.registerProcessor(socketProcessor)
    fetchList(todoList)

    return () => {
      window.removeEventListener("focus", onFocus)
    }
  }, [])

  const updateTodoList = () => {
    if (!navigator.onLine) return

    backend.updateTodoList(todoList.uuid, eventCache).then(list => {
      const idx = user.todoLists.findIndex(l => l.uuid === todoList.uuid)
      user.todoLists.splice(idx, 1, list)
      setUser(user)
      eventCache.clear()
    })
  }

  const onAddTodoItem = (todoItem: TodoItemModel) => {
    todoList.addTodo(todoItem)
    eventCache.addItem(createAddEvent(todoItem))
    updateTodoList()
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
