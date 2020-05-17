// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import utils from "../utils"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"

import BackendContext from "../shared/backendContext"
import UserBackend from "../shared/backend/userBackend"

const Auth = () => {
  const token = utils.getUrlParam("token")

  const userBackend = new UserBackend(token, React.useContext(BackendContext))

  const userStorage = new UserStorage(React.useContext(StorageContext))
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    userBackend.getUser().then(userData => {
      userStorage.loginUser(userData)
      setUser(userData)
    })
  }, [])

  if (!user) return null

  return user.status === "cancelled" ? (
    <Redirect to="/profile" />
  ) : (
    <Redirect to="/loading" />
  )
}

export default Auth
