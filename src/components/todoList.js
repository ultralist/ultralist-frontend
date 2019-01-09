// @flow
import React, { useState, useEffect } from "react"

import Backend from "../backend/backend"
import EventCache from "../backend/eventCache"

import TodoList from "./todoList/todoList"
import { createAddEvent, createUpdateEvent } from "../models/todoEvent"
import TodoItemModel from "../models/todoItem"
import { createTodoListFromBackend } from "../models/todoList"

const token = process.env.REACT_APP_TODOLIST_TOKEN // TEMPORARY

const backend = new Backend(token)
const eventCache = new EventCache()

const onAddTodoItem = (todoItem: TodoItemModel) => {
  eventCache.addItem(createAddEvent(todoItem))
  console.log("would call backend update with", eventCache.toJSON())
  eventCache.clear() // TEMPORARY
}

const onChangeTodoItem = (todoItem: TodoItemModel) => {
  eventCache.addItem(createUpdateEvent(todoItem))
  console.log("would call backend update with", eventCache.toJSON())
  eventCache.clear() // TEMPORARY
}

const TodoListApp = () => {
  const [todoLists, setTodoLists] = useState([])

  useEffect(
    () => {
      if (todoLists.length > 0) return
      backend.fetchTodoLists().then(backendJSON => {
        setTodoLists(
          backendJSON.todolists.map(attr => createTodoListFromBackend(attr))
        )
      })
    },
    [todoLists]
  )

  const currentTodoList = null

  if (todoLists.length === 0) {
    return "<h1>Loading...</h1>"
  } else {
    return (
      <TodoList
        todoList={todoLists[0]}
        onAddTodoItem={onAddTodoItem}
        onChangeTodoItem={onChangeTodoItem}
      />
    )
  }
}
export default TodoListApp
