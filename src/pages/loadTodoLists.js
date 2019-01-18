// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import Backend from "../backend/backend"
import TestBackend from "../backend/testBackend"

import { LoadUser } from "../models/user"

type Props = {
  backend?: TestBackend,
  history: any
}

const LoadTodoLists = (props: Props) => {
  const user = LoadUser()
  if (user.token === null) return <Redirect to="/login" />

  const backend = props.backend || new Backend(user.token)

  backend.fetchTodoLists().then(todoLists => {
    window.localStorage.setItem(
      "todolists",
      JSON.stringify(todoLists.todolists)
    )

    props.history.push("/todolist")
  })

  return <h1>Loading...</h1>
}

export default LoadTodoLists
