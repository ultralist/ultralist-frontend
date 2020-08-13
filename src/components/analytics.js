// @flow

import React from "react"
import ReactGA from "react-ga"

import UserContext from "./utils/userContext"

ReactGA.initialize("UA-37191428-7", { debug: false })

const Analytics = () => {
  const { user } = React.useContext(UserContext)

  if (user) {
    ReactGA.set({
      userId: user.uuid
    })
  }

  ReactGA.pageview(window.location.pathname)

  return null
}

export default Analytics
