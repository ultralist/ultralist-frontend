// @flow
import React, { useState, useEffect } from "react"
import { parseISO } from "date-fns"

import Backend from "../backend/backend"
import Storage from "../backend/storage"
import TestBackend from "../backend/testBackend"
import EventCache from "../backend/eventCache"

import AppBar from "../components/appBar"
import UserIcon from "../components/userIcon"
import TodoList from "../components/todoList/todoList"
import TodoListChooser from "../components/todoListChooser"
import { createAddEvent, createUpdateEvent } from "../models/todoEvent"
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
  const mostRecentTodoList = todoLists.find(
    tl => tl.uuid === window.localStorage.getItem(TODOLIST_MRU_KEY)
  )
  const [todoList, setTodoList] = useState(mostRecentTodoList || todoLists[0])

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
    const updatedAt = parseISO(data.data.updated_at)
    if (updatedAt > todoList.updatedAt) {
      fetchLists()
    }
  }

  useEffect(() => {
    // document.addEventListener("visibilitychange", visibilityChangeHandler)
    fetchList()

    const socketProcessor = new WebsocketProcessor(
      "todolist_update",
      processSocketUpdate
    )
    window.socket.registerProcessor(socketProcessor)

    return () => {
      // document.removeEventListener("visibilitychange", visibilityChangeHandler)
      window.socket.deregisterProcessor("todolist_update")
    }
  }, [])

  const update = () => {
    backend.updateTodolist(todoList.uuid, eventCache).then(list => {
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

  const onChangeTodoList = (todoList: TodoListModel) => {
    window.localStorage.setItem(TODOLIST_MRU_KEY, todoList.uuid)
    setTodoList(todoList)
    fetchLists()
  }

  return (
    <React.Fragment>
      <AppBar>
        <TodoListChooser
          todoLists={todoLists}
          onSelectTodoList={onChangeTodoList}
        />
        <UserIcon />
      </AppBar>

      <TodoList
        todoList={todoList}
        onAddTodoItem={onAddTodoItem}
        onChangeTodoItem={onChangeTodoItem}
      />
    </React.Fragment>
  )
}
export default TodoListApp
