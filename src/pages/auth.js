// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import utils from "../utils"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"

import BackendContext from "../shared/backendContext"
import UserBackend from "../shared/backend/userBackend"

const Auth = props => {
  const token = utils.getUrlParam("token")

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const userBackend = new UserBackend(
    token,
    React.useContext(BackendContext),
    userStorage
  )

  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    userBackend.getUser().then(userData => {
      setUser(userData)
    })
  }, [])

  if (!user) return null

  if (userStorage.getCLIAuth()) {
    props.history.push("/cli_auth")
    return null
  }

  return user.status === "cancelled" ? (
    <Redirect to="/profile" />
  ) : (
    <Redirect to="/loading" />
  )
}

export default Auth
