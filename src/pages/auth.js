// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import utils from "../utils"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"

import BackendContext from "../shared/backendContext"
import UserBackend from "../shared/backend/userBackend"

import useUserStorage from "../components/utils/useUserStorage"

const Auth = props => {
  const token = utils.getUrlParam("token")

  const userBackend = new UserBackend(token, React.useContext(BackendContext))

  const [user, setUser] = useUserStorage()
  const userStorage = new UserStorage(React.useContext(StorageContext))

  React.useEffect(() => {
    userBackend.getUser().then(setUser)
  }, [])

  if (!user) return null

  if (userStorage.getCLIAuth()) {
    props.history.push("/cli_auth")
    return null
  }

  return user.status === "cancelled" ? (
    <Redirect to="/profile" />
  ) : (
    <Redirect to="/todolist" />
  )
}

export default Auth
