// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import BackendContext from "../shared/backendContext"
import TodoListBackend from "../shared/backend/todoListBackend"

import { createTodoListFromBackend } from "../shared/models/todoList"

import StorageContext from "../shared/storageContext"
import TodoListStorage from "../shared/storage/todoListStorage"
import UserStorage from "../shared/storage/userStorage"

type Props = {
  history: any
}

const LoadTodoLists = (props: Props) => {
  const todoListStorage = new TodoListStorage(React.useContext(StorageContext))
  const userStorage = new UserStorage(React.useContext(StorageContext))

  const user = userStorage.loadUser()

  const backend = new TodoListBackend(
    user.token,
    React.useContext(BackendContext)
  )

  if (user.token === null) return <Redirect to="/login" />

  backend.fetchTodoLists().then(todoLists => {
    const lists = todoLists.todolists.map(list =>
      createTodoListFromBackend(list)
    )
    todoListStorage.saveTodoLists(lists)
    props.history.push(`/todolist/${lists[0].uuid}`)
  })

  return <h1>Loading...</h1>
}

export default LoadTodoLists
