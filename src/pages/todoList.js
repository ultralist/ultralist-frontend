// @flow
import React, { useState } from "react"
import { toDate } from "date-fns"

import Backend from "../backend/backend"
import Storage from "../backend/storage"
import TestBackend from "../backend/testBackend"
import EventCache from "../backend/eventCache"

import AppBar from "../components/appBar"
import TodoList from "../components/todoList/todoList"
import { createAddEvent, createUpdateEvent } from "../models/todoEvent"
import TodoItemModel from "../models/todoItem"
import { loadUser } from "../models/user"

import { createTodoListFromBackend } from "../models/todoList"

type Props = {
  backend?: TestBackend
}

const eventCache = new EventCache()
const storage = new Storage()

const TodoListApp = (props: Props) => {
  const todoLists = storage.loadTodoLists()
  const [todoList, setTodoList] = useState(todoLists[0])
  const user = loadUser()
  const backend = props.backend || new Backend(user.token)

  const fetchLists = () => {
    backend.fetchTodoLists().then(todoLists => {
      const lists = todoLists.todolists.map(list =>
        createTodoListFromBackend(list)
      )
      const currentList = lists.find(l => l.uuid === todoList.uuid)
      storage.saveTodoLists(lists)
      setTodoList(currentList)
      window.localStorage.setItem("todolists_last_sync", new Date().getTime())
    })
  }

  // TODO: this will probably add a ton of event listeners
  // since there is no subsequent removeEventListener
  console.log("about to register")
  document.addEventListener(
    "visibilityChange",
    () => {
      console.log("visibilityChange")
      if (document.visibilityState !== "visible") return
      console.log("visible")

      const lastSync =
        parseInt(window.localStorage.getItem("todolists_last_sync")) || 301
      const diff = new Date().getTime() / 1000 - lastSync / 1000

      if (lastSync === null || diff > 10) {
        fetchLists()
      }
    },
    false
  )

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

  return (
    <React.Fragment>
      <AppBar />
      <TodoList
        todoList={todoList}
        onAddTodoItem={onAddTodoItem}
        onChangeTodoItem={onChangeTodoItem}
      />
    </React.Fragment>
  )
}
export default TodoListApp
