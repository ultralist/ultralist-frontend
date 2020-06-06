// @flow
import React from "react"
import { Redirect } from "react-router-dom"
import { Typography } from "@material-ui/core"

import TopBar from "../components/topBar"
import { makeStyles } from "@material-ui/styles"

import BackendContext from "../shared/backendContext"
import TodoListBackend from "../shared/backend/todoListBackend"

import StorageContext from "../shared/storageContext"
import TodoListStorage from "../shared/storage/todoListStorage"
import UserStorage from "../shared/storage/userStorage"

import Utils from "../utils"

type Props = {
  history: any
}

const useStyles = makeStyles({
  middle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
})

const LoadTodoLists = (props: Props) => {
  const classes = useStyles()
  const todoListStorage = new TodoListStorage(React.useContext(StorageContext))
  const userStorage = new UserStorage(React.useContext(StorageContext))
  userStorage.setCLIAuthCompleted(
    Utils.getUrlParam("cli_auth_completed") === "true"
  )

  const user = userStorage.loadUser()

  const backend = new TodoListBackend(
    user.token,
    React.useContext(BackendContext),
    todoListStorage
  )

  if (user.token === null) return <Redirect to="/login" />

  backend.fetchTodoLists().then(() => {
    props.history.push("/todolist")
  })

  return (
    <React.Fragment>
      <TopBar />
      <div className={classes.middle}>
        <Typography variant="h4" marked="center" align="center">
          Loading...
        </Typography>
      </div>
    </React.Fragment>
  )

  return <h1>Loading...</h1>
}

export default LoadTodoLists
