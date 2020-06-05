// @flow
import React from "react"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"

import BackendContext from "../shared/backendContext"
import ApiKeysBackend from "../shared/backend/apiKeysBackend"

// gets called during CLI auth process.
// always returns null, as ultimiately it 301 redirects the user back to the CLI backend.
const CLIAuth = () => {
  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  const apiKeysbackend = new ApiKeysBackend(
    user.token || "",
    React.useContext(BackendContext)
  )

  userStorage.setCLIAuth(false)
  apiKeysbackend.cliKey().then(key => {
    window.location.replace("http://localhost:9976?token=" + key.token)
  })

  return null
}

export default CLIAuth
