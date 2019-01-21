// @flow
import React, { useState, useEffect } from "react"

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

  const visibilityChangeHandler = () => {
    if (document.visibilityState !== "visible") return

    const lastSync =
      parseInt(window.localStorage.getItem("todolists_last_sync")) || 301
    const diff = new Date().getTime() / 1000 - lastSync / 1000

    if (lastSync === null || diff > 10) {
      fetchLists()
    }
  }

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

  useEffect(() => {
    document.addEventListener("visibilitychange", visibilityChangeHandler)
    return () => {
      document.removeEventListener("visibilitychange", visibilityChangeHandler)
    }
  })

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
      <AppBar>
        <TodoListChooser todoLists={todoLists} onSelectTodoList={setTodoList} />
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
