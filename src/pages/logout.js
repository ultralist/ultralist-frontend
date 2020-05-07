// @flow
import React from "react"
import { Redirect } from "react-router-dom"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"

const Logout = () => {
  const userStorage = new UserStorage(React.useContext(StorageContext))
  userStorage.logoutUser()
  return <Redirect to="/login" />
}

export default Logout
