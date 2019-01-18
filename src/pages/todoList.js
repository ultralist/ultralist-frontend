// @flow
import React, { useState } from "react"

import Backend from "../backend/backend"
import TestBackend from "../backend/testBackend"
import EventCache from "../backend/eventCache"

import AppBar from "../components/appBar"
import TodoList from "../components/todoList/todoList"
import { createAddEvent, createUpdateEvent } from "../models/todoEvent"
import TodoItemModel from "../models/todoItem"
import { LoadTodoListsFromStorage } from "../models/todoList"

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
  const todoLists = LoadTodoListsFromStorage()
  const [todoList, setTodoList] = useState(todoLists[0])

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
