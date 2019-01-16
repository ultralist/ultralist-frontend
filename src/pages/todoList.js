// @flow
import React, { useState, useEffect } from "react"

import Backend from "../backend/backend"
import TestBackend from "../backend/testBackend"
import EventCache from "../backend/eventCache"

import TodoList from "../components/todoList/todoList"
import { createAddEvent, createUpdateEvent } from "../models/todoEvent"
import TodoItemModel from "../models/todoItem"

type Props = {
  backend: Backend | TestBackend
}

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

const TodoListApp = (props: Props) => {
  const [todoLists, setTodoLists] = useState([])

  const backend =
    props.backend || new Backend(process.env.REACT_APP_TODOLIST_TOKEN)

  useEffect(
    () => {
      if (todoLists.length > 0) return
      backend.fetchTodoLists().then(todoLists => {
        setTodoLists(todoLists)
      })
    },
    [todoLists]
  )

  const currentTodoList = null

  if (todoLists.length === 0) {
    return "<h1>Loading...</h1>"
  }

  return (
    <TodoList
      todoList={todoLists[0]}
      onAddTodoItem={onAddTodoItem}
      onChangeTodoItem={onChangeTodoItem}
    />
  )
}
export default TodoListApp
