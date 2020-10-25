// @flow
import React from "react"

import utils from "../utils"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"

import BackendContext from "../shared/backendContext"
import UserBackend from "../shared/backend/userBackend"
import UserContext from "../components/utils/userContext"

const Auth = props => {
  const token = utils.getUrlParam("token")
  const { setUser } = React.useContext(UserContext)

  const userBackend = new UserBackend(token, React.useContext(BackendContext))

  const userStorage = new UserStorage(React.useContext(StorageContext))
  userStorage.setCLIAuth(utils.getUrlParam("cli_auth") === "true")

  React.useEffect(() => {
    userBackend.getUser().then(userData => {
      setUser(userData)

      if (userStorage.getCLIAuth()) {
        props.history.push("/cli_auth")
      } else {
        if (userData.status === "cancelled") {
          props.history.push("/profile")
        } else {
          props.history.push("/todolist")
        }
      }
    })
  }, [])

  return null
}

export default Auth
