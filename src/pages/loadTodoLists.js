// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import Backend from "../shared/backend/backend"
import Storage from "../backend/storage"
import TestBackend from "../backend/testBackend"
import { createTodoListFromBackend } from "../shared/models/todoList"

import { loadUser } from "../shared/models/user"

type Props = {
  backend?: TestBackend,
  history: any
}

const storage = new Storage()

const LoadTodoLists = (props: Props) => {
  const user = loadUser()
  if (user.token === null) return <Redirect to="/login" />

  const backend = props.backend || new Backend(user.token)

  backend.fetchTodoLists().then(todoLists => {
    const lists = todoLists.todolists.map(list => createTodoListFromBackend(list))
    storage.saveTodoLists(lists)
    props.history.push(`/todolist/${lists[0].uuid}`)
  })

  return <h1>Loading...</h1>
}

export default LoadTodoLists
