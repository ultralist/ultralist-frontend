// @flow
import React from "react"

import UserModel from "../../shared/models/user"

import StorageContext from "../../shared/storageContext"
import UserStorage from "../../shared/storage/userStorage"

const useUserStorage = (initialUser: ?UserModel) => {
  const userStorage = new UserStorage(React.useContext(StorageContext))

  const [storedUser, setStoredUser] = React.useState(
    userStorage.loadUser() || initialUser
  )

  const setUser = user => {
    userStorage.saveUser(user)
    setStoredUser(user)
  }

  return [storedUser, setUser]
}

export default useUserStorage
