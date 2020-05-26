// @flow

import React from "react"
import ReactGA from "react-ga"

import StorageContext from "../shared/storageContext"
import UserStorage from "../shared/storage/userStorage"

ReactGA.initialize("UA-37191428-7", { debug: false })

const Analytics = () => {
  const userStorage = new UserStorage(React.useContext(StorageContext))
  const user = userStorage.loadUser()

  if (user) {
    ReactGA.set({
      userId: user.uuid
    })
  }

  ReactGA.pageview(window.location.pathname)

  return null
}

export default Analytics
