// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import Backend from "../backend/backend"
import TestBackend from "../backend/testBackend"
import { createTodoListFromBackend } from "../shared/models/todoList"

import StorageContext from "../shared/storageContext"
import TodoListStorage from "../shared/storage/todoListStorage"
import UserStorage from "../shared/storage/userStorage"

type Props = {
  backend?: TestBackend,
  history: any
}

const LoadTodoLists = (props: Props) => {
  const todoListStorage = new TodoListStorage(React.useContext(StorageContext))
  const userStorage = new UserStorage(React.useContext(StorageContext))

  const user = userStorage.loadUser()

  if (user.token === null) return <Redirect to="/login" />

  const backend = props.backend || new Backend(user.token)

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
