// @flow
import React, { useState, useEffect } from "react"
import { parseISO } from "date-fns"
import Snackbar from "@material-ui/core/Snackbar"

import Backend from "../backend/backend"
import Storage from "../backend/storage"
import TestBackend from "../backend/testBackend"
import EventCache from "../backend/eventCache"

import TopBar from "../components/topBar"
import UserIcon from "../components/userIcon"
import TodoList from "../components/todoList/todoList"
import TodoListChooser from "../components/topBar/todoListChooser"
import CreateTodoList from "../components/topBar/createTodoList"
import {
  createAddEvent,
  createUpdateEvent,
  createDeleteEvent
} from "../models/todoEvent"
import TodoItemModel from "../models/todoItem"
import { loadUser } from "../models/user"
import { WebsocketProcessor } from "../config/websocket"

import TodoListModel, { createTodoListFromBackend } from "../models/todoList"

type Props = {
  backend?: TestBackend
}

const eventCache = new EventCache()
const storage = new Storage()
const TODOLIST_MRU_KEY = "todolist-mru-id"

const TodoListApp = (props: Props) => {
  const todoLists = storage.loadTodoLists()
  let mostRecentTodoList
  if (props.match.params.id) {
    mostRecentTodoList = todoLists.find(t => t.uuid === props.match.params.id)
    window.localStorage.setItem(TODOLIST_MRU_KEY, mostRecentTodoList.uuid)
  } else {
    mostRecentTodoList = todoLists.find(
      tl => tl.uuid === window.localStorage.getItem(TODOLIST_MRU_KEY)
    )
  }

  const [todoList, setTodoList] = useState(mostRecentTodoList || todoLists[0])

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarText, setSnackbarText] = useState("")

  const user = loadUser()
  window.socket.registerSocket(user)
  const backend = props.backend || new Backend(user.token)

  const fetchLists = () => {
    backend.fetchTodoLists().then(todoLists => {
      const lists = todoLists.todolists.map(list =>
        createTodoListFromBackend(list)
      )
      const currentList = lists.find(
        l => l.uuid === window.localStorage.getItem(TODOLIST_MRU_KEY)
      )
      storage.saveTodoLists(lists)
      setTodoList(currentList)
      window.localStorage.setItem("todolists_last_sync", new Date().getTime())
    })
  }

  const fetchList = () => {
    backend.fetchTodoList(todoList.uuid).then(list => {
      list = createTodoListFromBackend(list)
      storage.updateTodoList(list)
      setTodoList(list)
    })
  }

  const processSocketUpdate = data => {
    setTimeout(() => {
      const updatedAt = parseISO(data.data.updated_at)
      const currentList = storage.loadTodoList(todoList.uuid)
      if (updatedAt > currentList.updatedAt) {
        fetchLists()
      }
    }, 500)
  }

  useEffect(() => {
    fetchList()

    const socketProcessor = new WebsocketProcessor(
      "todolist_update",
      processSocketUpdate
    )
    window.socket.registerProcessor(socketProcessor)

    return () => {
      window.socket.deregisterProcessor("todolist_update")
    }
  }, [])

  const update = () => {
    backend.updateTodoList(todoList.uuid, eventCache).then(list => {
      const newTodoList = createTodoListFromBackend(list)
      storage.updateTodoList(newTodoList)
      setTodoList(newTodoList)
      eventCache.clear()
    })
  }

  const onAddTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createAddEvent(todoItem))
    update()
  }

  const onChangeTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createUpdateEvent(todoItem))
    update()
  }

  const onDeleteTodoItem = (todoItem: TodoItemModel) => {
    eventCache.addItem(createDeleteEvent(todoItem))
    update()
  }

  const onChangeTodoList = (newList: TodoListModel) => {
    props.history.push(`/todolist/${newList.uuid}`)
    fetchLists()
  }

  const onCreateTodoList = (todoList: TodoListModel) => {
    backend.createTodoList(todoList.uuid, todoList.name).then(todoList => {
      todoList = createTodoListFromBackend(todoList)
      const lists = storage.loadTodoLists()
      lists.push(todoList)
      storage.saveTodoLists(lists)
      setSnackbarText("Todolist created.")
      setSnackbarOpen(true)
      setTodoList(todoList)
    })
  }

  return (
    <React.Fragment>
      <TopBar>
        <CreateTodoList onCreateTodoList={onCreateTodoList} />
        <TodoListChooser
          todoLists={todoLists}
          onSelectTodoList={onChangeTodoList}
        />
        <UserIcon />
      </TopBar>

      <TodoList
        todoList={todoList}
        onAddTodoItem={onAddTodoItem}
        onChangeTodoItem={onChangeTodoItem}
        onDeleteTodoItem={onDeleteTodoItem}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          if (reason === "clickaway") return
          setSnackbarOpen(false)
        }}
        message={<span>{snackbarText}</span>}
      />
    </React.Fragment>
  )
}
export default TodoListApp
